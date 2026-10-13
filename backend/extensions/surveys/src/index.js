import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { SurveyError, validateSubmission } from './validation.js';

export default { id: "surveys", handler: (router, { database, env }) => {
  function authorize(body, slug) {
    const secret = env.FORMS_HMAC_SECRET;
    if (!secret) throw new SurveyError('Obsługa ankiet nie jest skonfigurowana.', 503);
    const { payload, signature } = body ?? {};
    if (typeof payload !== 'string' || Buffer.byteLength(payload) > 131072 || typeof signature !== 'string' || !/^[a-f0-9]{64}$/.test(signature)) throw new SurveyError('Brak autoryzacji.', 403);
    const expected = createHmac('sha256', secret).update(payload).digest();
    if (!timingSafeEqual(expected, Buffer.from(signature, 'hex'))) throw new SurveyError('Brak autoryzacji.', 403);
    const data = JSON.parse(payload);
    if (data.slug !== slug || !Number.isFinite(data.timestamp) || Math.abs(Date.now() - data.timestamp) > 60000) throw new SurveyError('Niepoprawny podpis.', 403);
    return data;
  }
  router.get('/:slug', async (req, res) => {
    try {
      const data = authorize({ payload: req.get('x-survey-payload'), signature: req.get('x-survey-signature') }, req.params.slug);
      if (data.action !== 'read') throw new SurveyError('Brak autoryzacji.', 403);
      const survey = await database.transaction(async trx => {
        const item = await trx('surveys').where({slug:data.slug,status:'published'}).forShare().first(
          'id','title','slug','description','mode','privacy_notice','success_message',
          'contact_name','contact_email','contact_phone','contact_company');
        if (!item) throw new SurveyError('Ankieta jest niedostępna.', 404);
        const questions = await trx('survey_questions').where({survey:item.id}).orderBy('sort').orderBy('id')
          .select('id','title','description','type','required');
        const options = await trx('survey_options').whereIn('question',questions.map(q => q.id)).orderBy('sort').orderBy('id').select('id','question','label');
        const { id, ...publicItem } = item;
        return { ...publicItem, questions: questions.map(q => ({...q, options:options.filter(o => o.question === q.id).map(({id,label}) => ({id,label}))})) };
      });
      res.set('Cache-Control','no-store').json(survey);
    } catch (error) {
      res.status(error instanceof SurveyError ? error.status : 500).json({ok:false,error:error instanceof SurveyError ? error.message : 'Nie udało się pobrać ankiety.'});
    }
  });
  router.post('/:slug', async (req, res) => {
    try {
      const data = authorize(req.body, req.params.slug);
      if (data.action !== 'submit' || !/^[a-f0-9]{64}$/.test(data.rateKey ?? '')) throw new SurveyError('Niepoprawny podpis.', 403);
      // Separate transaction keeps rejected attempts in the shared rate counter.
      await database.transaction(async trx => {
        const bucket = Math.floor(Date.now() / 600000);
        await trx.raw('DELETE FROM survey_rate_limits WHERE bucket < ?', [bucket - 1]);
        const result = await trx.raw(`INSERT INTO survey_rate_limits (key, bucket, attempts) VALUES (?, ?, 1)
          ON CONFLICT (key, bucket) DO UPDATE SET attempts = survey_rate_limits.attempts + 1 RETURNING attempts`, [data.rateKey, bucket]);
        if (result.rows[0].attempts > 10) data.limited = true;
      });
      if (data.limited) throw new SurveyError('Zbyt wiele prób. Spróbuj za 10 minut.', 429);
      await database.transaction(async trx => {
        const survey = await trx('surveys').where({ slug: data.slug }).forUpdate().first();
        if (!survey) throw new SurveyError('Ankieta jest niedostępna.', 404);
        const questions = await trx('survey_questions').where({ survey: survey.id }).orderBy('sort').orderBy('id');
        const options = await trx('survey_options').whereIn('question', questions.map(q => q.id)).orderBy('sort').orderBy('id');
        const valid = validateSubmission(survey, questions, options, data.body);
        const id = randomUUID();
        await trx('survey_submissions').insert({ id, survey: survey.id, ...valid.contact });
        await trx('survey_answers').insert(valid.answers.map(answer => ({
          ...answer, id: randomUUID(), submission: id,
          value: JSON.stringify(answer.value), option_labels: JSON.stringify(answer.option_labels),
        })));
      });
      res.json({ ok: true });
    } catch (error) {
      // Never log submitted answers or contact details.
      res.status(error instanceof SurveyError ? error.status : 500).json({
        ok: false, error: error instanceof SurveyError ? error.message : 'Nie udało się zapisać ankiety. Spróbuj ponownie.',
      });
    }
  });
} };

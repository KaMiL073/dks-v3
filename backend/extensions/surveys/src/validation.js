export class SurveyError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export function validateSubmission(survey, questions, options, body) {
  if (survey.status !== 'published') throw new SurveyError('Ankieta jest niedostępna.', 404);
  if (!record(body) || !record(body.answers)) throw new SurveyError('Niepoprawne odpowiedzi.');
  if (!questions.length) throw new SurveyError('Ankieta nie ma pytań.', 409);
  const allowed = new Set(questions.map(q => q.id));
  if (Object.keys(body.answers).some(id => !allowed.has(id))) throw new SurveyError('Nieznane pytanie.');
  const answers = questions.map(q => {
    const raw = body.answers[q.id];
    let value;
    if (q.type === 'short_text' || q.type === 'long_text') {
      if (raw !== undefined && typeof raw !== 'string') throw new SurveyError(`Niepoprawna odpowiedź: ${q.title}`);
      value = (raw ?? '').trim();
      if (value.length > (q.type === 'short_text' ? 500 : 10000)) throw new SurveyError(`Odpowiedź jest za długa: ${q.title}`);
    } else {
      const available = options.filter(o => o.question === q.id);
      if (!available.length) throw new SurveyError('Pytanie nie ma opcji odpowiedzi.', 409);
      const ids = new Set(available.map(o => o.id));
      if (q.type === 'single_choice') {
        if (raw !== undefined && typeof raw !== 'string') throw new SurveyError(`Niepoprawny wybór: ${q.title}`);
        value = raw || '';
        if (value && !ids.has(value)) throw new SurveyError(`Nieznana opcja: ${q.title}`);
      } else if (q.type === 'multiple_choice') {
        value = raw ?? [];
        if (!Array.isArray(value) || value.some(v => typeof v !== 'string' || !ids.has(v)) || new Set(value).size !== value.length) throw new SurveyError(`Niepoprawny wybór: ${q.title}`);
      } else throw new SurveyError('Nieobsługiwany typ pytania.', 409);
    }
    if (q.required && !value.length) throw new SurveyError(`Uzupełnij pytanie: ${q.title}`);
    const chosen = Array.isArray(value) ? value : q.type === 'single_choice' && value ? [value] : [];
    return { question: q.id, question_title: q.title, question_type: q.type, value,
      option_labels: options.filter(o => chosen.includes(o.id)).map(o => o.label) };
  });
  const contact = {};
  if (survey.mode === 'contact') {
    if (!record(body.contact)) throw new SurveyError('Uzupełnij dane kontaktowe.');
    for (const field of ['name', 'email', 'phone', 'company']) {
      const setting = survey[`contact_${field}`];
      if (!setting || setting === 'hidden') continue;
      const raw = body.contact[field];
      if (raw !== undefined && typeof raw !== 'string') throw new SurveyError('Niepoprawne dane kontaktowe.');
      const value = (raw ?? '').trim();
      if (setting === 'required' && !value) throw new SurveyError(`Uzupełnij pole kontaktowe: ${field}`);
      if (value.length > 250 || (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) throw new SurveyError('Niepoprawne dane kontaktowe.');
      contact[field] = value || null;
    }
  }
  return { contact, answers };
}

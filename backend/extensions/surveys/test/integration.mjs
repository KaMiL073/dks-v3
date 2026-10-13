// Run inside the local Directus container after migrations, with the local
// frontend reCAPTCHA bypass enabled. All fixtures are removed in finally.
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { randomUUID, createHmac } from 'node:crypto';
const require = createRequire(import.meta.url);
const packages = '/directus/node_modules/.pnpm';
const pgPackage = readdirSync(packages).find(name => /^pg@/.test(name));
const { Client } = require(`${packages}/${pgPackage}/node_modules/pg`);
const db = new Client({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT), database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
await db.connect();
const id = randomUUID(), q1 = randomUUID(), q2 = randomUUID(), q3 = randomUUID(), q4 = randomUUID(), o1 = randomUUID(), o2 = randomUUID();
const slug = `test-ankiety-${Date.now()}`;
const sign = value => createHmac('sha256', process.env.FORMS_HMAC_SECRET).update(value).digest('hex');
const rateKey = sign(randomUUID());
const answers = { [q1]: ' Uwagi ', [q2]: o1, [q3]: [o2], [q4]: 'Krótka odpowiedź' };
async function post(body, key = sign(randomUUID()), extra = {}) {
  const payload = JSON.stringify({ action: "submit", slug, timestamp: Date.now(), rateKey: key, body, ...extra });
  const response = await fetch(`http://localhost:8055/surveys/${slug}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({payload, signature:sign(payload)}) });
  return { status: response.status, body: await response.json() };
}
const query = (sql, values) => db.query(sql, values);
let checks = 0;
const check = name => { checks++; console.log(`PASS ${name}`); };
try {
  const created = await fetch('http://localhost:8055/items/surveys', {
    method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.SERVICE_USER_TOKEN}`},
    body:JSON.stringify({id,title:'Test integracyjny ankiet',slug,status:'published',questions:[
      {id:q1,sort:1,title:'Uwagi',type:'long_text',required:true},
      {id:q2,sort:2,title:'Ocena',type:'single_choice',required:true,options:[{id:o1,label:'Dobrze'}]},
      {id:q3,sort:3,title:'Zainteresowania',type:'multiple_choice',required:true,options:[{id:o2,label:'Serwis'}]},
      {id:q4,sort:4,title:'Komentarz',type:'short_text',required:false},
    ]}),
  });
  assert.equal(created.status,200,await created.text()); check('Directus creator saves nested questions and options');
  const noAuth = await fetch(`http://localhost:8055/surveys/${slug}`, {method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
  assert.equal(noAuth.status,403); check('unsigned submissions denied');
  assert.equal((await post({answers}, rateKey, {timestamp:Date.now()-120000})).status,403); check('expired signatures denied');
  const invalid = await post({answers:{...answers,[q2]:o2}});
  assert.equal(invalid.status,400);
  assert.equal((await query('SELECT count(*) FROM survey_submissions WHERE survey=$1',[id])).rows[0].count,'0'); check('invalid options leave no partial submission');
  // Exercise frontend -> signed endpoint -> PostgreSQL using the existing proxy.
  const page = await fetch(`http://proxy/ankiety/${slug}`,{headers:{host:'localhost'}});
  assert.equal(page.status,200);
  const html = await page.text(); assert.ok(html.includes('Test integracyjny ankiet')); assert.ok(html.includes('Zainteresowania')); check('published page renders all question types');
  const frontend = await fetch(`http://proxy/api/ankiety/${slug}`, {method:'POST',headers:{host:'localhost','Content-Type':'application/json'},body:JSON.stringify({answers,contact:{email:'discard@example.com'},website:'',recaptchaToken:''})});
  assert.equal(frontend.status,200,await frontend.text());
  const submission = (await query('SELECT * FROM survey_submissions WHERE survey=$1',[id])).rows[0];
  assert.equal(submission.email,null); assert.equal(submission.name,null);
  const saved = (await query('SELECT * FROM survey_answers WHERE submission=$1',[submission.id])).rows;
  assert.equal(saved.length,4); assert.equal(saved.find(a=>a.question===q1).value,'Uwagi');
  assert.deepEqual(saved.find(a=>a.question===q2).option_labels,['Dobrze']);
  assert.equal(saved.find(a=>a.question===q2).answer_text,'Dobrze');
  assert.equal(saved.find(a=>a.question===q3).answer_text,'Serwis');
  assert.equal(saved.find(a=>a.question===q1).answer_text,'Uwagi'); check('frontend submits atomically and anonymous contact is discarded');
  for (const sql of ['UPDATE survey_questions SET type=\'short_text\' WHERE survey=$1','DELETE FROM survey_options WHERE question IN (SELECT id FROM survey_questions WHERE survey=$1)','UPDATE surveys SET mode=\'contact\' WHERE id=$1']) {
    await assert.rejects(query(sql,[id]), /Ankieta ma odpowiedzi/);
  }
  await assert.rejects(query('INSERT INTO survey_submissions (survey,email) VALUES ($1,$2)',[id,'invalid@example.com']), /Anonimowa/); check('database protects structure and anonymous data');
  await query('DELETE FROM survey_submissions WHERE survey=$1',[id]);
  await query("UPDATE surveys SET mode='contact',contact_email='required',contact_name='optional' WHERE id=$1",[id]);
  assert.equal((await post({answers,contact:{email:'invalid'}})).status,400);
  assert.equal((await post({answers,contact:{email:'respondent@example.com',name:'Jan',phone:'discard'}})).status,200);
  const contact = (await query('SELECT * FROM survey_submissions WHERE survey=$1',[id])).rows[0];
  assert.equal(contact.email,'respondent@example.com'); assert.equal(contact.phone,null); check('contact mode enforces email and excludes hidden fields');
  const publicRead = await fetch('http://localhost:8055/items/survey_submissions');
  assert.equal(publicRead.status,403);
  const configRead = await fetch(`http://localhost:8055/surveys/${slug}`);
  assert.equal(configRead.status,403); check('public cannot read responses or unsigned configuration');
  await query("UPDATE surveys SET status='draft' WHERE id=$1",[id]);
  assert.equal((await post({answers})).status,404);
  const draft = await fetch(`http://proxy/ankiety/${slug}`,{headers:{host:'localhost'}}); assert.equal(draft.status,404); check('draft page and submissions unavailable');
  for (let i=0;i<10;i++) assert.equal((await post({answers},rateKey)).status,404);
  assert.equal((await post({answers},rateKey)).status,429); check('shared database rate limit survives separate requests');
  console.log(`${checks} integration checks passed`);
} finally {
  await query('DELETE FROM survey_submissions WHERE survey=$1',[id]);
  await query('DELETE FROM survey_options WHERE question IN (SELECT id FROM survey_questions WHERE survey=$1)',[id]);
  await query('DELETE FROM survey_questions WHERE survey=$1',[id]);
  await query('DELETE FROM surveys WHERE id=$1',[id]);
  await query('DELETE FROM survey_rate_limits WHERE key=$1',[rateKey]);
  await db.end();
}

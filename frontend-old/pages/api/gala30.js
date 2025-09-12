import saveFormData from '../../lib/models/gala30';

async function validateCaptcha(recaptchaResponse) {
  const SECRET_KEY = process.env.RECAPTCHA_SECRET;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${recaptchaResponse}`;

  try {
    const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
    const recaptchaJson = recaptchaRes.json();

    return recaptchaJson;
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  const { recaptchaResponse } = req.body;
  const captcha = await validateCaptcha(recaptchaResponse);
  if (captcha.success) {
    delete req.body.recaptchaResponse;
    const resp = await saveFormData(req.body);
    res.status(200).json(resp);
  } else {
    res.status(400).json('recaptcha failed');
  }
}

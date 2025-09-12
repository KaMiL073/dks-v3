import getNews from '../../lib/models/news';

export default async function handler(req, res) {
  const { page } = req.body;
  const offsetPage = page < 2 ? 0 : page - 1;
  const LIMIT = 9;
  const data = await getNews({ limit: LIMIT, offset: offsetPage * LIMIT });
  res.status(200).json(data);
}

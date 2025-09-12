import { getProductsWithMainImage } from '../../lib/models/products';

export default async function handler(req, res) {
  const { brand, filters, collectionName } = req.body;
  const data = await getProductsWithMainImage({ brand, filters, collectionName });
  res.status(200).json(data);
}

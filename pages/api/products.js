import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;

  async function deleteImages(images) {
    await Promise.all(images.map((image) => cloudinary.uploader.destroy(image.public_id)));
  }

  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === 'POST') {
    const { title, description, price, stock, images, category, properties, imagesToDelete } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      stock,
      images,
      category,
      properties,
    });
    await deleteImages(imagesToDelete);
    res.json(productDoc);
  }

  if (method === 'PUT') {
    const { title, description, price, stock, images, category, properties, _id, imagesToDelete } = req.body;
    const product = await Product.findById(_id);
    const updatedImages = product.images.filter((image) => !imagesToDelete.includes(image.public_id));
    await Product.updateOne({ _id }, { title, description, price, stock, images: updatedImages, category, properties });
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    } else if (req.query?.image) {
      await axios.delete(`/api/upload/${req.query.image}`);
      res.json(true);
    }
  }
}
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { isAdminRequest } from "./auth/[...nextauth]";
import { v2 as cloudinary } from 'cloudinary';

export default async function handle(req, res) {
  const { method } = req;

  cloudinary.config({
    timeout: 60000,
  });

  async function deleteImages(images) {
    console.log("Deleting images:", images);
    await Promise.all(images.map((image) => {
      console.log(`Deleting image with public_id: ${image.public_id}`);
      return cloudinary.uploader.destroy(image.public_id);
    }));
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
    const { title, description, price, stock, images, category, parentCategory, properties, imagesToDelete } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      stock,
      images,
      category: category || null,
      parentCategory: parentCategory || null, 
      properties,
    });
    if (imagesToDelete?.length > 0) {
      await deleteImages(imagesToDelete);
    }
    res.json(productDoc);
  }

  if (method === 'PUT') {
    const { title, description, price, stock, images, category, parentCategory, properties, _id, imagesToDelete } = req.body;
    
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (imagesToDelete?.length > 0) {
      await deleteImages(imagesToDelete);
    }

    // Filter the images to be updated
    const updatedImages = product.images.filter((image) => {
      // If imagesToDelete contains full image objects, we compare public_id
      return !imagesToDelete.some((img) => img.public_id === image.public_id);
    });
  
    // Find new images that are not already in updatedImages by public_id
    const newImages = images.filter((image) => {
      return !updatedImages.some((img) => img.public_id === image.public_id);
    });
  
    // Merge the updated and new images into one array
    updatedImages.push(...newImages);
    
    await Product.updateOne(
      { _id },
      {
        title,
        description,
        price,
        stock,
        images: updatedImages,
        category: category || null,
        parentCategory: parentCategory || null,
        properties,
      }
    );
    res.json(true);
  }

  if (method === 'DELETE') {
    const { id } = req.query;

    try {
      // Find the product by ID
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Delete images from Cloudinary first
      if (product.images?.length > 0) {
        try {
          await deleteImages(product.images);
        } catch (error) {
          console.error("Error deleting images from Cloudinary:", error);
          return res.status(500).json({ message: "Failed to delete images from Cloudinary" });
        }
      }

      // Delete the product from the database
      await Product.findByIdAndDelete(id);

      return res.status(200).json({ message: "Product and images deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ message: "Failed to delete product" });
    }
  }
}
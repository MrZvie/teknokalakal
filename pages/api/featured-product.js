import { mongooseConnect } from "@/lib/mongoose";
import { FeaturedProduct } from "@/models/FeaturedProduct";
import { Product } from "@/models/Products";

export default async function handler(req, res) {
  await mongooseConnect();

  if(req.method === "GET") {
    const featuredProduct = await FeaturedProduct.findOne();
    res.json(featuredProduct);
  }

  if (req.method === "PUT") {
    const { featuredProductId } = req.body; 

    try {
      // Find the product by ID to get its name
      const product = await Product.findById(featuredProductId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Save the featured product
      const featuredProduct = await FeaturedProduct.findOneAndUpdate(
        {},
        {
          featuredProductId: product._id,
          featuredProductName: product.title,
        },
        { new: true, upsert: true } 
      );

      return res.status(200).json({ featuredProduct });
    } catch (error) {
      console.error("Error updating featured product:", error);
      return res.status(500).json({ error: "Failed to update featured product" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

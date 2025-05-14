import mongoose, { model, models, Schema } from "mongoose";

const ProductSchema = new Schema({
    vendorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    images: [
        {
          public_id: { type: String },
          link: { type: String },
        },
    ],
    reviews: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
      }
    ],
    videoLink: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category' }, // child category
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' }, // parent category
    properties: { type: Object },
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);

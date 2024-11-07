import mongoose, { model, models, Schema } from "mongoose";


const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    images: [
        {
          public_id: { type: String },
          link: { type: String },
        },
      ],
    category: {type: mongoose.Types.ObjectId, ref: 'Category'},
    properties: {type: Object},
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);
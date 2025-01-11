// models/FeaturedProduct.js
const { Schema, models, model } = require("mongoose");

const FeaturedProductSchema = new Schema(
  {
    featuredProductId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    featuredProductName: { type: String, required: true },
  },
  { timestamps: true }
);

export const FeaturedProduct = models.FeaturedProduct || model('FeaturedProduct', FeaturedProductSchema);

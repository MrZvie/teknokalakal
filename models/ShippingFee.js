const { Schema, models, model } = require("mongoose");

const ShippingFeeSchema = new Schema({
  shippingFee: { type: Number, required: true, default: 25 },
}, { timestamps: true });

export const ShippingFee = models.ShippingFee || model('ShippingFee', ShippingFeeSchema);

const { Schema, models, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    phone: String,
    reference_number: String,
    address: {
      streetAddress: String,
      barangay: String,
      municipality: String,
      province: String,
      postalCode: String,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'insufficient_funds', 'cancelled', 'checkout_cancelled', 'checkout_expired'],
      default: 'pending'
    },
    statusDescription: {
      type: String,
      default: 'Order pending payment'
    },
    failed_code: { // To store the exact failed_code from PayMongo
      type: String,
      enum: ['insufficient_funds', 'card_declined', 'expired_card', 'processing_error', null],
      default: null
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Order = models?.Order || model("Order", OrderSchema);

const { Schema, models, model } = require("mongoose");

const VendorSchema = new Schema({
    vendorId: { type: Schema.Types.ObjectId, ref: "User" },
    businessInfo: {
      name: String,
      description: String,
      address: {
        streetAddress: { type: String, default: '' },
        barangay: { type: String, default: '' },
        municipality: { type: String, default: '' },
        province: { type: String, default: '' },
        postalCode: { type: String, default: '' },
      },
      phone: String,
      email: String
    },
    certifications: [
      {
        public_id: { type: String },
        link: { type: String },
      },
  ],
    status: { type: String, enum: ["pending", "approved", "rejected"] },
    registrationDate: Date,
    lastUpdated: Date,
    rating: Number,
});

export const Vendor = models?.Vendor || model("Vendor", VendorSchema);
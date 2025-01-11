import { mongooseConnect } from "@/lib/mongoose";
import { Vendor } from "@/models/Vendor";

export default async function handler(req, res) {
  await mongooseConnect();

  const { id } = req.query; // Get the ID from the URL

  if (req.method === "PATCH") {
    const { status } = req.body;

    try {
      const vendor = await Vendor.findByIdAndUpdate(id, { status }, { new: true });
      if (!vendor) {
        return res.status(404).json({ message: "Vendor application not found." });
      }
      res.status(200).json(vendor); // Return updated vendor
    } catch (error) {
      res.status(500).json({ message: "Failed to update application status." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}

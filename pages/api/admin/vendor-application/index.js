import { mongooseConnect } from "@/lib/mongoose";
import { Vendor } from "@/models/Vendor";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "GET") {
    try {
      const applications = await Vendor.find().sort({ registrationDate: -1 });
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor applications." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}

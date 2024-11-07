import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  try {
    await mongooseConnect();
    const orders = await Order.find().sort({createdAt:-1});
    res.json(orders);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

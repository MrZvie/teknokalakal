import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    try {
      
      const admins = await User.find({ });

      // If no admins are found, send an empty array or a message
      if (!admins.length) {
        return res.status(200).json({ message: 'No admins found' });
      }

      res.status(200).json(admins); // Send back the found admins
    } catch (error) {
      console.error('Error fetching admins:', error);
      res.status(500).json({ message: 'Error fetching admins' });
    }
  }
}

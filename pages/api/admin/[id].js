import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await mongooseConnect();

  if (method === 'GET') {
    try {
      const admin = await User.findById(id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.json(admin);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching admin' });
    }
  }

  if (method === 'PUT') {
    try {
      const admin = await User.findById(id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      const { name, username, role } = req.body;

      // Only allow changes to name, username, and role
      if (admin.provider === 'credentials') {
        // If the provider is 'credentials', all fields can be updated
        admin.name = name || admin.name;
        admin.username = username || admin.username;
        admin.role = role || admin.role;
      } else {
        return res.status(400).json({ message: 'Unknown provider, cannot update' });
      }

      await admin.save();
      res.json({ message: 'Admin updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating admin' });
    }
  }

  if (method === 'DELETE') {
    try {
      const admin = await User.findById(id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      await User.findByIdAndDelete(id);
      res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting admin' });
    }
  }
}

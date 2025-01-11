import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name, username } = req.body;

    try {
      await mongooseConnect(); // Ensure DB connection is established

      // Check if the user already exists (admin or regular user)
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Check if the username is already taken
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      // Ensure password is provided for 'credentials' provider
      if (!password) {
        return res.status(400).json({ message: 'Password is required for credentials provider' });
      }

      // Create a new user with the 'credentials' provider
      const newUserData = {
        email,
        provider: 'credentials', // Only support 'credentials' provider
        username,
        role: 'admin', // Set the role to 'admin' by default
        name, // Set name for credentials-based login
        password, // Password will be hashed in the schema
      };

      // Add the new user
      const newUser = new User(newUserData);
      await newUser.save();

      res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
      console.error(error); // Log the error to help debug
      res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

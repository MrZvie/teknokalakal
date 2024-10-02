import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

cloudinary.config({
    url: process.env.CLOUDINARY_URL,
  });
  const upload = multer({ dest: 'upload/' }).single('file');

  export default async function handler(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);
  
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file' });
      }
  
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file provided' });
      }
  
      try {
        const result = await cloudinary.uploader.upload(file.path);
        return res.status(200).json({ link: result.secure_url });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error uploading file' });
      }
    });
  }

export const config = {
  api: {
    bodyParser: false,
  },
};
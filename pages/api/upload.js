import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';
import fs from 'fs'

cloudinary.config({
  url: process.env.CLOUDINARY_URL,
});

const upload = multer({ dest: 'upload/' }).single('file');

export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === 'POST') {
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
        fs.unlinkSync(file.path);
        return res.status(200).json({ public_id: result.public_id, link: result.secure_url });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error uploading file' });
      }
    });
  } else if (req.method === 'DELETE') {
    const image = req.query.image.public_id;
    try {
      await cloudinary.uploader.destroy('images/'+image);
      res.json(true);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting image' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
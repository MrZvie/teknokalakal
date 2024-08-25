import multer from 'multer';

const upload = multer({ dest: '/public', limits: { fieldSize: 1024 * 1024 * 5 } });

export default async function handle(req, res) {
  upload.array('file', 5)(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading files' });
    }
    const files = req.files;
    res.json({ message: 'Files uploaded successfully', urls: files.map((file) => `/public/${file.filename}`) });
  });
}
export const config = {
  api: {bodyParser: false},
};
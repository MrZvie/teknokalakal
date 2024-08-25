import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";


export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if (method === 'GET') {
        if(req.query?.id) {
            res.json(await Product.findOne({_id:req.query.id}));
        } else {
            res.json(await Product.find());
        }
    }

    if (method === 'POST') {
        const { title, description, price } = req.body;
        const productDoc = await Product.create({
          title,
          description,
          price,
          images: [], // Initialize images field as an empty array
        });
    
        // Handle image upload
        if (req.files) {
          const images = await Promise.all(
            req.files.map((file) => {
              const imageUrl = `public/${file.filename}`;
              return imageUrl;
            })
          );
          productDoc.images = images;
          await productDoc.save();
        }
    
        res.json(productDoc);
      }
    if(method === 'PUT') {
        const {title,description, price,_id} = req.body;
        await Product.updateOne({_id},{title,description,price});
        res.json(true);
    }
    if(method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}
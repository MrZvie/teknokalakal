import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    if (method === 'GET') {
        if(req.query?.id) {
            res.json(await Product.findOne({_id:req.query.id}));
        } else {
            res.json(await Product.find());
        }
    }

    if(method === 'POST') {
        const {title,description, price, stock, images, category, properties} = req.body;
        const productDoc = await Product.create({
            title,
            description,
            price,
            stock,
            images,
            category,
            properties,
        })
        res.json(productDoc);
    }
    if (method === 'PUT') {
        const {title,description, price, stock, images, category, properties, _id} = req.body;
        const product = await Product.findById(_id);
        const imagesToDelete = product.images.filter((image) => !images.includes(image));
        await Promise.all(imagesToDelete.map((image) => axios.delete(`/api/upload/${image}`)));
        await Product.updateOne({_id},{title,description,price, stock,images,category,properties});
        res.json(true);
      }
    if(method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}
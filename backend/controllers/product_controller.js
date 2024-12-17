import mongoose from 'mongoose';
import Product from "../model/product_model.js";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb ) => {
        cb(null, path.resolve('uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
export const upload = multer({storage});

export const getProducts =  async (req,res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    try {
        const products = await Product.find(query).limit(limit * 1).skip((page - 1) * limit).exec();
        const count = await Product.countDocuments(query);

        res.status(200).json({ success: true, data: products, totalPages: Math.ceil(count / limit), currentPage: page });
    }catch (error){
        console.log("error in fetching products", error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
}

export const create_product = async (req,res) => {
    const { name , price, stock , description } = req.body;
    const image = req.file?.path || "bla.png";
    if(!name || !price || !image || !stock ){
        return res.status(400).json({success: false , message : "please enter all field"});
    }
    try {
        const newProduct = new Product({
            name,
            price,
            stock,
            description,
            image,
            owner: req.user.id,
        });
        await newProduct.save();
        res.status(201).json({success: true , data: newProduct});
    }catch (error){
        res.status(500).json({success: false , message: `server error ${error}`});
    }
}

export const update_product = async (req,res) =>{
    const {id} = req.params;
    const product = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ seccess: false , message: "product not found"});
    }
    try {
        const updated_product = await Product.findByIdAndUpdate(id , product , {new: true});
        res.status(200).json( { success: true, data: updated_product});
    } catch (error) {
        
        res.status(500).json( { success: false, message: "Server Error"});
    }
}

export const delete_product = async (req,res) =>{
    const {id} = req.params;
    // console.log("id:",id);
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ seccess: false , message: "product not found"});
    }
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true , message: "Product deleted" });
    }catch(error){
        console.log("error in deleting products", error.message);
        res.status(500).json({ success: false , message: "Server Error" });
    }
}
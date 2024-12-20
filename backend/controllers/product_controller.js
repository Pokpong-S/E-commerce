import mongoose from 'mongoose';
import Product from "../model/product_model.js";

export const getProducts =  async (req,res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    try {
        const products = await Product.find(query).limit(limit * 1).skip((page - 1) * limit).exec();
        const count = await Product.countDocuments(query);

        res.status(200).json({ success: true, data: products, totalPages: Math.ceil(count / limit), currentPage: page });
    } catch (error) {
        console.log("Error in fetching products:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const create_product = async (req, res) => {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    const { name, price, stock, description } = req.body;
    const image = req.file?.filename;
    if (!name || !price || !image || !stock) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }
    try {
        const newProduct = new Product({
            name,
            price,
            stock,
            description,
            image,
            owner: req.user.username,
        });
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: `Server error ${error}` });
    }
}

export const update_product = async (req, res) => {
    const { id } = req.params;

	const product = req.body;
    console.log(`product : ${JSON.stringify(product)}`);

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}
    
	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
		res.status(200).json({ success: true, data: updatedProduct });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const delete_product = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch(error){
        console.log("Error in deleting products:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

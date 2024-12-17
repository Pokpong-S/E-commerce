import User from '../model/user_model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Product from '../model/product_model.js';
dotenv.config();

export const SignUp = async (req, res) => {
    const { username, password } = req.body;
    console.log("Received signup data:", req.body); 
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        // console.log("Username already taken:", username);
        return res.status(400).json({ success: false, message: 'Username already in use.' });
    }
    try {
        const newUser = new User({
            username,
            password
        });
        await newUser.save();
        console.log("User registered successfully:", newUser);
        res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('SignUp Error:', error); 
        res.status(500).json({ success: false, message: "Server Error "});
    }
};



export const Login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({ username });
        if(!user){
            return res.status(401).json({success: false , message: 'Invalid credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({success: false , message: 'Invalid credentials'});
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );
        res.status(200).json({ user: { username: user.username, role: user.role }, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({success: false , message: "Internal Server Error"});
    }
}

export const Request2be = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({success: false,message: 'User not found' });

        if(user.roleRequest === 'Merchant'){
            return res.status(400).json({success: false,message: 'You have already requested to become a Merchant'});
        }

        if(user.role == 'Merchant'){
            return res.status(400).json({success: false , message: 'You are already a Merchant'});

        }
        user.roleRequest = 'Merchant';
        await user.save();
        res.status(200).json({success: true, message: 'Your request to become a shopkeeper has been submitted' });
    }catch (error){
        res.status(500).json({success: false , message: 'sever error'});
    }
}

export const getProfile = async (req, res ) => {
    try{
        const user = await User.findById(req.user.id).populate('purchaseHistory');
        if(!user) return res.status(404).json({suceess: false, message: 'usernot found'});
        res.json({success: true , user});
    }catch (error){
        res.status(500).json({success: false , message: 'Server Error'});
    }
}

export const purchaseItems = async (req, res) =>{
    const {items} = req.body;
    try {
        const user = await User.findById(req.user.id);
        if(!user)return res.status(404).json({success: false , message: 'User not found'});
        for(let item of items){
            const product = await Product.findById(item._id);
            if(product && product.stock >= 1){
                product.stock -= 1;
                await product.save();
                user.purchaseHistory.push(product);
            }else{
                return res.status(400).json({success: false, message : `${item.name} is out of stock`});
            }
        }
        await user.save();
        res.json({success: true, message: 'puechase successful'})
    }catch (error){
        res.status(500).json({success: false , message: 'Server Error'});
    }
}
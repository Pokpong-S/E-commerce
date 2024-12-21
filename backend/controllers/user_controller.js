import User from '../model/user_model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import validator from 'validator';
dotenv.config();

export const SignUp = async (req, res) => {
    const { username, password } = req.body;
      if (!validator.isStrongPassword(password)) {
        return res.status(100).json({ success: false, message: 'password not strong.' });
      }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already in use.' });
    }
    try {
        const newUser = new User({
            username,
            password,
            purchaseHistory: [],
            Cart: [],
        });
        await newUser.save();
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );
        return res.status(201).json({ user: { username: newUser.username, role: newUser.role }, token });
    } catch (error) {
        console.error('SignUp Error:', error); 
        res.status(500).json({ success: false, message: "Server Error "});
    }
};


export const Login = async (req, res) => {
    const {username, password} = req.body;
    console.log(`request login ${username}`);
    try {
        const user = await User.findOne({ username });
        if(!user){
            return res.status(401).json({success: false , message: 'wrong username or password'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({success: false , message: 'wrong username or password'});
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );
        return res.status(200).json({ user: { username: user.username, role: user.role }, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({success: false , message: "Internal Server Error"});
    }
}

export const Request2be = async (req, res) => {
    try{
        const user = await User.findById(req.user.userId);
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
        const user = await User.findById(req.user.userId).populate('purchaseHistory');
        if(!user) return res.status(404).json({suceess: false, message: 'usernot found'});
        res.json({success: true , user});
    }catch (error){
        res.status(500).json({success: false , message: 'Server Error'});
    }
}

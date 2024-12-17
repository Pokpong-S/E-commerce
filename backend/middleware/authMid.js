import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(403).json({success: false,message: 'No token provided'});

    try{
        const decodeed = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodeed;
        next();
    }catch{
        res.status(403).json({message: 'Invalid token'});
    }
};
export const authorize = (roles) => (req,res,next) =>{
    if(!roles.includes(req.user.role)){
        return res.status(403).json({success: false,message: 'Access denied'});
    }
    next();
};

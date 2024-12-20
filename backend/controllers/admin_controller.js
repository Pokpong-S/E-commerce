import User from '../model/user_model.js';

export const getUsers = async (req, res) => {
    const {page = 1 , limit = 10 } = req.query;
    try {
        const users = await User.find().limit(limit*1).skip((page-1)*limit).exec();

        const count = await User.countDocuments();
        res.json({success: true, data: users, totalPages: Math.ceil(count/limit),currentPage: page});
    }catch (error){
        res.status(500).json({success: false , message: 'Server Error'});
    }
}
export const ApproveMerchant = async (req, res) => {
    console.log(`approve request : ${req.params.id}`);
    try {
        const user = await User.findById(req.params.id);

        if(!user) return res.status(404).json({sucess: false , message: 'User not found'});
       
        user.role = 'Merchant';
        user.roleRequest = null;
        await user.save();
        res.status(200).json({sucess: true, message: `${user.username} is now a Merchant` });
    }catch (error){
        res.status(500).json({success: false , message: 'Server error'});
    }
}
export const RejectMerchant = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) return res.status(404).json({sucess: false , message: 'User not found'});
        
        user.roleRequest = null;
        await user.save();
        res.status(200).json({message:`${user.username}'s request to become a Merchant has been rejected`});
    }catch (error){
        res.status(500).json({success: false , message: 'server error'});
    }
}
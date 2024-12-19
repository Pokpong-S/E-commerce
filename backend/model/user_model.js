import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user','Merchant','admin'],
        default: 'user'
    },
    roleRequest: {
        type: String ,
        enum: ['Merchant',null], default: null
    },
    purchaseHistory: [
        {
            product: {
                type: String,
                ref: 'Product',
                required: true
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            purchasedAt: {
              type: Date,
              default: Date.now,
            },
            
        }
    ],
    Cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId ,
            ref: "Product" ,
            required: true
        } ,
        quantity: {
            type: Number ,
            required: true
        }
    }]

});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); 
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}
const User = mongoose.model('User', userSchema);
export default User

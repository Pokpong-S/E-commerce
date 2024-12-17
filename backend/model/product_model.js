import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
        name:{
            type: String ,
            require: true
        },
        price:{
            type: Number ,
            require: true
        },
        image:{
            type: String ,
            require: true
        },
        stock:{
            type: Number ,
            require: true
        },
        description:{
            type: String ,
            require: true
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    }, { timestamps: true ,}
);

const Product = mongoose.model('Product', productSchema);

export default Product ;
import express from "express";
import dotenv from "dotenv";
import path from 'path';
import userRoutes from "./routes/user_route.js"
import adminRoutes from "./routes/admin_route.js"
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product_route.js";
import cartRoutes from "./routes/cart_route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5173 ;
app.use(express.json());
app.use("/api/products", productRoutes);
app.use('/auth',userRoutes);
app.use('/cart',cartRoutes);
app.use('/admin',adminRoutes);
app.use('/uploads', express.static(path.join(path.resolve(), '.../uploads')));
app.get('/test',(req, res) => {
    res.send("hello");
})

// const __dirname = path.resolve();
// if(process.env.NODE_ENV == "productioin"){
//     app.use(express.static(path.join(__dirname,"/frontend/dist")));
//     app.get("*", (req,res) =>{
//         res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
//     })
// }

app.listen(PORT , () => {
    connectDB();
    console.log(`Sever started at http://localhost:${PORT}`)
});

// mlzbsM9lmmJF2hEu

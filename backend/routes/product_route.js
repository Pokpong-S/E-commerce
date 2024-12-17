import express from "express";
import {create_product,upload, delete_product, getProducts, update_product} from '../controllers/product_controller.js';
import { authenticate, authorize } from "../middleware/authMid.js";
const router = express.Router();


router.get("/", getProducts);

router.post("/",authenticate,authorize(['Merchant','admin']),upload.single('image'), create_product);

router.put("/:id" , update_product);

router.delete("/:id" ,authenticate,authorize(['Merchant','admin']), delete_product);


export default router;
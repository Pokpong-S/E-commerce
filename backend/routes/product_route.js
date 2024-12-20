import express from "express";
import {create_product, delete_product, getProducts, update_product} from '../controllers/product_controller.js';
import { authenticate, authorize } from "../middleware/authMid.js";
import upload from "../middleware/upload.js";
const router = express.Router();


router.get("/", getProducts);

router.post("/",authenticate,authorize(['Merchant','admin']),upload.single('image'), create_product);

router.put("/:id" ,authenticate,authorize(['Merchant','admin']), update_product);

router.delete("/:id" ,authenticate,authorize(['Merchant','admin']), delete_product);


export default router;
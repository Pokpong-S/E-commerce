import express from 'express';
import { addToCart, buyCartItems, deleteCartItem, getCart, updateCartQuantity } from '../controllers/cart_controller.js';
import { authenticate } from '../middleware/authMid.js';
const router = express.Router();

router.get("/", authenticate,getCart);
router.post("/", authenticate,addToCart);
router.delete("/:productId", authenticate,deleteCartItem);
router.post("/buy", authenticate,buyCartItems);
router.post("/:productId", authenticate,updateCartQuantity);
export default router;
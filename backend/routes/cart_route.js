import express from 'express';
import { addToCart, buyCartItems, deleteCartItem, getCart } from '../controllers/cart_controller';

const router = express.Router();

router.get("/",getCart);
router.post("/",addToCart);
router.delete("/:productId",deleteCartItem);
router.post("/buy",buyCartItems);

export default router;
import Cart from "../model/cart_model.js";
import Product from "../model/product_model.js";
import Purchase from "../model/purchase_model.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.log("Error in fetching cart:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, products: [] });
    }

    const existingItem = cart.products.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.log("Error in adding to cart:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.products = cart.products.filter((item) => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.log("Error in deleting cart item:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const buyCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const purchase = new Purchase({ user: req.user.id, purchases: [] });

    for (let item of cart.products) {
      const product = await Product.findById(item.product._id);
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();

      purchase.purchases.push({ product: product._id, quantity: item.quantity });
    }

    await purchase.save();
    cart.products = [];
    await cart.save();

    res.status(200).json({ success: true, message: "Purchase completed" });
  } catch (error) {
    console.log("Error in buying cart items:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

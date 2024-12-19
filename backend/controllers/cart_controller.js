import User from "../model/user_model.js";
import Product from "../model/product_model.js";
import mongoose from 'mongoose';

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("Cart.product");
    if (!user || !user.Cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    res.status(200).json({ success: true, cart: user.Cart });
  } catch (error) {
    console.log("Error in fetching cart:", error);
    res.status(500).json({ success: false, message: `getcart server: ${error}` });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  console.log("Request add2c:", req.user);
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock available" });
    }

    // console.log("Request user ID:", req.user);
    const user = await User.findById(req.user.userId);
    // console.log("Fetched user:", user);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.Cart) {
      // console.log("Cart undefined");
      user.Cart = [];
    }
    const cartItemIndex = user.Cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      user.Cart[cartItemIndex].quantity += quantity;
    } else {
      user.Cart.push({ product: productId, quantity });
    }

    await user.save();
    res.status(200).json({ success: true, cart: user.Cart });
  } catch (error) {
    console.log("Error in adding to cart:", error);
    res.status(500).json({ success: false, message: `Server problem : ${error}` });
  }
};

export const deleteCartItem = async (req, res) => {
  const { productId } = req.params;
  console.log(`got request : ${productId}`)
  try {
      const user = await User.findById(req.user.userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      const cartItemIndex = user.Cart.findIndex(item => item.product.toString() === productId);

      if (cartItemIndex === -1) {
          return res.status(404).json({ success: false, message: "Product not found in cart" });
      }
      user.Cart.splice(cartItemIndex, 1);

      await user.save();

      res.status(200).json({ success: true, Cart: user.Cart, message: "Product removed from cart" });
  } catch (error) {
      console.error("Error in deleting cart item:", error);
      res.status(500).json({ success: false, message: `server error deletecart : ${error}` });
  }
};

export const buyCartItems = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("Cart.product");
    if (!user || user.Cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const insufficientStockItems = [];

    for (const item of user.Cart) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product.name} not found` });
      }

      if (product.stock < item.quantity) {
        insufficientStockItems.push(item.product.name);
      }
    }
    if (insufficientStockItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for the following products: ${insufficientStockItems.join(", ")}`,
      });
    }

    for (const item of user.Cart) {
      const product = await Product.findById(item.product._id);

      product.stock -= item.quantity;
      await product.save();

      user.purchaseHistory.push({
        product: product.name,
        quantity: item.quantity,
        price: product.price,
        purchasedAt: new Date(),
      });
    }

    user.Cart = [];
    await user.save();

    res.status(200).json({ success: true, message: "Purchase completed successfully" });
  } catch (error) {
    console.log("Error in buying cart items:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const updateCartQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body; 

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartItem = user.Cart.find(item => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    if (quantity <= 0) {
      user.Cart = user.Cart.filter(item => item.product.toString() !== productId);
    } else {
      cartItem.quantity = quantity;
    }

    await user.save();
    await user.populate('Cart.product');

    res.json({ success: true, cart: user.Cart });
  } catch (error) {
    console.error('UpdateCartQuantity Error:', error);
    res.status(500).json({ success: false, message: `server error updatecart : ${error}`});
  }
};

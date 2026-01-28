import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId).select("price");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();

    const safeCart = cart.toObject(cart);
    delete safeCart.__v;
    delete safeCart.createdAt;
    delete safeCart.updatedAt;

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: safeCart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding to cart",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price unit category",
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const safeCart = cart.toObject();
    delete safeCart.createdAt;
    delete safeCart.updatedAt;
    delete safeCart.__v;

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: safeCart,
    });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving cart",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price unit category",
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Locate the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Update or remove item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    // Sanitize response
    const safeCart = cart.toObject();
    delete safeCart.createdAt;
    delete safeCart.updatedAt;
    delete safeCart.__v;

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: safeCart,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating cart item",
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    console.log(productId);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const safeCart = cart.toObject();
    delete safeCart.createdAt;
    delete safeCart.updatedAt;
    delete safeCart.__v;

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: safeCart,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while removing cart item",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = []; // empty the cart
    await cart.save();

    const safeCart = cart.toObject();
    delete safeCart.createdAt;
    delete safeCart.updatedAt;
    delete safeCart.__v;

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: safeCart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while clearing cart",
    });
  }
};

export const checkoutCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's cart and populate product details
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price unit category",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty or not found",
      });
    }

    // Calculate total price dynamically
    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Create a new order from the cart
    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice,
      status: "pending", // can later be updated to 'paid', 'shipped', etc.
    });

    await order.save();

    // Clear the cart after checkout
    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Checkout successful, order created",
      data: {
        orderId: order._id,
        totalPrice,
        items: order.items,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during checkout",
    });
  }
};

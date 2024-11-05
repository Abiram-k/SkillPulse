const { default: mongoose } = require("mongoose");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

exports.getCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItems = await Cart.find({ user: id })
        .populate("products.product");
        // console.log(cartItems)
        return res.status(200).json({ message: "Successfully fetched all cart items", cartItems });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "failed to fetch cart items" })
    }
}

exports.updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { userId, value } = req.query;
        // console.log("User id : ", userId);
        // console.log("Product Id : ", productId)
        // console.log(value);

        const cart = await Cart.findOne({ user: userId, products: { $elemMatch: { "product": productId } } })
        if (cart) {
            // console.log("CART : ", cart)
            const productIndex = cart.products.findIndex((item) => item.product.toString() == productId);

            if (productIndex === -1) {
                return res.status(404).json({ success: false, message: "Product not found in cart." });
            }

            const currentQuantity = cart.products[productIndex].quantity;
            const newQuantity = currentQuantity + parseInt(value);

            if (newQuantity < 0) {
                return res.status(400).json({ success: false, message: "Quantity cannot be negative." });
            }

            cart.products[productIndex].quantity = newQuantity;

            await cart.save();

            res.status(200).json({ message: "updated" });

        } else {
            console.log("No Cart were founded");
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while updating" })
    }
}

exports.removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { userId } = req.query;
        console.log(userId, productId)
        const cart = await Cart.findOne({ user: userId });
        console.log(cart)
        if (cart) {
            const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);
            if (productIndex === -1)
                console.log("Product not found");

            const deletedItem = cart.products.splice(productIndex, 1);
            await cart.save();
            return res.status(200).json({ message: "Item were deleted" })
        } else {
            console.log("Cart not founded");
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server failed to delete this item" })
    }
}
const { model } = require('mongoose');
const Cart = require('../models/cartModel');
const Orders = require('../models/orderModel');
const User = require("../models/userModel");
const Product = require('../models/productModel');

let orderCounter = 0;

const generateOrderId = () => {
    orderCounter += 1;
    const timestamp = Date.now();
    return `SKPUL-FT-${timestamp}-${orderCounter}`;
};

const generateOrderDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, 0)
    const month = String(date.getMonth() + 1).padStart(2, 0)
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

exports.addOrder = async (req, res) => {
    try {
        const checkoutItems = req.body.map(item => {
            const { authUser, ...rest } = item;
            return rest;
        });
        console.log(checkoutItems);
        const { id } = req.params;
        const order = await Orders.findOne({ user: id });
        console.log(order);
        const user = await User.findById(id);
        const deliveryAddressId = user.deliveryAddress;
        if (!deliveryAddressId)
            return res.status(400).json({ message: "Add a delivery Address" })
        const [address] = user.address.filter((addr) => addr._id.toString() == deliveryAddressId);

        console.log(address);

        let orderItems = [];
        let totalAmount = 0;
        let totalQuantity = 0;
        checkoutItems.forEach(async item => {
            try {

                const orderItem = {
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.salesPrice * item.quantity
                };
                orderItems.push(orderItem);

                totalAmount += orderItem.price;
                totalQuantity += item.quantity;
                await Product.findByIdAndUpdate(item.product._id, { $inc: { units: -item.quantity } })
            } catch (error) {
                console.error(error);
            }
        });

        const currentOrderData = {
            user: id,
            orderId: generateOrderId(),
            orderDate: generateOrderDate(),
            orderItems,
            totalAmount,
            totalQuantity,
            address
        };

        const newOrder = new Orders(currentOrderData);
        newOrder.save()
            .then(async order => {
                const cart = await Cart.findOne({ user: id });
                if (cart)
                    cart.products = [];
                await cart.save();
                console.log("order placed", order);
            })
            .catch(error => console.error("Error saving order:", error));

        return res.status(200).json({ message: "Order places Successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while ordering" })
    }
}

exports.getOrder = async (req, res) => {
    try {
        const { id } = req.query;
        const orderData = await Orders.find({ user: id }).populate({
            path:
                "orderItems.product",
            populate: {
                path: 'category',
                model: "category"
            }
        });
        if (!orderData)
            console.log("No order were founded in this user id");
        return res.status(200).json({ message: "Orders fetched successfully", orderData });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
}

exports.cancelOrder = async (req, res) => {
    try {
        const { id, itemId } = req.query;
        const order = await Orders.findOne({ user: id, orderItems: { $elemMatch: { _id: itemId } } })

        const orderIndex = order.orderItems.findIndex(item => item._id.toString() == itemId);
        order.orderItems[orderIndex].productStatus = "cancelled";
        await order.save();

        return res.status(200).json({ message: "Order Cancelled successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while cancelling the order" })
    }
}
exports.returnOrder = async (req, res) => {
    try {
        const { id, itemId } = req.query;
        const order = await Orders.findOne({ user: id, orderItems: { $elemMatch: { _id: itemId } } })

        const orderIndex = order.orderItems.findIndex(item => item._id.toString() == itemId);
        order.orderItems[orderIndex].productStatus = "returned";
        await order.save();

        return res.status(200).json({ message: "Order Returned successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while returning the order" })
    }
}
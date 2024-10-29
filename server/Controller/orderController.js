const { model } = require('mongoose');
const Cart = require('../models/cartModel');
const Orders = require('../models/orderModel');
const User = require("../models/userModel");

let orderCounter = 1300;
const generateOrderId = () => {
    orderCounter += 1;
    return `SKPUL-FT-${orderCounter}`;
}

const generateOrderDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, 0)
    const month = String(date.getMonth() + 1).padStart(2, 0)
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

exports.addOrder = async (req, res) => {

    try {
        const checkoutItems = req.body;
        console.log(checkoutItems);
        const { id } = req.params;
        const order = await Orders.findOne({ user: id });
        console.log(order);
        const user = await User.findById(id);
        const deliveryAddressId = user.deliveryAddress;
        const [address] = user.address.filter((addr) => addr._id.toString() == deliveryAddressId);

        console.log(address);

        let orderItems = [];
        let totalAmount = 0;
        let totalQuantity = 0;

        checkoutItems.forEach(item => {
            const orderItem = {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.salesPrice * item.quantity
            };
            orderItems.push(orderItem);

            totalAmount += orderItem.price;
            totalQuantity += item.quantity;
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
        const orderData = await Orders.findOne({ user: id }).populate({
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
        const {id} = req.query ;

    } catch (error) {

    }
}
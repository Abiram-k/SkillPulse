const { model } = require('mongoose');
const Cart = require('../models/cartModel');
const Orders = require('../models/orderModel');
const User = require("../models/userModel");
const Product = require('../models/productModel');
const Wallet = require('../models/walletModel');

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
        const { paymentMethod, totalAmount } = req.query;
        console.log(paymentMethod, totalAmount)
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
        // let totalAmount = 0;
        let totalQuantity = 0;

        // this is for to get check out totalAmount
        // const cart = Cart.findOne({ user: id });
        for (const item of checkoutItems) {
            try {
                const orderItem = {
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.salesPrice * item.quantity,
                    paymentMethod
                };
                if (paymentMethod === "wallet") {
                    const wallet = await Wallet.findOne({ user: id });
                    if (!wallet) {
                        return res.status(404).json({ message: "Wallet not found" });
                    }
                    if (wallet.totalAmount < totalAmount) {
                        return res.status(402).json({ message: `Wallet balance is insufficient: ${wallet.totalAmount}` });
                    } else {
                        const walletData = {
                            amount: -totalAmount,
                            description: "purchased product",
                            transactionId: `REF-${item.product._id
                                // .toString().slice(0, 5)
                                }-${Date.now()}`
                        }
                        wallet.transaction.push(walletData);
                        wallet.totalAmount -= totalAmount;
                        await wallet.save();
                        orderItems.push(orderItem);
                    }
                } else {
                    orderItems.push(orderItem);
                }

                // totalAmount += orderItem.price;
                totalQuantity += item.quantity;
                await Product.findByIdAndUpdate(item.product._id, { $inc: { units: -item.quantity } });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Error processing item" });
            }
        }

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
                const result = await Cart.deleteOne({ user: id });

                if (result.deletedCount == 1)
                    console.log("order placed", order);
                else
                    console.log("Cart not found while droping")
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
        const order = await Orders.findOne({ user: id, orderItems: { $elemMatch: { _id: itemId } } }).populate("orderItems.product")
        if (!order) {
            console.error("Order not found")
            return res.status(400).json({ message: "Order not found" })
        }
        const orderIndex = order.orderItems.findIndex(item => item._id.toString() == itemId);
        order.orderItems[orderIndex].productStatus = "cancelled";
        const refundPrice = order.orderItems[orderIndex]?.product?.salesPrice * order.orderItems[orderIndex]?.quantity;
        await order.save();
        const walletData = {
            amount: refundPrice,
            description: "Cancellation Refund",
            transactionId: `REF-${itemId}-${Date.now()}`
        }
        const wallet = await Wallet.findOneAndUpdate({ user: id }, { $push: { transaction: walletData }, $inc: { totalAmount: parseFloat(refundPrice) } }, { upsert: true, new: true });

        if (!wallet)
            return res.status(400).json({ message: "Wallet not found to refund money " });
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
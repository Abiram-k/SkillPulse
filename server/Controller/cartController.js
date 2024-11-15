const { default: mongoose } = require("mongoose");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel.");

exports.getCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItems = await Cart.find({ user: id })
            .populate([{ path: "products.product" },
            { path: "appliedCoupon" }
            ]);

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

        const cart = await Cart.findOne({
            user: userId,
            products: { $elemMatch: { "product": productId } }
        }).populate([{ path: "products.product" }, { path: "appliedCoupon" }]);

        if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });


        const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

        if (productIndex === -1)
            return res.status(404).json({ success: false, message: "Product not found in cart." });

        const product = cart.products[productIndex];
        const currentQuantity = product.quantity;
        const newQuantity = currentQuantity + parseInt(value);

        if ((cart.grandTotal - cart.totalDiscount) == cart.appliedCoupon?.maxDiscount && value > 0)
            return res.status(401).json({ couponMessage: "Maximum coupon discount applied" });

        if (newQuantity < 0)
            return res.status(400).json({ success: false, message: "Quantity cannot be negative." });

        product.quantity = newQuantity;
        product.totalPrice = product.product.salesPrice * newQuantity;
        const { appliedCoupon } = cart;

        // if (appliedCoupon) {
        //     if (appliedCoupon.couponType === "Percentage") {
        //         const discountAmount = Math.round(product.totalPrice * (appliedCoupon.couponAmount / 100));
        //         product.offeredPrice = (cart.totalDiscount - cart.grandTotal) <= appliedCoupon.maxDiscount
        //             ? product.totalPrice - discountAmount
        //             : product.totalPrice - appliedCoupon.maxDiscount;//if offer price exceed maxDiscount the offered price should be like total - maxdiscout
        //     } else {
        //         const discountAmount = appliedCoupon.couponAmount;
        //         product.offeredPrice = product.totalPrice - discountAmount < appliedCoupon.maxDiscount
        //             ? Math.max(0, product.totalPrice - discountAmount)
        //             : product.totalPrice - appliedCoupon.maxDiscount;
        //     }
        // } else {
        product.offeredPrice = product.totalPrice;
        // }

        cart.appliedCoupon = null;
        totalDiscoutApplied = cart.grandTotal - cart.totalDiscount


        cart.grandTotal = cart.products.reduce((acc, p) => p.totalPrice + acc, 0);

        if (appliedCoupon) {
            let totalDiscount = cart.products.reduce((acc, p) => acc + (p.offeredPrice), 0);

            if (cart.grandTotal - totalDiscount < appliedCoupon?.maxDiscount) {
                cart.totalDiscount = totalDiscount;
            } else {
                cart.totalDiscount = cart.grandTotal - appliedCoupon.maxDiscount;
                console.log(cart.grandTotal, cart.totalDiscount)
                console.log(cart.grandTotal - appliedCoupon.maxDiscount);
            }
        } else {
            cart.totalDiscount = cart.products.reduce((acc, p) => acc + (p.offeredPrice), 0);
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error occurred while updating" });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { userId } = req.query;
        console.log(userId, productId)
        const cart = await Cart.findOne({ user: userId }).populate("appliedCoupon")
        console.log(cart)
        if (cart) {
            const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);
            if (productIndex === -1)
                console.log("Product not found");

            const deletedItem = cart.products.splice(productIndex, 1);

            cart.grandTotal -= deletedItem[0]?.totalPrice;
            // cart.totalDiscount -= deletedItem[0].offeredPrice;
            if (deletedItem[0].offeredPrice <= cart.totalDiscount) {
                cart.totalDiscount -= deletedItem[0].offeredPrice;
            }

            if (cart.grandTotal < cart.appliedCoupon?.purchaseAmount) {
                cart.appliedCoupon = null
            }
            if (cart.products.length == 0) {
                cart.appliedCoupon = null
                cart.grandTotal = 0
                cart.totalDiscount = 0
            }
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

// exports.applyCoupon = async (req, res) => {
//     try {
//         const { id, couponId } = req.query;
//         // const cart = await Cart.findOneAndUpdate({ user: id },
//         //     { appliedCoupon: couponId },
//         //     { new: true });
//         const coupon = await Coupon.findOne({ _id: couponId });
//         const cart = await Coupon.findOne({ user: id });
//         if (coupon && cart) {
//             const cart = await Cart.findOne({ user: id }).populate("appliedCoupon");
//             const coupon = await Coupon.findOne({ _id: couponId });
//             if (cart.appliedCoupon) {
//                 if (cart.appliedCoupon.couponType === "Percentage") {
//                     cart.products.forEach((product) => {
//                         if (coupon.purchaseAmount <= cart.grandTotal) {
//                             const discountAmount =
//                                 product.totalPrice * (coupon.couponAmount / 100)
//                             const maxDiscountExceedPercentage = (cart.appliedCoupon.maxDiscount / cart.grandTotal) * 100;
//                             const maxDiscountExceedAmount =
//                                 product.totalPrice * (maxDiscountExceedPercentage / 100)
//                             let appliedDiscount = cart.grandTotal * (coupon.couponAmount / 100)
//                             console.log(appliedDiscount, coupon.maxDiscount)
//                             if (appliedDiscount > coupon.maxDiscount) {
//                                 console.log("working this...")
//                                 product.offeredPrice = product.totalPrice - maxDiscountExceedAmount
//                             } else {
//                                 console.log("No working this")
//                                 product.offeredPrice = product.totalPrice - discountAmount;
//                             }
//                         } else {
//                             product.offeredPrice = product.totalPrice;
//                         }
//                     });
//                 } else {
//                     cart.products.forEach((product) => {
//                         if (coupon.purchaseAmount <= product.totalPrice) {
//                             const proportionalDiscount =
//                                 (product.totalPrice / cart.grandTotal) * coupon.couponAmount
//                             product.offeredPrice = Math.max(0, product.totalPrice - proportionalDiscount);
//                         } else {
//                             product.offeredPrice = product.totalPrice;
//                         }
//                     });
//                 }
//                 cart.totalDiscount = cart.products.reduce((acc, product) => acc + (product.offeredPrice), 0);
//                 cart.grandTotal = cart.products.reduce((acc, product) => acc + product.totalPrice, 0)
//                 await cart.save();
//                 return res.status(200).json({ message: "Coupon applied successfully" });
//             }
//         }
//         return res.status(400).json({ message: "Coupon failed to apply" });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Error occured while applying coupon" })
//     }
// }
exports.applyCoupon = async (req, res) => {
    try {
        const { id, couponId } = req.query;
        const cart = await Cart.findOneAndUpdate({ user: id },
            { appliedCoupon: couponId },
            { new: true })
        if (cart) {
            const cart = await Cart.findOne({ user: id }).populate("appliedCoupon");
            const coupon = await Coupon.findOne({ _id: couponId });
            if (cart.appliedCoupon) {
                if (cart.appliedCoupon.couponType === "Percentage") {
                    cart.products.forEach((product) => {
                        if (coupon.purchaseAmount <= cart.grandTotal) {
                            const discountAmount =
                                product.totalPrice * (coupon.couponAmount / 100)
                            const maxDiscountExceedPercentage = (cart.appliedCoupon.maxDiscount / cart.grandTotal) * 100;
                            const maxDiscountExceedAmount =
                                product.totalPrice * (maxDiscountExceedPercentage / 100)
                            let appliedDiscount = cart.grandTotal * (coupon.couponAmount / 100)
                            console.log(appliedDiscount, coupon.maxDiscount)
                            if (appliedDiscount > coupon.maxDiscount) {
                                console.log("working this...")
                                product.offeredPrice = product.totalPrice - maxDiscountExceedAmount
                            } else {
                                console.log("No working this")
                                product.offeredPrice = product.totalPrice - discountAmount;
                            }
                        } else {
                            product.offeredPrice = product.totalPrice;
                        }
                    });
                } else {
                    cart.products.forEach((product) => {
                        if (coupon.purchaseAmount <= product.totalPrice) {
                            const proportionalDiscount =
                                (product.totalPrice / cart.grandTotal) * coupon.couponAmount
                            product.offeredPrice = Math.max(0, product.totalPrice - proportionalDiscount);
                        } else {
                            product.offeredPrice = product.totalPrice;
                        }
                    });
                }
                cart.totalDiscount = cart.products.reduce((acc, product) => acc + (product.offeredPrice), 0);
                cart.grandTotal = cart.products.reduce((acc, product) => acc + product.totalPrice, 0)
                await cart.save();
                return res.status(200).json({ message: "Coupon applied successfully" });
            }
        }
        return res.status(400).json({ message: "Coupon failed to apply" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while applying coupon" })
    }
}

exports.removeCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findOne({ user: id }).populate("products.product")
        if (!cart) {
            return res.status(400).json({ message: "Cart not founded while removing coupon" });
        }
        cart.products.forEach((product => product.offeredPrice = product.totalPrice))
        cart.appliedCoupon = null
        cart.totalDiscount = cart.products.reduce((acc, product) => product.offeredPrice + acc, 0)
        cart.save();
        return res.status(200).json({ message: "Coupon removed successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while removing coupon" })
    }
} 
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        required: true,
        // unique: true
    },
    orderDate: {
        type: String,
        required: true,
        default: Date.now
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: false,
            },
            productStatus: {
                type: String,
                required: false,
                enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'],
                default: 'processing'
            },
           
            totalPrice: {
                type: Number,
                required: true,
            }
        }
    ],
    appliedCoupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
        default: null
    },
    totalAmount: {
        type: Number,
        required: true
    },
    totalDiscount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    totalQuantity: {
        type: Number,
        required: false
    },
    address: {
        firstName: {
            type: String,
            required: true
        },
        secondName: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        },
        alternativeMobile: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },


    },
    status: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: "processing"
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Failed', 'Success'],
        required: true
    }

})

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order
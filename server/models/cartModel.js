const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            }
        }
    ],
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart
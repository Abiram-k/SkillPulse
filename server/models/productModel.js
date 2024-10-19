const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productImage: {
    type: [String], 
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productDescription: {
    type: String,
    required: true
  },
  salesPrice: {
    type: Number,
    required: true
  },
  regularPrice: {
    type: Number,
    required: true
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: false 
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5 
  },
  isListed: {
    type: Boolean,
    default: true
  },
  units: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    type:String,
    ref: 'category', 
    required: true
  },
  brand: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Brand',
    // required: true
    type:String
  }
}, {
  timestamps: true 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

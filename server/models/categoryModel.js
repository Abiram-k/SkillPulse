const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        default: "Not Added",
        required: false
    },
    isListed: {
        type: Boolean,
        require: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
})
const Category = mongoose.model("category", categorySchema);
module.exports = Category;
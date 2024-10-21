const path = require("path");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const { listenerCount } = require("process");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // const hashed =await bcrypt.hash(password, 10);
        // await Admin.create({ email, password: hashed });
        const admin = await Admin.findOne({ email });
        if (!admin)
            return res.status(400).json({ message: "Check the email id" })
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch)
            return res.status(400).json({ message: "Check the password" })

        return res.status(200).json({ message: "Login Successfull" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

exports.customers = async (req, res) => {
    try {
        const users = await User.find();
        console.log(users);

        return res.status(200).json({ message: "success", users });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const user = await User.findById({ _id: id });
        user.isBlocked = !user.isBlocked
        await user.save();
        return res.status(200).json({ message: "User bloked successfully", name: user.firstName, user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Failed to block user" })
    }
}

exports.addCategory = async (req, res) => {
    console.log("hai");
    try {
        let { name, description } = req.body;
        console.log(name, description);
        if (!description) {
            description = undefined;
        }
        const existCategory = await Category.findOne({
            name: {
                $regex: `^${name}$`,
                $options: ""
            }
        })
        if (existCategory)
            return res.status(400).json({ message: "Category already exists" });
        else {
            const category = await Category.create({
                name, description
            })
            return res.status(200).json({ message: "Category added succesfully", category })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find({});
        if (categories) {
            return res.json({ message: "succesully fetched all category", categories });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Failed to fetch categories" });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log("category id is:", id);

        const deletedCategory = await Category.
            findByIdAndUpdate({ _id: id }, { isDeleted: true, deletedAt: Date.now() });

        if (deletedCategory)
            return res.status(200).json({ message: "Category successfully deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "failed to delete category" });
    }
}
exports.categoryRestore = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("category id is:", id);
        const RestoredCategory = await Category.
            findByIdAndUpdate({ _id: id }, { isDeleted: false, deletedAt: null });

        if (RestoredCategory)
            return res.status(200).json({ message: "Category successfully Restore" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "failed to Restore category" });
    }
}

exports.editCategory = async (req, res) => {
    try {
        let { id, name, description } = req.body;
        // console.group(id, name, description);
        if (!description) {
            description = undefined;
        }
        const isExistcategory = await Category.findOne({ name, _id: { $ne: id } });
        if (isExistcategory)
            return res.status(400).json({ message: "Category already exists" });

        await Category.findByIdAndUpdate(id, { name, description });
        return res.status(200).json({ message: "Successfully edited the category" })
    } catch (error) {
        return res.status(500).json({ message: error.message || "category not edited" })
    }
}

exports.listCategory = async (req, res) => {
    try {

        const { id } = req.params;
        const category = await Category.findById(id);
        console.log(category);
        category.isListed = !category.isListed
        category.save();
        return res.status(200).json({ message: "success", category })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message || "Failed to list/unlist Category" })
    }
}

exports.getProduct = async (req, res) => {
    try {
        const products = await Product.find().populate("category")
        // const categories = await Category.findById(products.category)
        return res.status(200).json({ message: "successfully fetched all products", products });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message || "Failed to fetch data" })
    }
}

exports.addProduct = async (req, res) => {
    try {
        const {
            productName,
            productDescription,
            salesPrice,
            regularPrice,
            units,
            category,
            brand
        } = req.body;
        console.log(
            productName,
            productDescription,
            salesPrice,
            regularPrice,
            units,
            category,
            brand
        )
        const productImage = req.files.map((file) => file.path)
        const existProduct = await Product.findOne({ productName });

        const categoryDoc = await Category.findOne({ name: category })
        if (!categoryDoc)
            return res.status(400).json({ message: "Category not existing" });
        if (existProduct) {
            console.log("product exists");
            return res.status(400).json({ message: "product already exists" });
        }
        else {
            const product = await Product.create({
                productName,
                productDescription,
                salesPrice,
                regularPrice,
                units,
                category: categoryDoc._id,
                brand,
                productImage
            });
            console.log("req got !!!!!!!!!!!!!!!!!!!!!!!!!")
            return res.status(200).json({ message: "product added successully" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message || "Error occurred while adding product" })
    }
}

exports.editProduct = async (req, res) => {
    try {
        const {
            productName,
            productDescription,
            salesPrice,
            regularPrice,
            units,
            category,
            brand
        } = req.body;
        console.log(
            productName,
            productDescription,
            salesPrice,
            regularPrice,
            units,
            category,
            brand, "hello"
        )

        const { id } = req.params;
        console.log(req.files);
        const productImage = req.files.map((file) => file.path)
        const existProduct = await Product.findOne({ productName, _id: { $ne: id } });

        const categoryDoc = await Category.findOne({ name: category })
        if (!categoryDoc)
            return res.status(400).json({ message: "Category not existing" });
        if (existProduct) {
            console.log("product exists");
            return res.status(400).json({ message: "product already exists" });
        }
        else {
            await Product.findByIdAndUpdate(id, {
                productName,
                productDescription,
                salesPrice,
                regularPrice,
                units,
                category: categoryDoc._id,
                brand,
                productImage
            });
            console.log("req got !!!!!!!!!!!!!!!!!!!!!!!!!")
            return res.status(200).json({ message: "product edited successully" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message || "Error occurred while adding product" })
    }
}

exports.handleProductListing = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        product.isListed = !product.isListed;
        product.save();
        if (!product)
            return res.status(400).json({ message: "No products were founded !" });
        else
            return res.status(200).json({ message: `product sucessfully ${product.isListed ? "Listed" : "Unlisted"}`, product })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Failed to list/unilist product" })
    }
}
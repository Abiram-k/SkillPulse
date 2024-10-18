const path = require("path");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Category = require("../models/categoryModel");

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
        const { name, description } = req.body;
        console.log(name, description);
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
        console.log("category id is:", id);
        const deletedCategory = await Category.findByIdAndDelete({ _id: id })
        if (deletedCategory)
            return res.status(200).json({ message: "Category successfully deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "failed to delete category" });
    }
}
exports.editCategory = async (req, res) => {
    try {

        const { id, name, description } = req.body;
        console.group(id, name, description);
        const isExistcategory = await Category.findOne({ name });
        const category = await Category.findById(id);
        if (isExistcategory && category.name !== name)
            return res.status(400).json({ message: "Category already exists" });

        await Category.findByIdAndUpdate(id, { name, description });
        return res.status(200).json({ message: "Successfully edited the category" })
    } catch (error) {
        return res.status(500).json({ message: error.message || "category not edited" })
    }
} 
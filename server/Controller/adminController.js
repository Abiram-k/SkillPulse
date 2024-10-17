const path = require("path");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const Admin = require("../models/adminModel");



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
    console.log("hello");
    try {
        const user = await User.find();
        return res.status(200).json({ message: "success", user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

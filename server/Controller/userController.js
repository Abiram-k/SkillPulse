const User = require('../models/userModel');
const nodeMailer = require("nodemailer");
const path = require("path");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error } = require('console');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Brand = require('../models/brandModel');
const { isBlocked } = require('../Middleware/isBlockedUser');
const { listCategory } = require('./adminController');
const Cart = require('../models/cartModel');

dotenv.config({ path: path.resolve(__dirname, "../.env") })


exports.baseRoute = (req, res) => {
    res.status(200).send("SERVER IS RUNNING...");
}

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    }
});

const sendOTPEmail = async (email, otp, name) => {
    console.log("OTP IS:", otp);
    console.log("EMAIL:", email);
    try {
        const mailCredentials = {
            from: "abiramk0107@gmail.com",
            to: email,
            subject: 'SKILL PULSE ,Your OTP for Signup ',
            text: `Dear ${name},

            Thank you for signing up! 

Your One-Time Password (OTP) for completing your signup process is:

One-Time-Password is: ${otp}

Please enter this OTP on the signup page to verify your account. This OTP is valid for a limited time only, so please use it promptly.

If you did not initiate this request, please ignore this email. Your account security is important to us.

Best regards,  
The [SkillPulse] Team`,
        };
        await transporter.sendMail(mailCredentials);
        console.log('OTP sent successfully');
        return true
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
}




exports.signUp = async (req, res) => {
    console.log("hello signup clicked from backend")
    const { firstName, email } = req.body;

    // const existingUser = await User.findOne({ email });
    const existingUser = await User.findOne({
        email:
            { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }
    })

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    } else {
        const otp = generateOTP();
        const otpSent = await sendOTPEmail(email, otp, firstName);
        console.log(email)

        if (!otpSent) {
            return res.status(500).json({ message: "Failed to send OTP" });
        }
        req.session.user = req.body;
        req.session.otp = otp;

        //to delte the otp after 30seconds;
        // setTimeout(() => {
        //     if (req.session && req.session.otp) {
        //         delete req.session.otp;
        //         console.log('OTP expired');
        //     }
        // }, otpExpiry * 1000);

        console.log(req.session.otp);
        console.log(req.session.user);
        return res.status(200).json({ message: "Proceeded to Otp verification" })
    }
}

exports.otp = async (req, res) => {

    const { otp } = req.body;
    console.log(otp, req.session.otp);
    const newUser = req.session.user;
    console.log("new User", newUser);

    try {
        if (!req.session.otp) {
            return res.status(400).json({ message: "Otp expired !" })
        }
        else if (!req.session.user) {
            return res.status(400).json({ message: "User not found" });
        }
        else if (req.session.otp == otp) {
            const user = await User.create(req.session.user)
            res.status(200).json({ message: "User Created Succesfully", user })
            req.session.otp = null;
        } else {
            return res.status(400).json({ message: "Incorrect Otp !" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}


exports.resendOtp = async (req, res) => {
    try {
        const otp = generateOTP();
        req.session.otp = otp;

        //toMake New Otp As Valide
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Failed to store session" });
            }
        });


        if (req.session.user) {
            const email = req.session.user.email
            const otpSent = await sendOTPEmail(email, otp);
            if (!otpSent) {
                return res.status(500).json({ message: "Failed to send OTP" });
            } else {
                return res.status(200).json({ message: "Otp resended !" })
            }
        } else {
            return res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        // const user = await User.findOne({ email });
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }
        });
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: "User not found !" });
        }
        else {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: "Password is incorrect" });
            }
            else if (user.isBlocked) {
                return res.status(400).json({ message: "User were blocked " });
            }
            else {
                // jwt toke sign
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE, process.env.JWT_SECERETE, { expiresIn: '1h' })
                res.cookie('userToken',
                    token,
                    {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'Lax',
                        maxAge: 36000000
                    });
                return res.status(200).json({ message: "Successfully Logged in", user });
            }

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}




//Product Fetching for listing

exports.getProducts = async (req, res) => {
    try {
        let isBlocked = req.body.isBlocked || false;
        const isListedCategory = Category.find({ isListed: true }).select("_id");
        const isListedCategoryIds = (await isListedCategory).map((category) => category._id)

        const isListedBrand = Brand.find({ isListed: true }).select("_id");
        const isListedBrandIds = (await isListedBrand).map((brand) => brand._id);

        const products = await Product.find({ category: { $in: isListedCategoryIds } }, { brand: { $in: isListedBrand } }).populate([{ path: "category" }, { path: "brand" }]);

        console.log(products)
        const category = await Category.find()
        return res.status(200).json({ message: "Sucessfully Fetched All Products", products, category, isBlocked })
    } catch (error) {
        return res.status(500).json({ message: "Failed To Fetch Product Data" })
    }
}

exports.getSimilarProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = await Product.findById(id);
        const similarProducts = await Product.find({ category: productData?.category })
        if (similarProducts.length === 0)
            return res.status(404).json({ message: "No Similar products were founded !" })
        return res.status(200).json({ message: "Product fetched successfully", similarProducts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
}

/////////////////// User Profile ////////////////////////


exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, password, mobileNumber, dateOfBirth } = req.body;
        const { id } = req.query;
        const profileImage = req.file?.path;
        const userData = {
            firstName, lastName, password, mobileNumber, profileImage, dateOfBirth
        }
        console.log("User Data", userData)
        const updatedUser = await User.findByIdAndUpdate(id, { $set: userData }, { new: true, upsert: true });
        if (updatedUser)
            return res.status(200).json({ message: "Profile successfully updated", updatedUser });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Filed to update your profile" })
    }
}

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);
        const userData = await User.findById(id);
        // console.log(userData)
        // if (userData)
        return res.status(200).json({ message: "User successfully fetched", userData });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Failed to fetch user data !" })
    }
}

exports.addAddress = async (req, res) => {
    try {
        console.log("working...");
        const { firstName, secondName, mobileNumber, alternativeMobile, city, state, address, pincode, type } = req.body;
        const { id } = req.query;
        const user = await User.findById(id);
        // console.log(user.address);
        if (!user.address) {
            user.address = [];
        } else {
            if (user.address.some((addr) => addr.address === address)) {
                console.log("User already exists")
                return res.status(400).json({ message: "Address already exists" })
            }
        }
        user.address.push({ firstName, secondName, mobileNumber, alternativeMobile, city, state, address, pincode, type });
        await user.save();
        console.log("Added successfully")
        return res.status(200).json({ message: "Address added successfully" })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message || "Error occured while adding address" })
    }
}

exports.getAddress = async (req, res) => {
    try {
        const { id, addrId } = req.query;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let addresses = user.address || [];
        let selectedAddress;
        if (addrId) {
            selectedAddress = addresses.find((addr) => addr._id.toString() === addrId);
            console.log(selectedAddress)
            if (!selectedAddress) {
                return res.status(404).json({ message: "Address not found" });
            }
            user.deliveryAddress = addrId;
            await user.save();
        } else {
            selectedAddress = addresses.find(
                (addr) => addr._id.toString() === user.deliveryAddress
            ) || addresses[0];
        }
        if (!addresses.length) {
            return res.status(404).json({ message: "You can add address here" });
        }
        return res.status(200).json({
            message: "Address successfully fetched",
            addresses,
            selectedAddress,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message || "Error occurred while fetching address",
        });
    }
};


exports.getEditAddress = async (req, res) => {
    try {
        const { id } = req.query;
        // console.log(id);
        const [addressObj] = await User.find({ "address._id": id }, { "address.$": 1 })
        const [address] = addressObj.address
        // console.log(address);
        return res.status(200).json({ message: "Successfully fetched edit address details", address })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Failed to fetch details,You can enter details" })
    }
}

exports.editAddress = async (req, res) => {
    console.log("working....");
    try {
        const {
            firstName,
            secondName,
            mobileNumber,
            alternativeMobile,
            city,
            state,
            pincode,
            type,
            address
        } = req.body;

        console.log(
            firstName,
            secondName,
            mobileNumber,
            alternativeMobile,
            city,
            state,
            address,
            pincode,
            type)
        const { id } = req.query;

        const user = await User.findOne({ "address._id": id });
        // console.log(user);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const addressIndex = user.address.findIndex(addr => addr._id.toString() === id);
        // console.log(addressIndex);

        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found." });
        }

        user.address[addressIndex] = {
            ...user.address[addressIndex],
            firstName,
            secondName,
            mobileNumber,
            alternativeMobile,
            city,
            state,
            address,
            pincode,
            type
        };
        await user.save();

        return res.status(200).json({ message: "Address updated successfully.", address: user.address[addressIndex] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update address. Please try again later." });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.query;
        console.log(id);

        const user = await User.findOne({ "address._id": id });
        const addressIndex = user.address.findIndex((addr, index) => addr._id.toString() == id);

        if (addressIndex == -1)
            return res.status(404).json({ message: "address not founded" });
        user.address.splice(addressIndex, 1);
        await user.save();
        return res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while deleting address" })
    }
}

exports.addToCart = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("productid :", id)
        const { userId } = req.query;
        console.log("userId :", userId);
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let cart = await Cart.findOne({ user: userId });

        console.log(cart)
        if (cart) {
            const productIndex = cart.products.findIndex((p) => p.product.toString() == id);
            if (productIndex != -1)
                cart.products[productIndex].quantity += 1;
            else
                cart.products.push({ product: id, quantity: 1 });
        } else {
            cart = new Cart({
                products: [{ product: id, quantity: 1 }],
                user: userId
            })
        }
        await cart.save();
        return res.status(200).json({ message: "Product added to cart", cart })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server error' });
    }
}

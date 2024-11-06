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
const { listCategory, blockUser } = require('./adminController');
const Cart = require('../models/cartModel');
const Wallet = require('../models/walletModel');

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

            Thank you for signing up! Your One-Time Password (OTP) for completing your signup process is:One-Time-Password is: ${otp}
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

        // setTimeout(() => {
        //     delete req.session.otp;
        // }, 60000);

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
const passResetEmail = async (email, otp, name) => {
    console.log("OTP IS:", otp);
    console.log("EMAIL:", email);
    try {
        const mailCredentials = {

            from: "abiramk0107@gmail.com",
            to: email,
            subject: 'Skill Pulse - OTP for Password Reset',
            text: `Dear ${name},

             Thank you for reaching out to reset your password. Your One-Time Password (OTP) for completing the password reset process is: ${otp}

             Please enter this OTP on the password reset page to proceed with resetting your account password. Note that this OTP is valid only for a limited time, so please use it as soon as possible.
             If you did not initiate this request, please ignore this email. Your account security is our priority.

             Best regards,  
             The Skill Pulse Team`
        };

        await transporter.sendMail(mailCredentials);
        console.log('OTP sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        // console.log(user)
        if (!user)
            return res.status(401).json({ message: "Email id not found" })
        const otp = generateOTP()
        req.session.resetPassOtp = otp;
        console.log(req.session)

        const otpSuccess = await passResetEmail(email, otp, user.firstName)
        if (!otpSuccess)
            console.log("Otp verification Failed")
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while verifying email" })
    }
}
exports.verifyResetOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log(otp, "from fronted")
        const validOtp = req.session.resetPassOtp;
        console.log(validOtp, "from session fronted");
        if (otp && otp != validOtp)
            return res.status(400).json({ message: "Otp is incorrect" });
        else
            return res.status(200).json({ message: "Verification completed" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while verifying otp" })
    }
}
exports.forgotPassword = async (req, res) => {
    try {
        console.log("hey");
        const { email, newPassword } = req.body;
        console.log(email);
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" })
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: "Password Reseted" })
    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "Error occured while resetting password" })
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

exports.getUserData = async (req, res) => {
    try {
        const token = req.cookies.userToken;
        if (!token) return res.status(401).send("Unauthorized");
        const decoded = jwt.verify(token, process.env.JWT_SECRETE);
        const user = await User.findById(decoded.id).select("-password");
        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({ message: "Failed to retrieve user data", error });
    }
}



//Product Fetching for listing

exports.getProducts = async (req, res) => {
    try {
        const { brand, category, price, newArrivals } = req.query;
        const query = {};

        if (category) {
            const categoryDoc = await Category.findOne({ name: category });
            if (categoryDoc) query.category = categoryDoc._id.toString();
        }

        if (brand) {
            const brandDoc = await Brand.findOne({ name: brand });
            if (brandDoc) query.brand = brandDoc._id.toString();
        }

        if (price) {
            if (price === 'below-5000') {
                query.salesPrice = { $lt: 5000 };
            } else if (price === '5000-10000') {
                query.salesPrice = { $gte: 5000, $lte: 10000 };
            } else if (price === '10000-50000') {
                query.salesPrice = { $gte: 10000, $lte: 50000 };
            } else if (price === 'above-50000') {
                query.salesPrice = { $gt: 50000 };
            }
        }

        let sortOrder = {};

        if (newArrivals) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 30);
            query.createdAt = { $gt: currentDate };
            sortOrder = { createdAt: -1 };
        }

        if (price === 'High-Low') {
            sortOrder = { ...sortOrder, salesPrice: -1 };
        } else if (price === 'Low-High') {
            sortOrder = { ...sortOrder, salesPrice: 1 };
        }

        const products = await Product.find(query)
            .sort(sortOrder)
            .populate('category')
            .populate('brand');

        const categoryDoc = await Category.find();
        const brandDoc = await Brand.find();

        return res.status(200).json({
            message: "Successfully Fetched All Products",
            products,
            categoryDoc,
            brandDoc,
            isBlocked: req.body.isBlocked || false
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Failed To Fetch Product Data" });
    }
};


exports.getSimilarProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = await Product.findById(id);
        const similarProducts = await Product.find({ category: productData?.category })
            .populate("brand")
        if (similarProducts.length === 0)
            return res.status(404).json({ message: "No Similar products were founded !" })
        return res.status(200).json({ message: "Product fetched successfully", similarProducts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
}

exports.getBrandCategoryInfo = async (req, res) => {
    try {
        const { id } = req.params;

        const productData = await Product.findById(id).populate('category brand');
        if (!productData) {
            return res.status(404).json({ message: "Product not found" });
        }
        const { category, brand } = productData;

        console.log(category, brand)
        const isCategoryAvailable = category && category.isListed && !category.isDeleted;
        const isBrandAvailable = brand && brand.isListed && !brand.isDeleted;

        const isAvailable = isCategoryAvailable && isBrandAvailable;

        return res.status(200).json({ message: "success", isAvailable });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occurred fetching product/brand details" });
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
        // console.log(id);

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

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        console.log("Current Password:", currentPassword);
        console.log("New Password:", newPassword);
        console.log("User ID:", id);

        // Find user by ID
        const user = await User.findById(id);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found, checking current password...");

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            console.log("Current password is incorrect");
            return res.status(401).json({ message: "Please enter the correct password" });
        }

        console.log("Current password is correct, hashing new password...");

        // const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = newPassword;

        console.log("Saving new password...");
        await user.save();

        console.log("Password changed successfully");
        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({ message: "An error occurred while changing the password" });
    }
};



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

exports.getWallet = async (req, res) => {
    try {
        const { id } = req.params;
        const wallet =await Wallet.findOne({ user: id })
        if (!wallet)
            return res.status(400).json({ message: "Wallet not found" });
        return res.status(200).json({ message: "successfully fetched wallet data", wallet })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while fetching wallet data" })
    }
}
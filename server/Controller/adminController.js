const path = require("path");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const Orders = require("../models/orderModel");
const mongoose = require("mongoose")
const { listenerCount } = require("process");
const Coupon = require("../models/couponModel.");

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

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRETE, { expiresIn: '1h' });
        res.cookie('adminToken',
            token,
            {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 36000000
            });
        const adminData = {
            email, password
        }
        return res.status(200).json({ message: "Login Successfull", adminData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

exports.customers = async (req, res) => {
    try {
        const { filter } = req.query;
        // console.log("<<<<<<<<<<<<", filter, "<<<<<<<<<<<<")

        const users = await User.find();

        if (filter == "A-Z")
            users.sort((a, b) => a.firstName.localeCompare(b.firstName));
        else if (filter == "Z-A")
            users.sort((a, b) => b.firstName.localeCompare(a.firstName));
        else if (filter === "Recently added") {
            users = users.sort((a, b) => b.createdAt - a.createdAt);
        }
        // console.log(users);

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
    try {
        let { name, description } = req.body;
        console.log(req.file)
        const image = req.file?.path;
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
                name, description, image
            })
            return res.status(200).json({
                message: "Category added succesfully",
                category
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
exports.addBrand = async (req, res) => {
    try {
        let { name, description } = req.body;
        console.log(req.file)
        const image = req.file?.path;
        console.log(name, description);
        if (!description) {
            description = undefined;
        }
        const existBrand = await Brand.findOne({
            name: {
                $regex: `^${name}$`,
                $options: ""
            }
        })
        if (existBrand)
            return res.status(400).json({ message: "Brand already exists" });
        else {
            const brand = await Brand.create({
                name, description, image
            })
            return res.status(200).json({
                message: "Brand added succesfully",
                brand
            })
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
exports.getBrand = async (req, res) => {
    try {
        const brands = await Brand.find({});
        if (brands) {
            return res.json({ message: "succesully fetched all brands", brands });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Failed to fetch brands" });
    }
}

exports.deleteBrand = async (req, res) => {
    try {
        console.log(await Brand.find());
        let { id } = req.params;
        console.log("brand id is:", id);
        const deletedBrand = await Brand.
            findByIdAndUpdate({ _id: id }, { isDeleted: true, deletedAt: Date.now() });
        console.log(deletedBrand)
        if (deletedBrand)
            return res.status(200).json({ message: "Brand successfully deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "failed to delete Brand" });
    }
}

exports.brandRestore = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("brand id is:", id);
        const RestoredBrand = await Brand.
            findByIdAndUpdate({ _id: id }, { isDeleted: false, deletedAt: null });

        if (RestoredBrand)
            return res.status(200).json({ message: "Brand successfully Restore" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "failed to Restore Brand" });
    }
}

exports.editBrand = async (req, res) => {
    try {
        let { id, name, description } = req.body;
        if (!description) {
            description = undefined;
        }
        const isExistbrand = await Brand.findOne({ name, _id: { $ne: id } });
        if (isExistbrand) {
            return res.status(400).json({ message: "Brand already exists" });
        }
        const updateData = { name };
        if (description) updateData.description = description;
        if (req.file?.path) updateData.image = req.file.path;

        const updatedBrand = await Brand.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({
            message: "Successfully edited the brand",
            updatedBrand,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Brand not edited" });
    }
};

exports.listBrand = async (req, res) => {
    try {

        const { id } = req.params;
        const brand = await Brand.findById(id);
        console.log(brand);
        brand.isListed = !brand?.isListed
        brand.save();
        return res.status(200).json({ message: "success", brand })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message || "Failed to list/unlist Brand" })
    }
}


exports.deleteCategory = async (req, res) => {
    try {
        console.log(await Category.find());
        let { id } = req.params;
        // id =new mongoose.Types.ObjectId(id)
        console.log("category id is:", id);
        const deletedCategory = await Category.
            findByIdAndUpdate({ _id: id }, { isDeleted: true, deletedAt: Date.now() });
        console.log(deletedCategory)
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
        // const objectId = new mongoose.Types.ObjectId(id);
        if (!description) {
            description = undefined;
        }
        const isExistcategory = await Category.findOne({ name, _id: { $ne: id } });
        if (isExistcategory) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const updateData = { name };
        if (description) updateData.description = description;
        if (req.file?.path) updateData.image = req.file.path;

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({
            message: "Successfully edited the category",
            updatedCategory,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Category not edited" });
    }
};

exports.listCategory = async (req, res) => {
    try {

        const { id } = req.params;
        const category = await Category.findById(id);
        console.log(category);
        category.isListed = !category?.isListed
        category.save();
        return res.status(200).json({ message: "success", category })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message || "Failed to list/unlist Category" })
    }
}


exports.getProduct = async (req, res) => {
    try {
        const { filter } = req.query;
        console.log(filter)
        const products = await Product.find().populate([
            { path: "category" },
            { path: "brand" }
        ]);
        if (filter == "Recently Added")
            products.sort((a, b) => b.createdAt - a.createdAt);
        else if (filter == "High-Low")
            products.sort((a, b) => b.salesPrice - a.salesPrice);
        else if (filter == "Low-High")
            products.sort((a, b) => a.salesPrice - b.salesPrice);
        if (filter === "A-Z") {
            products.sort((a, b) => a.productName.localeCompare(b.productName));
        } else if (filter === "Z-A") {
            products.sort((a, b) => b.productName.localeCompare(a.productName));
        }
        return res.status(200).json({ message: "successfully fetched all products", products });
    } catch (error) {
        console.log(error)
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
            brand,
        } = req.body;

        const productImage = req.files.map((file) => file.path)
        console.log(productImage)
        const existProduct = await Product.findOne({ productName });

        const categoryDoc = await Category.findOne({ name: category });
        const brandDoc = await Brand.findOne({ name: brand })
        if (!categoryDoc)
            return res.status(400).json({ message: "Category not existing" });
        if (!brandDoc)
            return res.status(400).json({ message: "Brand not existing" });
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
                category: categoryDoc,
                brand: brandDoc,
                productImage
            });
            console.log("req got !!!!!!!!!!!!!!!!!!!!!!!!!")
            return res.status(200).json({ message: "product added successully" })
        }
    } catch (error) {
        console.log(error.message);
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
            brand,
            file
        } = req.body;
        console.log(
            productName,
            productDescription,
            salesPrice,
            regularPrice,
            units,
            category,
            brand,
            file
        )

        const { id } = req.params;
        let productImage = []
        productImage = req.files?.flatMap((file) => file?.path)
        if (file) {
            if (Array.isArray(file)) {
                productImage.push(...file);
            } else {
                productImage.push(file);
            }
        }
        console.log("id:", id)
        const existProduct = await Product.findOne({
            productName: { $regex: new RegExp(`^${productName}$`), $options: 'i' },
            _id: { $ne: id }
        });
        const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } })
        const brandDoc = await Brand.findOne({ name: { $regex: new RegExp(`^${brand}$`, 'i') } })
        if (!brandDoc)
            return res.status(400).json({ message: "Brand not existing" });
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
                brand: brandDoc._id,
                productImage
            });
            // console.log("req got !!!!!!!!!!!!!!!!!!!!!!!!!")
            return res.status(200).json({ message: "product edited successully" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message || "Error occurred while adding product" })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        let { id } = req.params;
        console.log("product id is:", id);
        const deletedProduct = await Product.
            findByIdAndUpdate({ _id: id }, { isDeleted: true, deletedAt: Date.now() });
        console.log(deletedProduct)
        if (deletedProduct)
            return res.status(200).json({ message: "Product successfully deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "failed to delete Product" });
    }
}

exports.restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("product id is:", id);
        const RestoredProduct = await Product.
            findByIdAndUpdate({ _id: id }, { isDeleted: false, deletedAt: null });

        if (RestoredProduct)
            return res.status(200).json({ message: "product successfully Restored" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "failed to Restore product" });
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
exports.editStatus = async (req, res) => {
    try {
        console.log("hey")
        const { id } = req.query;
        const { orderId, productId, updatedStatus } = req.body;

        console.log("product Id: ", productId);
        console.log("order Id: ", orderId)
        const updatingOrder = await Orders.findOne({ orderId })
        console.log(updatingOrder);

        if (!updatingOrder) {
            console.log("Order not found");
            return res.status(404).json({ message: "Order not found" });
        }

        if (!updatedStatus) {
            console.log("No status were founded");
        } else {
            const productIndex = updatingOrder.orderItems.findIndex((product) => product._id.toString() == productId);

            if (productIndex === -1) {
                console.log("Product not found in order items");
                return res.status(404).json({ message: "Product not found" });
            }
            console.log("test flag", updatedStatus)
            updatingOrder.orderItems[productIndex].productStatus = updatedStatus;
            console.log(updatingOrder);
            await updatingOrder.save();
            console.log("saved")
            return res.status(200).json({ message: "updated order status" })
        }
    } catch (error) {
        console.log(error.message);

        return res.status(500).json({ message: "Error occured while updating status" });
    }
}

exports.getOrder = async (req, res) => {
    try {
        const { filter } = req.query;
        const query = {};

        // Filtering by `productStatus` inside `orderItems`
        if (["cancelled", "shipped", "processing", "delivered", "returned"].includes(filter)) {
            query.orderItems = { $elemMatch: { productStatus: filter } };
        }

        // Fetch orders with filtered `productStatus`, populating `orderItems.product.category`
        const orderData = await Orders.find(query)
            .populate({
                path: "orderItems.product",
                populate: {
                    path: "category",
                    model: "category"
                }
            });

        // Sort the results based on the `filter` value
        if (filter === "Recent") {
            orderData.sort((a, b) => b.orderDate - a.orderDate);
        } else if (filter === "Oldest") {
            orderData.sort((a, b) => a.orderDate - b.orderDate);
        } else if (filter === "A-Z") {
            orderData.sort((a, b) => {
                if (a.orderItems.length > 0 && b.orderItems.length > 0) {
                    return a.orderItems[0].product.productName.localeCompare(b.orderItems[0].product.productName);
                }
                return 0;
            });
        } else if (filter === "Z-A") {
            orderData.sort((a, b) => {
                if (a.orderItems.length > 0 && b.orderItems.length > 0) {
                    return b.orderItems[0].product.productName.localeCompare(a.orderItems[0].product.productName);
                }
                return 0;
            });
        }

        if (!orderData.length) {
            console.log("No orders were found with the given filter.");
            return res.status(404).json({ message: "No orders found." });
        }

        return res.status(200).json({ message: "Orders fetched successfully", orderData });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
};


exports.getCoupons = async (req, res) => {
    try {
        console.log("getted coupon");
        const coupons = await Coupon.find();
        if (coupons)
            return res.status(200).json(coupons);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while fecthing coupon data" });
    }
}
exports.addCoupons = async (req, res) => {
    try {
        console.log("added coupon");
        const { couponCode,
            couponType,
            couponAmount,
            description,
            totalLimit,
            perUserLimit,
            purchaseAmount,
            expiryDate,
            maxDiscount } = req.body;
        console.log(
            couponCode,
            couponType,
            couponAmount,
            description,
            totalLimit,
            perUserLimit,
            purchaseAmount,
            expiryDate,
            maxDiscount)
        const expirationDate = new Date(expiryDate + 'T00:00:00Z');
        console.log(expirationDate)
        const coupon = await Coupon.findOne({ couponCode });
        console.log(coupon)
        if (coupon)
            return res.status(400).json({ message: "Coupon code already added" })
        const newCouponData = new Coupon({
            couponCode,
            description,
            couponType,
            couponAmount,
            purchaseAmount,
            expirationDate,
            totalLimit,
            perUserLimit,
            maxDiscount
        })
        await newCouponData.save();
        return res.status(200).json({ message: "Coupon added successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while adding coupon" })
    }
}

exports.deleteCoupon = async (req, res) => {
    try {
        console.log("hey")
        const { id } = req.params;
        console.log(id, "delete coupon id")
        const coupon =await Coupon.findOneAndDelete({_id:id}, { new: true });
        if (coupon)
            return res.status(200).json({ message: "Coupon deleted successfully" });
        else
            return res.status(400).json({ message: "Coupon failed to delete" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error occured while deleting coupon" })
    }
}
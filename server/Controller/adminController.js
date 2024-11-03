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
                category: categoryDoc,
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
        productImage = req.files.flatMap((file) => file.path)
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
        const { id } = req.query;
        const { orderId, productId, updatedStatus } = req.body;

        console.log("product Id: ", productId)
        console.log("order Id: ", orderId)
        const updatingOrder = await Orders.findOne({ user: id, orderId })
        console.log(updatingOrder);

        if (!updatingOrder) {
            console.log("Order not found");
            return res.status(404).json({ message: "Order not found" });
        }

        if (!updatedStatus) {
            console.log("No status were founded");
        } else {
            const productIndex = updatingOrder.orderItems.findIndex((product) => product.product.toString() == productId);

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
        const orderData = await Orders.find()
    .populate({
        path: "orderItems.product", 
        populate: {
            path: "category", 
            model: "category" 
        }
    })
    // .populate("user");

        if (!orderData)
            console.log("No order were founded in this user id");
        return res.status(200).json({ message: "Orders fetched successfully", orderData });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
}
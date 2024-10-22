const express = require('express');
const router = express.Router();
const adminController = require("../Controller/adminController");
const { uploadImage } = require("../Middleware/multer")
const { verifyAdmin } = require("../Middleware/adminAuth");
const { single, multiple } = require("../Middleware/multer")

router.post("/adminLogin", adminController.login);
router.get("/customers", adminController.customers);
router.get("/block/:id", verifyAdmin, adminController.blockUser);
router.get("/category", adminController.getCategory)
router.put("/categoryDelete/:id", adminController.deleteCategory);
router.put("/categoryRestore/:id", adminController.categoryRestore);
router.post("/handleCategoryListing/:id", verifyAdmin, adminController.listCategory)
router.post("/addCategory", uploadImage.single("file"), verifyAdmin, adminController.addCategory);
router.put("/editCategory", uploadImage.single("file"), verifyAdmin, adminController.editCategory);
router.put("/editProduct/:id", uploadImage.array("file"), verifyAdmin, adminController.editProduct);
router.post("/addProduct", uploadImage.array("file"), verifyAdmin, adminController.addProduct);
router.get("/getProduct", adminController.getProduct);
router.post("/handleProductListing/:id", verifyAdmin, adminController.handleProductListing);

module.exports = router; 
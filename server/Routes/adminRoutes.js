const express = require('express');
const router = express.Router();
const adminController = require("../Controller/adminController");
const uploadImage = require("../Middleware/multer")
const { verifyAdmin } = require("../Middleware/adminAuth");

router.post("/adminLogin", adminController.login);
router.get("/customers", adminController.customers);
router.get("/block/:id", adminController.blockUser);
router.post("/addCategory", uploadImage.single("file"), adminController.addCategory);
router.get("/category", adminController.getCategory)
router.put("/categoryDelete/:id", adminController.deleteCategory);
router.put("/categoryRestore/:id", adminController.categoryRestore);
router.put("/editCategory", uploadImage.single("file"), adminController.editCategory);
router.post("/handleCategoryListing/:id", adminController.listCategory)
router.post("/addProduct", uploadImage.array("file"), adminController.addProduct)
router.put("/editProduct/:id", uploadImage.array("file"), adminController.editProduct);
router.get("/getProduct", adminController.getProduct);
router.post("/handleProductListing/:id", adminController.handleProductListing);

module.exports = router; 
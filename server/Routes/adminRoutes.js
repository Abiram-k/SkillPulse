const express = require('express');
const router = express.Router();
const adminController = require("../Controller/adminController");
const { uploadImage } = require("../Middleware/multer")
const { verifyAdmin } = require("../Middleware/adminAuth");


router.post("/adminLogin", adminController.login);
router.get("/customers", adminController.customers);
router.get("/block/:id", verifyAdmin, adminController.blockUser);
router.get("/category", adminController.getCategory)
router.put("/categoryDelete/:id", verifyAdmin, adminController.deleteCategory);
router.put("/productDelete/:id", verifyAdmin, adminController.deleteProduct);
router.put("/productRestore/:id", verifyAdmin, adminController.restoreProduct);

router.put("/categoryRestore/:id", verifyAdmin, adminController.categoryRestore);
router.post("/handleCategoryListing/:id", verifyAdmin, adminController.listCategory)
router.post("/addCategory", uploadImage.single("file"), verifyAdmin, adminController.addCategory);
router.put("/editCategory", uploadImage.single("file"), verifyAdmin, adminController.editCategory);
router.put("/editProduct/:id", uploadImage.array("file"), verifyAdmin, adminController.editProduct);
router.post("/addProduct", uploadImage.array("file"), verifyAdmin, adminController.addProduct);
router.get("/getProduct", adminController.getProduct);
router.post("/handleProductListing/:id", verifyAdmin, adminController.handleProductListing);

router.patch("/status",adminController.editStatus)
module.exports = router; 
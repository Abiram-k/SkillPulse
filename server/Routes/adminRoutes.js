const express = require('express');
const router = express.Router();
const adminController = require("../controller/adminController");
const { uploadImage } = require("../Middleware/multer")
const { verifyAdmin } = require("../Middleware/adminAuth");


router.post("/adminLogin", adminController.login);
router.get("/customers",verifyAdmin, adminController.customers);

router.get("/block/:id", verifyAdmin, adminController.blockUser);
router.put("/productDelete/:id", verifyAdmin, adminController.deleteProduct);
router.put("/productRestore/:id", verifyAdmin, adminController.restoreProduct);

router.get("/category", adminController.getCategory)
router.put("/categoryDelete/:id", verifyAdmin, adminController.deleteCategory);
router.put("/categoryRestore/:id", verifyAdmin, adminController.categoryRestore);
router.post("/handleCategoryListing/:id", verifyAdmin, adminController.listCategory)
router.post("/addCategory", uploadImage.single("file"), verifyAdmin, adminController.addCategory);
router.put("/editCategory", uploadImage.single("file"), verifyAdmin, adminController.editCategory);
router.put("/editCategory", uploadImage.single("file"), verifyAdmin, adminController.editCategory);

router.get("/brand", adminController.getBrand)
router.put("/brandDelete/:id", verifyAdmin, adminController.deleteBrand);
router.put("/brandRestore/:id", verifyAdmin, adminController.brandRestore);
router.post("/handleBrandListing/:id", verifyAdmin, adminController.listBrand)
router.post("/addBrand", uploadImage.single("file"), verifyAdmin, adminController.addBrand);
router.put("/editBrand", uploadImage.single("file"), verifyAdmin, adminController.editBrand);


router.put("/editProduct/:id", uploadImage.array("file"), verifyAdmin, adminController.editProduct);
router.post("/addProduct", uploadImage.array("file"), verifyAdmin, adminController.addProduct);
router.get("/getProduct", adminController.getProduct);
router.post("/handleProductListing/:id", verifyAdmin, adminController.handleProductListing);

router.patch("/status", adminController.editStatus)
router.get("/order", adminController.getOrder)
module.exports = router; 
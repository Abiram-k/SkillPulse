const express = require('express');
const router = express.Router();
const adminController = require("../Controller/adminController")


router.post("/adminLogin",adminController.login);
router.get("/customers",adminController.customers);
router.get("/block/:id",adminController.blockUser);
router.post("/addCategory",adminController.addCategory);
router.get("/category",adminController.getCategory)
router.delete("/categoryDelete/:id",adminController.deleteCategory);
router.put("/editCategory",adminController.editCategory);
module.exports = router;
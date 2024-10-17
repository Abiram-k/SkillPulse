const express = require('express');
const router = express.Router();
const adminController = require("../Controller/adminController")


router.post("/adminLogin",adminController.login);
router.get("/customers",adminController.customers)
module.exports = router;
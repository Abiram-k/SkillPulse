
const userController = require("../controller/userController");
const cartController = require("../controller/cartController");
const wishlistController = require("../controller/wishlistController");
const orderController = require("../controller/orderController");
const express = require('express');
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { verifyUser } = require("../Middleware/userAuth");
const { isBlocked } = require("../Middleware/isBlockedUser");
const { uploadImage } = require("../Middleware/multer")

router.get('/', userController.baseRoute);
router.post('/signUp', userController.signUp);
router.post('/login', userController.login);
router.post('/otp', userController.otp);
router.post('/resendOtp', userController.resendOtp)
router.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));
router.get('/auth/google/callback',
    passport.authenticate('google',
        { failureRedirect: 'http://localhost:5173/login' }),
    (req, res) => {
        res.redirect('http://localhost:5173/googleRedirect')
    });

router.get("/products", verifyUser, isBlocked, userController.getProducts);
router.get("/getSimilarProduct/:id", userController.getSimilarProduct);

router.post("/user", verifyUser, isBlocked, uploadImage.single("file"), userController.updateUser);
router.get("/user/:id", verifyUser, isBlocked, userController.getUser);
router.post("/address", verifyUser, isBlocked, uploadImage.none(), userController.addAddress);//none to handle form data ,with no files
router.get("/address", verifyUser, isBlocked, userController.getAddress);
router.delete("/address", verifyUser, isBlocked, userController.deleteAddress);
router.get("/editAddress", verifyUser, isBlocked, userController.getEditAddress);
router.put("/editAddress", verifyUser, isBlocked, uploadImage.none(), userController.editAddress);

router.post("/addToCart/:id", verifyUser, isBlocked, userController.addToCart);
router.get("/cart/:id", verifyUser, isBlocked, cartController.getCart);
router.post("/updateQuantity/:productId", verifyUser, isBlocked, cartController.updateQuantity);
router.delete("/cartItem/:productId", verifyUser, isBlocked, cartController.removeCartItem);

// router.delete("/cartItem/:productId", wishlistController.removewishlistItme);
router.get("/wishlist", verifyUser, isBlocked, wishlistController.getwishlist);
router.post("/wishlist", verifyUser, isBlocked, wishlistController.addTowishlist);

router.post("/order/:id", verifyUser, isBlocked, orderController.addOrder);
router.get("/order", verifyUser, isBlocked, orderController.getOrder);
router.post("/cancelOrder", verifyUser, isBlocked, orderController.cancelOrder);

module.exports = router;
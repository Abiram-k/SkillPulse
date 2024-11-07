
const userController = require("../controller/userController");
const cartController = require("../controller/cartController");
const wishlistController = require("../controller/wishlistController");
const orderController = require("../controller/orderController");
const adminController = require("../controller/adminController")
const express = require('express');
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { verifyUser } = require("../Middleware/userAuth");
const { isBlocked } = require("../Middleware/isBlockedUser");
const { uploadImage } = require("../Middleware/multer");

const dotenv = require("dotenv");
const path = require("node:path");
const User = require("../models/userModel");

dotenv.config({ path: path.resolve(__dirname, "../.env") })

router.get('/', userController.baseRoute);
router.post('/signUp', userController.signUp);
router.post('/login', userController.login);
router.post('/otp', userController.otp);
router.post('/resendOtp', userController.resendOtp);

router.post('/verifyEmail', userController.verifyEmail);
router.post('/verifyResetOtp', userController.verifyResetOtp);
router.patch('/forgotPassword', userController.forgotPassword);

router.get('/auth/google', (req, res, next) => {
    const state = JSON.stringify({ method: req.query.method });
    passport.authenticate('google', {
        scope: ['email', 'profile'],
        state: state
    })(req, res, next);
});

router.get('/googleUser', userController.getUserData);
router.get('/auth/google/callback',
    passport.authenticate('google',
        { failureRedirect: 'http://localhost:5173/login' }),
    async (req, res) => {
        try {
            const state = JSON.parse(req.query.state || '{}');
            const method = state.method;
            const email = req.user?.emails?.[0]?.value;

            if (method == 'signup') {
                const existingUser = User.findOne(email);
                if (existingUser) {
                    return res.redirect('http://localhost:5173/login?error=user_exists');
                }
            }
            const token = jwt.sign({
                id: req.user._id,
                email: req.user.email
            },
                process.env.JWT_SECRETE,
                { expiresIn: '1h' })

            res.cookie('userToken', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 3600000
            });

            res.redirect('http://localhost:5173/googleRedirect')
        } catch (error) {
            console.error("Authentication error:", error);
            res.redirect('http://localhost:5173/signup?error=server_error');
        }
    });


router.get("/products", verifyUser, isBlocked, userController.getProducts);
router.get("/getSimilarProduct/:id", userController.getSimilarProduct);
router.get("/brand-category-info/:id", userController.getBrandCategoryInfo);

router.post("/user", verifyUser, isBlocked, uploadImage.single("file"), userController.updateUser);
router.get("/user/:id", verifyUser, isBlocked, userController.getUser);
router.post("/address", verifyUser, isBlocked, uploadImage.none(), userController.addAddress);
router.patch("/password/:id", verifyUser, isBlocked, userController.changePassword);

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
router.post("/wishlist", verifyUser, isBlocked, wishlistController.addToWishlist);
router.delete("/wishlist", verifyUser, isBlocked, wishlistController.deleteWishlistItem);

router.post("/order/:id", verifyUser, isBlocked, orderController.addOrder);
router.get("/order", verifyUser, isBlocked, orderController.getOrder);
router.patch("/cancelOrder", verifyUser, isBlocked, orderController.cancelOrder);
router.patch("/returnOrder", verifyUser, isBlocked, orderController.returnOrder);

router.get("/wallet/:id", verifyUser, isBlocked, userController.getWallet);

router.get("/coupon", adminController.getCoupons);

module.exports = router;
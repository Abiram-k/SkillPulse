const Wishlist = require("../models/wishlistModel");


exports.getwishlist = async (req, res) => { 
    try {
        const wishlist = await Wishlist.find();
        console.log(wishlist);
        return res.status(200).json({ message: "Successfully fetched all the wishlist items", wishlist });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server failed to fetch wishlist items" });
    }
}

exports.addTowishlist = async (req, res) => {
    try {
        console.log("hey")
    } catch (error) { 

    }
}
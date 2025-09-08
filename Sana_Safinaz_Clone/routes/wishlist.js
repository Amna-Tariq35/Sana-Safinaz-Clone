const express = require("express");
const router = express.Router();
const Product = require('../models/homeProducts');
const User = require("../models/User");


router.get("/", async (req, res) => {
    try {
    
        // Find the logged-in user
        const user = await User.findById(req.session.user._id).populate("wishlist");
        if (!user) {
            return res.status(404).render("wishlist", {
                message: "User not found.",
                products: []
            });
        }

        // Get the wishlist products
        const products = user.wishlist;

        res.render("wishlist", {
            message: products.length > 0 ? null : "Your wishlist is empty.",
            products
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).render("wishlist", {
            message: "Server error.",
            products: []
        });
    }
});

router.get("/add/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if the user is logged in
        if (!req.session.user) {
            return res.status(401).json({ message: "Please log in to add items to your wishlist" });
        }

        // Find the logged-in user
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
            if (user.wishlist.includes(productId)) {
                return res.status(400).json({ message: "Product already in wishlist" });
            }

        // Check if the product is already in the wishlist
        

        // Add product ID to user's wishlist
        user.wishlist.push(productId);
        await user.save();

        res.redirect("/wishlist");
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.delete('/delete/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.session.user; // Get the logged-in user's ID

        // Find the user and update their wishlist
        await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } });


         res.status(200).json({ message: 'Product removed from wishlist' });
        
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ message: 'Failed to remove product from wishlist' });
    }
});

module.exports = router;

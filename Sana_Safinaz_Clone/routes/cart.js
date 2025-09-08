const express = require("express");
const router = express.Router();
const homeProduct = require('../models/homeProducts');
const User = require("../models/User");
const Order = require("../models/Order");


router.get("/add/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await homeProduct.findById(productId);

        if (!product) {
            req.flash("error_msg", "Product not found");
            return res.redirect("/");
        }

        // Initialize cart in session if it doesn't exist
        if (!req.session.cart) req.session.cart = [];

        // Check if product is already in the cart
        const existingProduct = req.session.cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1; // Increment quantity
        } else {
            console.log(product.name);
            // Add new product to the cart
            req.session.cart.push({
                id: product._id,
                name: product.title,
                price: product.price,
                image: product.image, // Assuming you have an image field
                quantity: 1,
            });
        }
        console.log("Product added to cart!")
        req.flash("success_msg", "Product added to cart!");
        res.redirect("/cart");
    } catch (error) {
        console.error("Error adding product to cart:", error);
        req.flash("error_msg", "Something went wrong");
        res.redirect("/");
    }
});
// Render Cart Page
router.get("/", (req, res) => {

    const cart = req.session.cart || [];
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    console.log("cart:" + cart);

    res.render("cart/cart", { cart, totalPrice });
});
router.get("/checkout", (req, res) => {
    res.render("cart/checkout", { user: req.session.user });
});


router.post("/checkout", async (req, res) => {
    try {
        const { shippingAddress, phone } = req.body;

        // Assuming req.session.cart contains cart items and user is logged in
        const cart = req.session.cart || [];
        const userId = req.session.user._id;

        const orderTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        if (cart.length === 0) {
            return res.status(400).send("Your cart is empty");
        }
        console.log("Cart 1" + cart[0]);

        const orderItems = cart.map(item => ({

            productId: item.id, // Ensure this exists in the cart data
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        }));
        orderItems.forEach(element => {
            console.log(element);
        });


        const newOrder = new Order({
            user: userId,
            items: orderItems,
            shippingAddress,
            phone,
            orderTotal: orderTotal + 190,
        });

        await newOrder.save();

        // Clear the cart
        req.session.cart = [];

        res.redirect("/cart/confirm");
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to place order" });
    }
});
router.get("/confirm", (req, res) => {
    res.render("cart/confirm", { message: "Your order has been placed successfully!" });
});



// Apply this to the relevant routes

router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    // Access the cart from the session
    const cart = req.session.cart || [];

    // Find the item in the cart and remove it
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1); // Remove item from cart

        // Update session cart and recalculate total
        req.session.cart = cart;
        const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.json({ success: true, newTotal });
    } else {
        res.json({ success: false, message: "Item not found in the cart" });
    }
});



// Update product quantity
router.post("/update/:id/:action", (req, res) => {
    const { id, action } = req.params;

    if (!req.session.cart) return res.json({ success: false });

    const product = req.session.cart.find(item => item.id === id);

    if (!product) return res.json({ success: false });

    if (action === "increase") {
        product.quantity += 1;
    } else if (action === "decrease") {
        product.quantity -= 1;
        // Remove product if quantity reaches 0
        if (product.quantity <= 0) {
            req.session.cart = req.session.cart.filter(item => item.id !== id);
        }
    }

    res.json({ success: true });
});

module.exports = router;

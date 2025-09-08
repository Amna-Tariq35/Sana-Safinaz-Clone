const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const homeProduct = require('./models/homeProducts');
const User = require("./models/User");
const Order = require("./models/Order");
let session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
let cookieParser = require("cookie-parser");



const app = express();
app.use(cookieParser());

app.use(
    session({
        secret: "your_secret_key",
        resave: false, // Prevents resaving session if it wasn’t modified
        saveUninitialized: true, // Saves uninitialized sessions
    })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
app.get("/test-flash", (req, res) => {
    req.flash("success_msg", "Flash message test successful!");
    res.redirect("/show-flash");
});

app.get("/show-flash", (req, res) => {
    res.send(res.locals.success_msg || "No flash message");
});





mongoose.connect("mongodb://localhost/sana_safinaz")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));


app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(express.static( "public")); // Serve static files


app.use(expressLayouts); // Enable layouts
app.set("view engine", "ejs");
function priceFormat(price) {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 2 // Ensure two decimal places
    }).format(price);
}
let authMiddleware = require("./middleware/auth");
let adminMiddleware = require("./middleware/admin");
console.log(typeof adminMiddleware);
app.get('/', async (req, res) => {
    try {
        const products = await homeProduct.find(); 
        res.render('index', { products,priceFormat });    
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
// Routes
app.get('/auth/login', (req, res) => {
    res.render("auth/login", {
        success_msg: res.locals.success_msg,
        error_msg: res.locals.error_msg
    });;
});
app.get('/auth/signup', (req, res) => {
    res.render("auth/signup", {
        success_msg: res.locals.success_msg,
        error_msg: res.locals.error_msg
    });;
});
app.post("/auth/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            req.flash("error_msg", "All fields are required.");
            return res.redirect("/auth/signup");
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error_msg", "Email is already registered.");
            return res.redirect("/auth/signup");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        // Create a new user
        const newUser = new User({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword
        });

        await newUser.save();

        // Send success message
        req.flash("success_msg", "Account created successfully. Please log in.");
        return res.redirect("/auth/login");

    } catch (error) {
        console.error("Error during signup:", error);
        req.flash("error_msg", "An error occurred during signup. Please try again.");
        return res.redirect("/auth/signup");
    }
    
 
});
// Login Route
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user || !user.password || !(await bcrypt.compare(password.trim(), user.password))) {
            req.flash("error_msg", "Invalid email or password.");
            return res.redirect("/auth/login");
        }
        // Check role and redirect accordingly
        if (user.role === "admin") {
            req.session.user = user; // Store user in session
            return res.redirect("/admin");
        }

        // Save user to session and redirect
        req.session.user = user;
        return res.redirect("/");
    } catch (err) {
        console.error("Error during login:", err);
        req.flash("error_msg", "An error occurred during login. Please try again.");
        return res.redirect("/auth/login");
    }
   
  




});

app.get("/logout", async (req, res) => {
    req.session.user = null;
    return res.redirect("/auth/login");
  });


  function isAdmin(req, res, next) {
      if (req.session.user && req.session.user.role === "admin") {
          return res.status(403).json({ success: false, message: "Admin access denied" });
      }
      next();
  }
  

// Admin Panel Routes
const adminRoutes = require("./routes/admin");
app.use("/admin",[authMiddleware,adminMiddleware], adminRoutes);
const cartRoutes = require("./routes/cart");
app.use("/cart",[authMiddleware,isAdmin], cartRoutes);
const wishRoutes = require("./routes/wishlist");
app.use("/wishlist",[authMiddleware,isAdmin], wishRoutes);

// Server Setup
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
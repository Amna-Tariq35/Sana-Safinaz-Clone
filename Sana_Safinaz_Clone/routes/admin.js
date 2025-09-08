const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const multer = require("multer");

// Admin Dashboard
router.get("/", (req, res) => {
    res.render("admin/index", { layout:"admin/admin-layout",title: "Admin Panel" });
});
// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Product Routes
// View all products



// Add product
router.get("/products/add", async (req, res) => {
    try {
        const categories = await Category.find();
        res.render("admin/add-Product", { layout:"admin/admin-layout", title: "Add Product", categories });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

router.post("/products/add",upload.single('image') ,async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        if (!image) {
            return res.status(400).send('Image is required.');
        }

        // Create a new product
        const product = new Product({
            name,
            price,
            category,
            image
        });

        await product.save();
        res.redirect('/admin/products'); // Redirect to product list after adding
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding product');
    }  
    
});


router.get("/products/:page?", async (req, res) => {
    
  
    try {
      const page = parseInt(req.params.page) || 1; // Default page to 1
      const pageSize = 4; // Number of products per page
  
      const search = req.query.search || ""; // Search query
      const fromPrice = parseInt(req.query.fromPrice) || 0; // Minimum price
      const toPrice = parseInt(req.query.toPrice) || Number.MAX_SAFE_INTEGER; // Maximum price
      const sort = req.query.sort || ""; // Sorting order
  
      // Construct search query
      const searchQuery = {
        price: { $gte: fromPrice, $lte: toPrice }, // Filter by price range
      };
  
      if (search) {
        searchQuery.name = { $regex: search, $options: "i" }; // Case-insensitive search by name
      }
  
      // Sort query
      const sortQuery = {};
      if (sort === "price_asc") {
        sortQuery.price = 1; // Ascending order
      } else if (sort === "price_desc") {
        sortQuery.price = -1; // Descending order
      }
  
      // Fetch total records and calculate total pages
      const totalRecords = await Product.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalRecords / pageSize);
  
      // Fetch filtered and sorted products with pagination
      const products = await Product.find(searchQuery)
        .sort(sortQuery)
        .limit(pageSize)
        .skip((page - 1) * pageSize)
        .populate("category", "name") // Populate category field with only 'name'
        .exec();
  
      // Render the products page
      res.render("admin/products", {
        layout: "admin/admin-layout",
        products,
        page,
        totalPages,
        totalRecords,
        search,
        fromPrice,
        toPrice,
        sort,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).render("error", {
        message: "Unable to fetch products",
        error,
      });
    }
  });
  
           

    
            
       
    

// Edit product
router.get("/products/edit/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
        const categories = await Category.find();
        res.render("admin/editProduct", { layout:"admin/admin-layout",title: "Edit Product", product, categories });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

router.post("/products/edit/:id", async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Update fields
        product.name = name;
        product.price = price;
        product.category = category;

        // If an image is uploaded, update the image path
        if (req.file) {
            product.image = `/uploads/${req.file.filename}`;
        }

        // Validate required fields
        if (!name || !price || !category || !product.image) {
            console.log(name );
            console.log(price);
            console.log(category);
            return res.status(400).send('All fields are required.');
        }

        await product.save();
        res.redirect('/admin/products'); // Redirect to product listing
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product');
    }
});


// Delete product
router.get("/products/delete/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/admin/products");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// Route to display all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find()
        .populate('user') // Populate the user field and include specific fields
        .populate('items.productId');// Populate productId within items and include specific fields
       // Fetch all orders from the database
        res.render('admin/orders', { layout:"admin/admin-layout",orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server Error');
    }
});

// Route to update order status
router.put('/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = status; // Update the status field
        await order.save();

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});


// Category Routes
// View all categories
router.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find();
        res.render("admin/categories", { layout:"admin/admin-layout",title: "Categories", categories });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});


// Add category
router.get("/categories/add", (req, res) => {
    // res.render("admin/add-Category", {layout:"admin/admin-layout", title: "Add Category" });
    res.render("admin/add-Category", { layout:"admin/admin-layout",title: "Add Category" })
});

router.post("/categories/add", async (req, res) => {
    const { name } = req.body;

    try {
        const newCategory = new Category({ name });
        await newCategory.save();
        res.redirect("/admin/categories");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// Edit category
router.get("/categories/edit/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render("admin/editCategory", {layout:"admin/admin-layout",title: "Edit Category", category });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

router.post("/categories/edit/:id", async (req, res) => {
    const { name } = req.body;

    try {
        await Category.findByIdAndUpdate(req.params.id, { name });
        res.redirect("/admin/categories");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// Delete category
router.get("/categories/delete/:id", async (req, res) => {
    try {
            // Fetch all products without any filters
            const allProducts = await Product.find().populate("category");
        
            // Filter products based on the current category ID
            const productsToDelete = allProducts.filter(product => product.category && product.category._id.toString() === req.params.id.toString());
        
            // Array to store product IDs to be deleted
            const productIds = productsToDelete.map(product => product._id);
        
            console.log('Products to delete:', productIds);
        
            // Loop through the product IDs and delete each product
            for (const id of productIds) {
              await Product.findByIdAndDelete(id);
            }
        
        

          
        await Category.findByIdAndDelete(req.params.id);
        res.redirect("/admin/categories");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
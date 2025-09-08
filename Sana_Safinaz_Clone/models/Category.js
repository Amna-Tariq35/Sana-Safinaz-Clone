const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
categorySchema.pre('remove', async function (next) {
    try {
        // Fetch all products without any filters
        const allProducts = await Product.find().populate("category");
    
        // Filter products based on the current category ID
        const productsToDelete = allProducts.filter(product => product.category && product.category._id.toString() === this._id.toString());
    
        // Array to store product IDs to be deleted
        const productIds = productsToDelete.map(product => product._id);
    
        console.log('Products to delete:', productIds);
    
        // Loop through the product IDs and delete each product
        for (const id of productIds) {
          await Product.findByIdAndDelete(id);
        }
    
        console.log('Deleted all products for category:', this._id);
    
        next();
      } catch (error) {
        console.error('Error deleting products associated with the category:', error);
        next(error);
      }
      });
      

module.exports = mongoose.model('Category', categorySchema);


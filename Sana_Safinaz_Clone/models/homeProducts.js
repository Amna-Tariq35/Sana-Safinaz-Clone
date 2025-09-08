const mongoose = require('mongoose');

const homeProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Clothing', 'Shoes', 'Fragrances'] 
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('HomeProduct', homeProductSchema);

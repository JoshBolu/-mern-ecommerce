import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    price: {
        type: Number,
        required: [true, "price is required"]
    },
    inStock: {
        type: Number,
        required: [true, "Stock number is required"]
    },
    image: {
        type: String,
        required: [true, "image is required"]
    },
    category:{
        type: String,
        required: [true, "category is required"]
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Product = mongoose.model("Product", ProductSchema);

export default Product 
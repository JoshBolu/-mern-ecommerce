import { StatusCodes } from "http-status-codes"
import { redis } from "../lib/redis.js"
import Product from "../model/product.model.js"
import cloudinary from "../lib/cloudinary.js"



async function updateFeaturedProductsCache(){
    try {
        const featuredProducts = await Product.find({ isFeatured: true}).lean()
        await redis.set("featuredProducts", JSON.stringify(featuredProducts), "EX", 60 * 60 * 24 * 14)
    } catch (error) {
        console.log(`Error at updateFeaturedProductsCache: ${error.message}`)
    }
}

export const getAllProducts = async (req, res) => {
    try{
        const product = await Product.find()
        res.status(StatusCodes.OK).json(product)
    }
    catch(err){
        console.log(`Error at getAllProducts: ${err.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err: err.message})
    }
}

export const getFeaturedProducts = async (req, res)=> {
    try{
        // check if it's in redis
        let featuredProducts = await redis.get("featuredProducts")
        
        if(featuredProducts){
            return res.status(StatusCodes.OK).json(JSON.parse(featuredProducts))     
        }
        // if it's not in redis fetch from db and set in redis
        // .lean() is used to return a plain js object instead of a mongoose document
        // this is useful for performance and to avoid issues with mongoose document methods
        featuredProducts = await Product.find({isFeatured: true}).lean()
        
        if(!featuredProducts){
            return res.status(StatusCodes.NOT_FOUND).json({msg: "No featured products found"})
        }

        await redis.set("featuredProducts", JSON.stringify(featuredProducts), "EX", 60 * 60 * 24 * 14)
        res.status(StatusCodes.OK).json(featuredProducts)
    }
    catch(error){
        console.log(`Error at getFeaturedProducts controller: ${err.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err: err.message})
    }
}

export const createProduct = async (req, res) => {
    try{
        const { name, description, price, inStock, category, image } = req.body;

        let cloudinaryResponse = null

        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            inStock,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url: "",
            category,
        })
        
        res.status(StatusCodes.CREATED).json(product)
    }
    catch(error){
        console.log(`Error at createProduct controller: ${error.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err: error.message});
    }
}

export const getProductByCategory = async (req, res) => {
    const { category } = req.params
    try {
        const product = await Product.find({category})
        res.status(StatusCodes.OK).json(product)
    } catch (error) {
        console.log(`Error at getProductByCategory controller: ${error.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err: error.message})        
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {$sample: { size: 4 } },
            {$project: {
                _id: 1,
                name: 1,
                description: 1,
                image: 1,
                price: 1
            }}
        ])

        res.status(StatusCodes.OK).json(products)
    } catch (error) {
        console.log(`Error at getRecommendedProducts controller: ${error.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message})        
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product not found"})
        }
        product.isFeatured = !product.isFeatured
        const updatedProduct = await product.save()
        // update redis cache
        await updateFeaturedProductsCache()
        res.status(StatusCodes.OK).json(updatedProduct)
    } catch (error) {
        console.log(`Error at toggleFeaturedProduct controller: ${error.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err: error.message})                
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            res.status(StatusCodes.NOT_FOUND).json({message: "Product not found"})
        }

        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted image from cloudinary", error)
            } catch (error) {
                console.log(`error deleting image from cloudinary: ${error.message}`)                
            }
        }
        await Product.findByIdAndDelete(req.params.id)
        res.status(StatusCodes.OK).json({message: "Product deleted successfully"})
    } catch (error) {
        console.log(`Error at deleteProduct controller: ${error.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err: error.message})        
    }
}
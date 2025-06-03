import { StatusCodes } from "http-status-codes";
import Product from "../model/product.model.js";

export const getCartProducts = async (req, res) => {
    try{
        // First we get a full breakDown of the products in the cart using their ProductId's
        const productIds = req.user.cartItems.map(item => item.product);

        // Find products by IDs
        const products = await Product.find({ _id: { $in: productIds } }).select("-__v -createdAt -updatedAt -inStock");

        // add quantity for each product
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.product.toString() === product._id.toString() );
            return { ...product.toJSON(), quantity: item.quantity}
        });
        res.status(StatusCodes.OK).json(cartItems)
    }
    catch(error){
        console.log(`Error in getCartProducts controller ${error.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
} 

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find( item => item.product.toString() === productId.toString() )
        if(existingItem){
            existingItem.quantity+=1;
        }
        else{
            user.cartItems.push({ product: productId })
        }
        await user.save()
        res.status(StatusCodes.OK).json(user.cartItems)

    } catch (error) {
        console.log(`Error in addToCart controller ${error.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message})        
    }
}

export const removeAllFromCart = async (req, res) => {
    try{
        const { productId } = req.body;
        const user = req.user;
        if(!productId){
            user.cartItems = [];
        }
        else{
            user.cartItems = user.cartItems.filter((item)=> item.product.toString() !== productId.toString());
        }
        await user.save();
        res.status(StatusCodes.OK).json(user.cartItems)
    }
    catch(error){
        console.log(`Error in addToCart controller ${error.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message}) 
    }
}

export const updateQuantity = async ( req, res ) => {
    try{
        const { id: productId } = req.params
        const { quantity } = req.body
        const user = req.user;
        const existingItem = user.cartItems.find((item) => item.product.toString() === productId)

        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId )
                await user.save();
                res.status(StatusCodes.OK).json(user.cartItems)
            }
            existingItem.quantity = quantity;
            await user.save();
            res.status(StatusCodes.OK).json(user.cartItems)
        }
        else{
            res.status(StatusCodes.NOT_FOUND).json(`product not found: ${productId}`)
        }
    }
    catch(error){
        console.log(`Error in addToCart controller ${error.message}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
}
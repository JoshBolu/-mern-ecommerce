import { StatusCodes } from "http-status-codes";
import Coupon from "../model/coupon.model.js";

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.find({ userId: req.user._id, isActive: true});
        if(!coupon) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No coupon found" });
        }
        return res.status(StatusCodes.OK).json({ coupon });
    } catch (error) {
        console.error(`Error in getCoupon controller ${error.message}`)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });        
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code, isActive: true, userId: req.user._id })
        if(!coupon){
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Coupon not found" });
        }

        if(coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Coupon has expired" });
        }   

        return res.status(StatusCodes.OK).json({ 
            message: `Coupon is valid: ${coupon.code}`,
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        })
    } 
    catch (error) {
        console.error(`Error in validatecoupon controller: ${error.message}`)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
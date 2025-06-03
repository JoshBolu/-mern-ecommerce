import { StatusCodes } from 'http-status-codes';
import Coupon from '../model/coupon.model.js';
import { stripe } from '../lib/stripe.js';
import Order from '../model/order.model.js';
import User from '../model/user.model.js';

async function createStripeCoupon(discountPercentage){
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: 'once',
    });
    return coupon.id;
} 

async function createNewCoupon(userId){
    await Coupon.findOneAndDelete({userId: userId});
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId,
    })

    await newCoupon.save();

    return newCoupon;
}

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or empty products array" });
        }

        let totalAmount = 0;
        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100); // Stripe requires amounts in cents
            totalAmount += amount * product.quantity;
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity,
            };
        });

        let coupon = null;
        if(couponCode){
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true})
            if(coupon){
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon ? [{
                coupon: await createStripeCoupon(coupon.discountPercentage),
            }]
            : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode? couponCode : "",
                products: JSON.stringify(products.map((product) => {
                    return{
                        id: product._id,
                        quantity: product.quantity,
                        price: product.price
                    }
                })),
                
            },
        });

        // checks if the total amount is greater than $200 and if so, creates a new coupon
        if(totalAmount > 20000){
            await createNewCoupon(req.user._id);
        }
        res.status(StatusCodes.OK).json({ id: session.id, totalAmount: totalAmount / 100 }); // Convert to dollars for the response
    } 
    catch (error) {
        console.error(`Error creating checkout session: ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

export const checkoutSuccess = async (req, res) => {
    try{
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status === "paid"){

            if(session.metadata.couponCode){
                await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId
                }, {
                    isActive: false
                })
            }
        }

        // create a new order in the database
        const products = JSON.parse(session.metadata.products);
        const newOrder = new Order({
            userId: session.metadata.userId,
            products: products.map((product) => {
                return {
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price
                }
            }),
            totalAmount: session.amount_total / 100, // Convert to dollars
            stripeSessionId: sessionId,
        })
        await newOrder.save();

        // clearCart in the database
        await User.findByIdAndUpdate(session.metadata.userId, {
          cartItems: [],
        });

        
        res.status(StatusCodes.OK).json({ message: "Payment succesfull, order created, and coupon deactivated if used.", orderId: newOrder._id });
    }
    catch(error){
        console.error(`Error in checkout success: ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../../lib/axios";

const stripePromise = loadStripe(
  "pk_test_51REuL72fyYh7GaFgmA14ngi3QvxvlqHEMPmg2AJk2W4xFgMQqdQAlOtIsriPmN4zmNGdHUPIVlkUadlLgtmikOMf00l5LBZxAI"
);

const OrderSummary = () => {
  const { total, subTotal, coupon, isCouponApplied, cart } = useCartStore();
  const savings = subTotal - total;
  console.log({total, subTotal, savings});
  const formattedTotal = total.toLocaleString() + ".00";
  const formattedsubTotal = subTotal.toLocaleString() + ".00";
  const formattedSavings = savings.toLocaleString() + ".00";

  const handleStripePayment = async () => {
    const stripe = await stripePromise;

    try {
      const response = await axios.post("/payment/create-checkout-session", {
        products: cart,
        couponCode: coupon && isCouponApplied ? coupon.code : null,
      });
      const session = response.data;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      })      
      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.log("Error creating checkout session:", error);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order Summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-basse font-normal text-gray-300">
              Original Price
            </dt>
            <dt className="text-base font-medium text-white">
              ${formattedsubTotal}
            </dt>
          </dl>
          {savings != 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dt className="text-base font-medium text-white">
                ${formattedSavings}
              </dt>
            </dl>
          )}
          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-basse font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dt className="text-base font-bold text-emerald-400">
              ${formattedTotal}
            </dt>
          </dl>
        </div>

        <motion.button
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStripePayment}
        >
          Proceed to Checkout
        </motion.button>

        <p className="text-center text-gray-400 text-sm group">
          or{" "}
          <Link
            to={"/"}
            className="font-medium text-emerald-600 underline group-hover:text-emerald-400"
          >
            Continue Shopping <MoveRight className="w-4 inline-block" />
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default OrderSummary;

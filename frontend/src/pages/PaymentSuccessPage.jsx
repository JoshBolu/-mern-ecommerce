import { ArrowRight, CheckCircle, CircleAlert, CircleAlertIcon, CircleX, Delete, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../../lib/axios";
import LoadingSpinner from "../components/LoadingSpiner";
import Confetti from "react-confetti";

const ErrorPage = ({error}) => {
    return(
      <div className="h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10 p-8 text-center">
          <div className="flex justify-center mb-4">
            <CircleX className="text-red-400" size={30} />
          </div>
          <h1 className="text-2xl font-bold text-red-400 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link
            to="/"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
}

const PaymentSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useCartStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        await axios.post("/payment/checkout-success", { sessionId });
        clearCart();
      } catch (error) {
        console.error("Error processing checkout success:", error);
      } finally {
        setIsProcessing(false);
      }
    };
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setIsProcessing(false);
      setError("No session ID found in the URL.");
    }
  }, [clearCart]);

  

  if (isProcessing) return <LoadingSpinner />;
  if (error) return  <ErrorPage error={error} />

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.6}
        style={{ zIndex: 99 }}
        numberOfPieces={200}
        recycle={false}
      />
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
            Purchase Succesful!
          </h1>
          <p className="text-gray-300 text-center mb-2">
            Thank you for your order. we're processing it now.
          </p>
          <p className="text-emerald-400 text-center text-sm mb-6">
            Check your email f0r order details and updates.
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Order Number</span>
              <span className="text-sm font-semibold text-emerald-400">
                #123456
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Estimated delivery</span>
              <span className="text-sm font-semibold text-emerald-400">
                3-5 business days
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center">
              <HandHeart className="mr-2" size={18} /> Thanks for trusting us!
            </button>
            <Link
              to="/"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center"
            >
              Continue Shopping <ArrowRight className="ml-2" size={18} />{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
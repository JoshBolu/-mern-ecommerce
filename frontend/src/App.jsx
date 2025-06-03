import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpiner";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminDashBoardPage from "./pages/AdminDashBoardPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  useEffect(() => {
    if(!user) return;
    getCartItems()
  }, [getCartItems, user])
  
  if(checkingAuth) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,125,0.3),rgba(10,80,60,0.2),rgba(0,0,0,0.1)_100%)]"></div>
        </div>
      </div>

      <div className="relative pt-16 z-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signUp" element={!user? <SignUpPage /> : <Navigate to='/' />} />
          <Route path="/login" element={!user? <LoginPage /> : <Navigate to='/' />} />
          {/* <Route path="/adminDashboard" element={<AdminDashBoardPage/>} /> */}
          <Route path="/adminDashboard" element={user && user.role === "admin"? <AdminDashBoardPage/> : <Navigate to='/login' />}  />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={user? <CartPage />: <Navigate to="/login" />} />
          <Route path="/success" element={user? <PaymentSuccessPage/>: <Navigate to='/' /> } />
          <Route path="/purchase-cancel" element={user? <PaymentCancelPage/>: <Navigate to='/' /> } />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
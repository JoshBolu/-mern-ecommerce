import dotenv from "dotenv";
import path from "path"
dotenv.config();

import express from "express";
const app = express();

import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

import { protectRoute } from "./middleware/auth.middleware.js";

// import extra security packages
import helmet from "helmet"; // helps secure Express apps by setting various HTTP headers
import rateLimiter from "express-rate-limit"; // helps limit the number of requests to your API to prevent DDoS attacks
import cors from "cors"; // helps enable Cross-Origin Resource Sharing (CORS) for your API

// routes
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

// import error
import { notFound } from "./middleware/notFound.middleware.js";

app.set('trust proxy', 1); // trust first proxy
app.use(rateLimiter({
  windowMs: 15*60*1000, //15 minutes, default is in milliseconds
  max: 200, // limit each IP to 100 requests per windowMs
}))
app.use(helmet())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // allow credentials (cookies) to be sent with requests
}))

const __dirname = path.resolve();

app.use(express.json( {limit: "10mb"} )); //allows you to parse body of a request
app.use(cookieParser()); // allows you to parse cookies from the request

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/cart', protectRoute, cartRoutes)
app.use('/api/v1/coupon', protectRoute, couponRoutes)
app.use('/api/v1/payment', protectRoute, paymentRoutes)
app.use('/api/v1/analytics', protectRoute, analyticsRoutes) 

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "frontend/dist")))

  app.get("/*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  })
}

app.use(notFound)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    connectDB()
    console.log(`Server is running on http:localhost://${PORT}`)    
})
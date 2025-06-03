import express from "express";

const router = express.Router();

import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";

router.get("/", getCartProducts)
router.post("/", addToCart)
router.delete("/", removeAllFromCart)
router.put("/:id", updateQuantity)

export default router
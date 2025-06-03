import express from "express";
import { createCheckoutSession, checkoutSuccess } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/checkout-success", checkoutSuccess);

export default router
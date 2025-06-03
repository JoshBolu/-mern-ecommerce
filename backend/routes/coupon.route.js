import express from "express";

import { validateCoupon, getCoupon } from "../controllers/coupon.controller.js";
const router = express.Router();

router.get("/", getCoupon);
router.post("/validate", validateCoupon);

export default router;
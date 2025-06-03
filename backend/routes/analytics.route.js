import express from "express";
import { adminRoute } from "../middleware/auth.middleware.js";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { get } from "mongoose";

const router = express.Router();

router.get("/", adminRoute,  getAnalytics);
// router.get("/orders", adminRoute, getOrdersAnalytics);

export default router;
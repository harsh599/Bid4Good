import express from "express";
import * as orderItemCont from "../controllers/orderItemCont";
const router = express.Router();

// POST /api/v1/sell/
router.post("/saveOrder", orderItemCont.addOrder);
router.get("/getOrder", orderItemCont.getOrder);
export const orderRoutes = router;

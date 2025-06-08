import express from "express";
import { getAllProduct } from "../services/productServices";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await getAllProduct();
    res.status(200).json(products);
  } catch {
    res.status(500).json("Something want wrong!");
  }
});

export default router;

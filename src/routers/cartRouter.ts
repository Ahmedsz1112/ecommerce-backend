import express from "express";
import {
  addItemToCart,
  checkout,
  clearCart,
  deleteitemToCart,
  getActiveCartForUser,
  updateitemsToCart,
} from "../services/cartServices";
import validateJWT from "../middleware/validateJWT";
import { ExtendRequest } from "../types/request";

const router = express.Router();

router.get("/", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const cart = await getActiveCartForUser({ userId , populateProduct: true });
    res.status(200).json(cart);
  } catch (err){
    console.error("Error in GET /cart:", err);
    res.status(500).json("Something want wrong!");
  }
});

router.delete("/", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { data, statusCode } = await clearCart({ userId });
    res.status(statusCode).json(data);
  } catch {
    res.status(500).json("Something went wrong!");
  }
});

router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const { data, statusCode } = await addItemToCart({
      userId,
      productId,
      quantity,
    });
    res.status(statusCode).json(data);
  } catch {
    res.status(500).json("Something went wrong!");
  }
});

router.put("/items", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const { data, statusCode } = await updateitemsToCart({
      userId,
      productId,
      quantity,
    });
    res.status(statusCode).json(data);
  } catch {
    res.status(500).json("Something went wrong!");
  }
});

router.delete(
  "/items/:productId",
  validateJWT,
  async (req: ExtendRequest, res) => {
    try {
      const userId = req.user._id;
      const { productId } = req.params;
      const { data, statusCode } = await deleteitemToCart({
        userId,
        productId,
      });
      res.status(statusCode).json(data);
    } catch {
      res.status(500).json("Something went wrong!");
    }
  }
);

router.post("/checkout", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;
    const { data, statusCode } = await checkout({ userId, address });
    res.status(statusCode).json(data);
  } catch {
    res.status(500).json("Something went wrong!");
  }
});

export default router;

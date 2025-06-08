import express from "express";
import { getMyOrders, login, register } from "../services/userServices";
import validateJWT from "../middleware/validateJWT";
import { ExtendRequest } from "../types/request";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { statusCode, data } = await register({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(statusCode).json(data);
  } catch {
    res.status(500).json("Something want wrong!");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { statusCode, data } = await login({ email, password });
    res.status(statusCode).json(data);
  } catch {
    res.status(500).json("Something want wrong!");
  }
});

router.get("/my-order", validateJWT  , async(req:ExtendRequest , res) => {
  try {
      const userId = req.user._id;
      const {data, statusCode} = await getMyOrders({ userId });
      res.status(statusCode).json(data);
    } catch {
      res.status(500).json("Something want wrong!");
    }
})

export default router;

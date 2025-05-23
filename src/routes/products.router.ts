import express from "express";
import productController from "../controllers/product.controller";

const router = express.Router();

router.post("/", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/free/trial", productController.getFreeTrialProduct);
export default router;

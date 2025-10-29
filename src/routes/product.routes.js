const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');


router.post("/product", authMiddleware, productController.createProduct);
router.get("/products", authMiddleware, productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
router.put("/product/:id", authMiddleware, productController.updateProduct);
router.delete("/product/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
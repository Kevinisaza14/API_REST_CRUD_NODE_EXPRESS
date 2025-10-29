const express = require('express');
const router = express.Router();
const shoppingcart = require('../controllers/shoppingcart.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');


router.post("/shoppingcart", authMiddleware, shoppingcart.createShoppingCart);
router.get("/shoppingcart", authMiddleware, shoppingcart.getAllShoppingCart);
// router.get("/product/:id", productController.getProductById);
router.put("/shoppingcart", authMiddleware, shoppingcart.updateShoppingCart);
// router.delete("/product/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
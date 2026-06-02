const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct} = require("../controller/product.controller");

router.post("/", protect, upload.single("image"),createProduct);
router.post("/getallproducts",getAllProducts);
router.get("/:id",getProductById);
router.put("/update-product/:id", protect, upload.single("image"), updateProduct);
router.delete("/delete-product/:id", protect, deleteProduct);

module.exports = router;
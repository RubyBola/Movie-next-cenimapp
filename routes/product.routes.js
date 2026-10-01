const express = require("express");
const router = express.Router();
const adminProtect= require("../middleware/admin");
const upload = require("../middleware/upload");
const { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct} = require("../controller/product.controller");

router.post("/", adminProtect, upload.single("image"),createProduct);
router.get("/getallproducts", adminProtect, getAllProducts);
router.get("/:id", adminProtect, getProductById);
router.put("/update-product/:id", adminProtect, upload.single("image"), updateProduct);
router.delete("/delete-product/:id", adminProtect, deleteProduct);

module.exports = router;
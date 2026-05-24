const Product = require("../model/product");
const user = require("../model/usermodel");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");


// const createProduct = async (req, res) => {

//     try {

//         const {
//             name,
//             price,
//             description
//         } = req.body;

//         // Upload image to cloudinary
//         const result =
//             await cloudinary.uploader.upload(
//                 req.file.path
//             );

//         const product =
//             await Product.create({

//                 name,

//                 price,

//                 description,

//                 image: result.secure_url,

//                 user: req.user.id
//             });

//         res.status(201).json({

//             message:
//                 "Product created successfully",

//             product
//         });

//     } catch (error) {

//         res.status(500).json({
//             error: error.message
//         });
//     }
// };

// Create a new product

const createProduct = async (req, res) => {

    console.log(req.body);
    console.log(req.file);

    try {

        // Check image upload first
        if (!req.file) {

            return res.status(400).json({
                message: "Please upload an image"
            });
        }

        const {
            name,
            price,
            description
        } = req.body;

        // Validate fields
        if (!name || !price) {

            return res.status(400).json({
                message:
                    "Name and price are required"
            });
        }

        // Upload image to cloudinary
        const result =
            await cloudinary.uploader.upload(
                req.file.path
            );

        // Create product
        const product =
            await Product.create({

                name,

                price,

                description,

                image: result.secure_url,

                user: req.user._id
            });

        res.status(201).json({

            message:
                "Product created successfully",

            product
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const product = await Product.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update product stock
const updateProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        
        if (stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "Stock quantity is required"
            });
        }
        
        const product = await Product.findByIdAndUpdate(
            id,
            { stock },
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.json({
            success: true,
            message: "Product stock updated",
            product
        });
    } catch (error) {
        console.error("Update stock error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
module.exports = { createProduct,getAllProducts, getProductById, updateProduct,deleteProduct, updateProductStock};
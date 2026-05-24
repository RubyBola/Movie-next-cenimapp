const mongoose = require("mongoose");
const Product = require("../model/product");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String
    },

    image: {
        type: String
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

module.exports =
   mongoose.model("Product", productSchema);
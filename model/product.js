const mongoose = require("mongoose");
const Product = require("../model/product");

const productSchema = new mongoose.Schema(
  {
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
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    }
  },
  {
    timestamps: true
  }
);
module.exports =
   mongoose.model("Product", productSchema);
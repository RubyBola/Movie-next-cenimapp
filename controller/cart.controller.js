const Cart = require("../model/cart");
const mongoose = require("mongoose");
const Product = require("../model/product");
const User = require("../model/usermodel");
const admin = require("../model/admin");
const jwt = require("jsonwebtoken");
const movie = require("../model/movie");

const addToCart = async (req, res) => {

    try {

        const {
            movie,
            seats,
            products,   
            bookingDate,
            showtime
        } = req.body;

        let cart =
            await Cart.findOne({
                user: req.user.id
            });

        // Create cart if none exists
        if (!cart) {

            cart = await Cart.create({

                user: req.user.id,

                movie,

                seats,

                products,

                bookingDate,

                showtime
            });

        } else {

            // Update existing cart
            cart.movie = movie;

            cart.seats = seats;

            cart.products = products;

            cart.bookingDate = bookingDate;

            cart.showtime = showtime;   

            await cart.save();
        }

        res.status(200).json({

            message:
               "Cart updated successfully",

            cart
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = { addToCart};
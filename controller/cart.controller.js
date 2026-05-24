const Cart = require("../model/cart");

const addToCart = async (req, res) => {

    try {

        const {
            movie,
            seats,
            products
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

                products
            });

        } else {

            // Update existing cart
            cart.movie = movie;

            cart.seats = seats;

            cart.products = products;

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
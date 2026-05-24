const Cart = require("../model/cart");

const Booking = require("../model/booking");

const Movie = require("../model/movie");

const Product = require("../model/product");

const checkout = async (req, res) => {

    try {

        // Find user's cart
        const cart = await Cart.findOne({

            user: req.user.id

        });

        // Check if cart exists
        if (!cart) {

            return res.status(404).json({
                message: "Cart is empty"
            });
        }

        // Find movie
        const foundMovie =
            await Movie.findById(cart.movie);

        if (!foundMovie) {

            return res.status(404).json({
                message: "Movie not found"
            });
        }

        // Movie ticket total
        const movieTotal =
            foundMovie.price *
            cart.seats.length;

        // Product total
        let snacksTotal = 0;

        for (const item of cart.products) {

            const foundProduct =
                await Product.findById(
                    item.product
                );

            if (foundProduct) {

                snacksTotal +=
                    foundProduct.price *
                    item.quantity;
            }
        }

        // Final total
        const totalPrice =
            movieTotal + snacksTotal;

        // Generate booking reference
        const bookingReference =
            "CIN" +
            Date.now() +
            Math.floor(Math.random() * 1000);

        // Create booking
        const booking =
            await Booking.create({

                bookingReference,

                user: req.user.id,

                movie: cart.movie,

                seats: cart.seats,

                products: cart.products,

                totalPrice,

                paymentMethod: "cash,card, paystack, paypal",

                paymentStatus: "completed",
            });

        // Clear cart
        await Cart.deleteOne({

            user: req.user.id
        });

        res.status(201).json({

            message:
               "Checkout successful 🎉",

            booking
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {checkout};
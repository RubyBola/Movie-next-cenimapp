const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    },

    showtime: {
        type: String
    },

    bookingDate: {
        type: Date
    },

    seats: [
        {
            row: Number,
            number: Number,
            seatNumber: String
        }
    ],

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            quantity: {
                type: Number,
                default: 1
            }
        }
    ]

}, {
    timestamps: true
});
module.exports =  mongoose.model("Cart", cartSchema);
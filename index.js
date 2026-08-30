const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const connectDb = require('./config/db');

const app = express();
const port = 5009;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const bookingRoutes = require('./routes/booking.routes');
const productRoutes = require('./routes/product.routes');
const checkoutRoutes = require('./routes/checkout.routes');
const cartRoutes = require('./routes/cart.routes');

app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/product', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/cart', cartRoutes);

console.log("SERVER STARTED !!!");

const startServer = async () => {
    try {
        await connectDb();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
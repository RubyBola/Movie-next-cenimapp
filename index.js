const express = require('express')
const app = express()
const dotenv = require("dotenv");
const port = 5009

dotenv.config();


const connectDb = require('./config/db')
connectDb();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const userRoutes = require('./routes/user.routes')
const adminRoutes = require('./routes/admin.routes')
const bookingRoutes = require('./routes/booking.routes')

app.use('/api', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/booking', bookingRoutes)

// app.get('/', (req, res) => {
//     res.json({ message: "Welcome to our first API call" })
// })

console.log("🚀 SERVER FILE CHANGED!!!");

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
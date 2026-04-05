const express = require('express')
const app = express()
const dotenv = require("dotenv");
const port = 5001

dotenv.config();


const connectDb = require('./config/db')
connectDb();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const userRoutes = require('./routes/user.routes')

app.use('/users', userRoutes)

app.get('/', (req, res) => {
    res.json({ message: "Welcome to our first API call" })
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
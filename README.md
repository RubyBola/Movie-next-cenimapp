# 🎬 Movie Nest Cinema API

A RESTful backend API for a cinema/movie booking platform built with **Node.js, Express.js, MongoDB, and Mongoose**.

Movie Nest Cinema provides APIs for user authentication, email verification, password recovery, movie management, cinema bookings, seat availability, food/product management, cart management, checkout, admin management, image uploads, and email notifications.

---

## 🚀 Features

### 👤 User Management

* User registration
* User login
* Email verification with OTP
* User profile updates
* Password updates
* Profile image upload
* Forgot password
* Reset password
* JWT authentication

### 🎬 Movie Management

* View active movies
* View individual movie details
* Admin view of all movies
* Admin add movies
* Admin update movies
* Admin delete movies

### 🎟️ Booking Management

* Create movie bookings
* View logged-in user's bookings
* Cancel bookings
* Check booked seats
* Automatic booking reference generation
* Movie ticket price calculation

### 🛒 Cart Management

* Add movie, seats, products, showtime, and booking date to cart
* Update an existing user's cart

### 💳 Checkout

* Checkout directly from the user's cart
* Calculate movie ticket total
* Calculate food/product total
* Generate booking reference
* Create completed booking
* Clear cart after successful checkout

### 🍿 Product Management

* Create products with images
* Upload product images
* Get all products
* Get a product by ID
* Update products
* Delete products

### 👨‍💼 Admin Management

* Admin registration
* Admin email verification
* Admin login
* Admin-only movie management
* View all bookings
* Dashboard statistics

### 📧 Email

* Gmail SMTP integration using Nodemailer
* User verification emails
* Admin verification emails
* Password reset emails
* Password reset confirmation emails

### ☁️ Cloudinary

* Cloudinary configuration
* Image upload support
* Cloudinary connection test endpoint

---

# 🛠️ Tech Stack

| Technology | Purpose                       |
| ---------- | ----------------------------- |
| Node.js    | JavaScript runtime            |
| Express.js | REST API framework            |
| MongoDB    | Database                      |
| Mongoose   | MongoDB ODM                   |
| JWT        | Authentication                |
| bcryptjs   | Password hashing              |
| Nodemailer | Email service                 |
| Cloudinary | Image storage                 |
| Multer     | File upload handling          |
| dotenv     | Environment variables         |
| CORS       | Cross-Origin Resource Sharing |
| Nodemon    | Development server            |

---

# 📦 Installation

## 1. Clone the repository

```bash
git clone <your-github-repository-url>
```

## 2. Navigate into the project

```bash
cd movie-nest-cinema
```

## 3. Install dependencies

```bash
npm install
```

## 4. Create a `.env` file

Create a `.env` file in the root directory.

Example:

```env
PORT=5009

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Never commit your `.env` file to GitHub.

Add the following to `.gitignore`:

```text
node_modules/
.env
```

---

# ▶️ Running the Application

## Development

```bash
npm run dev
```

This runs:

```bash
nodemon index.js
```

## Production

```bash
npm start
```

This runs:

```bash
node index.js
```

The API runs on:

```text
http://localhost:5009
```

---

# 🔐 Authentication

Protected endpoints require a JWT access token.

After login, copy the returned token and send it using the `Authorization` header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

```http
GET /api/booking/getUserBookings
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

---

# 👤 User API

Base URL:

```text
/api
```

## Register

```http
POST /api/signup
```

### Request body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "message": "User created. Check email for OTP."
}
```

---

## Login

```http
POST /api/login
```

### Request body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Successful response

```json
{
  "message": "User logged in successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

---

## Verify Email

```http
POST /api/verify-email
```

### Request body

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Response

```json
{
  "message": "Email verified successfully"
}
```

---

## Update User

```http
PUT /api/update-user/:id
```

### Request body

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "johnsmith@example.com"
}
```

---

## Update Password

```http
PUT /api/update-password/:id
```

### Request body

```json
{
  "password": "newPassword123"
}
```

---

## Upload Profile Picture

```http
POST /api/upload-pic
```

Authentication required.

Use:

```text
multipart/form-data
```

with:

```text
image = <image file>
```

---

## Fetch User

The route is currently registered as:

```http
GET /api/, protect
```

⚠️ **Implementation issue:** the route definition currently contains `"/, protect"` instead of separating the path and middleware.

It should likely be:

```js
router.get("/", protect, fetchUser);
```

---

## Forgot Password

```http
POST /api/forgot-password
```

### Request body

```json
{
  "email": "john@example.com"
}
```

A password reset code is sent to the user's email.

---

## Reset Password

```http
POST /api/reset-password
```

### Request body

```json
{
  "token": "RESET_TOKEN",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

---

# 🎬 Movie API

## User: Get Active Movies

```http
GET /api/booking/getmovie/:id
```

Authentication required for the currently registered route.

> The controller also contains `getMovies`, which returns active movies, but the supplied `booking.routes.js` does not currently register a normal user route for `getMovies`.

---

## Get Movie By ID

```http
GET /api/booking/getmovie/:id
```

Authentication required.

### Example

```text
GET /api/booking/getmovie/65f123456789abcdef123456
```

### Response

```json
{
  "success": true,
  "movie": {
    "_id": "MOVIE_ID",
    "title": "Example Movie",
    "genre": "Action",
    "duration": "2h 10m",
    "rating": "8",
    "language": "English",
    "showtimes": [
      "10:00 AM",
      "2:00 PM",
      "6:00 PM"
    ],
    "price": 5000,
    "isActive": true
  }
}
```

---

# 🎟️ Booking API

Base URL:

```text
/api/booking
```

All booking endpoints require authentication.

---

## Create Booking

```http
POST /api/booking
```

### Request body

```json
{
  "movie": "MOVIE_ID",
  "products": [
    {
      "product": "PRODUCT_ID",
      "quantity": 2
    }
  ],
  "showtime": "6:00 PM",
  "bookingDate": "2026-08-30",
  "seats": [
    {
      "row": 1,
      "number": 5,
      "seatNumber": "A5"
    },
    {
      "row": 1,
      "number": 6,
      "seatNumber": "A6"
    }
  ],
  "paymentMethod": "card"
}
```

### Response

```json
{
  "message": "Booking successful 🎉",
  "booking": {
    "bookingReference": "CIN...",
    "user": "USER_ID",
    "movie": "MOVIE_ID",
    "showtime": "6:00 PM",
    "bookingDate": "2026-08-30",
    "seats": [],
    "totalPrice": 10000,
    "paymentMethod": "card"
  }
}
```

The movie ticket total is calculated using:

```text
movie price × number of seats
```

---

## Get User Bookings

```http
GET /api/booking/getUserBookings
```

### Response

```json
{
  "message": "Bookings fetched successfully",
  "totalBookings": 1,
  "bookings": []
}
```

Bookings are populated with movie information and sorted with the newest booking first.

---

## Cancel Booking

```http
DELETE /api/booking/cancel-Booking/:id
```

The booking must belong to the authenticated user.

### Response

```json
{
  "message": "Booking cancelled successfully",
  "booking": {}
}
```

---

## Get Booked Seats

```http
GET /api/booking/getbookedseats/:movieId
```

### Response

```json
{
  "message": "Booked seats fetched successfully",
  "totalBookedSeats": 2,
  "bookedSeats": [
    "A5",
    "A6"
  ]
}
```

---

# 🛒 Cart API

Base URL:

```text
/api/cart
```

Authentication required.

## Add / Update Cart

```http
POST /api/cart
```

### Request body

```json
{
  "movie": "MOVIE_ID",
  "seats": [
    {
      "row": 1,
      "number": 5,
      "seatNumber": "A5"
    }
  ],
  "products": [
    {
      "product": "PRODUCT_ID",
      "quantity": 2
    }
  ],
  "bookingDate": "2026-08-30",
  "showtime": "6:00 PM"
}
```

### Response

```json
{
  "message": "Cart updated successfully",
  "cart": {}
}
```

If the user does not already have a cart, a new cart is created.

If the user already has one, the existing cart is updated.

---

# 💳 Checkout API

Base URL:

```text
/api/checkout
```

Authentication required.

## Checkout

```http
POST /api/checkout
```

### Request body

```json
{
  "paymentMethod": "card"
}
```

The checkout process:

1. Finds the user's cart.
2. Finds the selected movie.
3. Calculates movie ticket total.
4. Calculates product/snack total.
5. Calculates the final price.
6. Generates a booking reference.
7. Creates the booking.
8. Marks payment status as completed.
9. Deletes the user's cart.

### Successful response

```json
{
  "message": "Checkout successful 🎉",
  "booking": {}
}
```

---

# 🍿 Product API

Base URL:

```text
/api/product
```

Authentication is required for the currently registered product routes.

---

## Create Product

```http
POST /api/product
```

Use:

```text
multipart/form-data
```

Fields:

```text
name
price
description
image
```

Example:

```text
name = Popcorn
price = 2000
description = Large cinema popcorn
image = popcorn.jpg
```

The uploaded image is sent to Cloudinary and the resulting secure URL is saved with the product.

### Response

```json
{
  "message": "Product created successfully",
  "product": {}
}
```

---

## Get All Products

```http
POST /api/product/getallproducts
```

### Response

```json
{
  "success": true,
  "count": 2,
  "products": []
}
```

---

## Get Product By ID

```http
GET /api/product/:id
```

### Example

```text
GET /api/product/65f123456789abcdef123456
```

---

## Update Product

```http
PUT /api/product/update-product/:id
```

Authentication required.

Optional fields include:

```json
{
  "name": "Large Popcorn",
  "price": 2500,
  "description": "Large cinema popcorn"
}
```

An image upload can also be supplied through the `image` field.

---

## Delete Product

```http
DELETE /api/product/delete-product/:id
```

### Response

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

# 👨‍💼 Admin API

Base URL:

```text
/api/admin
```

Admin-protected routes require a valid admin JWT.

---

## Admin Signup

```http
POST /api/admin/signup
```

### Request body

```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "message": "Admin created. Check your email for OTP."
}
```

---

## Verify Admin Email

```http
POST /api/admin/verify-Email
```

### Request body

```json
{
  "email": "admin@example.com",
  "otp": "123456"
}
```

---

## Admin Login

```http
POST /api/admin/login
```

### Request body

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "message": "Login successful",
  "otp": "JWT_TOKEN",
  "admin": {
    "id": "ADMIN_ID",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

> The property containing the JWT is currently named `otp` in the implementation, although it is actually a JWT token.

Use that JWT as:

```http
Authorization: Bearer JWT_TOKEN
```

---

# 🎬 Admin Movie Management

All endpoints in this section require admin authentication.

---

## Get All Movies

```http
GET /api/admin/getallmovies
```

### Response

```json
{
  "success": true,
  "movies": []
}
```

---

## Get Movies

```http
GET /api/admin/getmovies
```

This route uses the `getMovies` controller from the booking controller and returns active movies.

---

## Add Movie

```http
POST /api/admin/addmovies
```

### Request body

```json
{
  "title": "Example Movie",
  "genre": "Action",
  "duration": "2h 10m",
  "rating": "8",
  "price": 5000,
  "language": "English",
  "showtimes": "10:00 AM, 2:00 PM, 6:00 PM"
}
```

The `showtimes` string is converted into an array.

---

## Update Movie

```http
PUT /api/admin/updatemovies/:id
```

Example:

```json
{
  "title": "Updated Movie",
  "price": 5500,
  "showtimes": "12:00 PM, 4:00 PM, 8:00 PM"
}
```

---

## Delete Movie

```http
DELETE /api/admin/deletemovie/:id
```

When a movie is deleted, bookings associated with that movie are also deleted.

---

# 📊 Admin Dashboard

## Get All Bookings

```http
GET /api/admin/getallbookings
```

Returns bookings together with booking statistics.

Example:

```json
{
  "success": true,
  "bookings": [],
  "stats": {
    "totalBookings": 10,
    "totalRevenue": 50000
  }
}
```

---

## Get Dashboard Statistics

```http
GET /api/admin/getDashboard
```

Returns:

* Total movies
* Total bookings
* Total users
* Total revenue

Example:

```json
{
  "success": true,
  "dashboard": {
    "totalMovies": 10,
    "totalBookings": 25,
    "totalUsers": 5,
    "totalRevenue": 125000
  }
}
```

---

# ☁️ Cloudinary

The project includes Cloudinary integration for image handling.

## Test Cloudinary Connection

```http
GET /api/test-cloudinary
```

### Successful response

```json
{
  "status": "Cloudinary connected ✅"
}
```

### Failed response

```json
{
  "status": "Cloudinary failed ❌",
  "error": "..."
}
```

---

# 📤 General Upload Test

The user routes also contain:

```http
POST /api/upload
```

This endpoint accepts an image using:

```text
multipart/form-data
```

Field:

```text
image
```

### Successful response

```json
{
  "message": "Upload successful",
  "image": {}
}
```

---

# 🗄️ Database Models

The application currently uses the following Mongoose models:

### User

Stores:

* First name
* Last name
* Email
* Password
* Account number
* Reset token
* Verification code
* Verification status

Passwords are hashed using `bcryptjs` before being saved.

### Admin

Stores:

* First name
* Last name
* Email
* Password
* Role
* Verification code
* Verification expiry
* Verification status
* Created date

### Movie

Stores:

* Title
* Genre
* Duration
* Rating
* Language
* Showtimes
* Price
* Release date
* Active status
* Admin/user creator reference
* Created/updated timestamps

### Booking

Stores:

* User
* Movie
* Products
* Showtime
* Booking date
* Seats
* Total price
* Payment method
* Booking status
* Booking reference
* Created/updated timestamps

### Cart

Stores:

* User
* Movie
* Showtime
* Booking date
* Seats
* Products
* Created/updated timestamps

### Product

Stores:

* Name
* Price
* Image
* User reference
* Created/updated timestamps

---

# 💰 Payment Methods

The Booking model currently supports:

```text
card
cash
paystack
paypal
```

The checkout controller currently creates the booking and sets:

```text
paymentStatus = completed
```

This implementation does not yet show an actual Paystack, PayPal, or card payment gateway transaction.

---

# 🔒 Security

The API uses:

* JWT authentication
* Password hashing with bcryptjs
* Protected user routes
* Admin authorization middleware
* Environment variables for secrets
* MongoDB authentication
* File upload handling

Protected requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 📁 Project Structure

Based on the supplied source code, the project is organized approximately as follows:

```text
movie-nest-cinema/
│
├── config/
│   ├── db.js
│   └── cloudinary.js
│
├── controller/
│   ├── admin.controller.js
│   ├── booking.controller.js
│   ├── cart.controller.js
│   ├── checkout.controller.js
│   ├── product.controller.js
│   ├── signup.controller.js
│   └── verifyEmail.controller.js
│
├── middleware/
│   ├── admin.js
│   ├── auth.js
│   └── upload.js
│
├── model/
│   ├── admin.js
│   ├── booking.js
│   ├── cart.js
│   ├── movie.js
│   ├── product.js
│   └── usermodel.js
│
├── routes/
│   ├── admin.routes.js
│   ├── booking.routes.js
│   ├── cart.routes.js
│   ├── checkout.routes.js
│   ├── product.routes.js
│   └── user.routes.js
│
├── utils/
│   ├── code.js
│   └── sendEmail.js
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

---

# 📜 Available Scripts

### Start production server

```bash
npm start
```

### Start development server

```bash
npm run dev
```

### Test

```bash
npm test
```

The current test script is the default placeholder and does not contain automated tests yet.

---

# ⚠️ Current Implementation Notes

The following items should be reviewed as the project is cleaned up:

### 1. Duplicate login routes

The user routes currently register:

```js
router.post("/login", login)
router.post("/login", loginUser)
```

Both use the same HTTP method and path. Express will encounter the first matching route, so the second route is effectively problematic/redundant.

---

### 2. Incorrect protected user route

The current code contains:

```js
router.get("/, protect", fetchUser)
```

It should likely be:

```js
router.get("/", protect, fetchUser)
```

---

### 3. Admin/user authentication middleware

The `auth.js` middleware currently contains:

```js
admin.findById(...)
```

while the imported model is:

```js
const Admin = require("../model/admin");
```

The lowercase `admin` variable should be corrected to `Admin`.

---

### 4. Movie schema contains duplicate `createdBy`

The Movie schema declares `createdBy` twice.

The second declaration overrides the first, so the schema should be cleaned up to use one `createdBy` field.

---

### 5. Booking date types

The Booking model defines:

```js
bookingDate: String
```

while the Cart model defines:

```js
bookingDate: Date
```

It would be better to use the same type consistently.

---

### 6. Product description

The Product model currently has the `description` field commented out, while the product controller attempts to save:

```js
description
```

If product descriptions are required, the field should be restored to the schema.

---

### 7. Product image storage

The upload middleware currently uses:

```js
multer.diskStorage({})
```

The controller then uploads the temporary file to Cloudinary.

Temporary uploaded files should be managed/removed appropriately after successful Cloudinary upload.

---

### 8. Password update

The `updatePassword` controller assigns:

```js
user.password = password
```

The User schema's `pre("save")` middleware hashes the password, so the password will be hashed when `save()` executes.

---

# 🔮 Future Improvements

Potential improvements for the next version include:

* Add Swagger/OpenAPI documentation
* Add automated tests with Jest or Supertest
* Add request validation
* Add centralized error handling
* Add rate limiting
* Add refresh tokens
* Add real Paystack/PayPal integration
* Add seat conflict prevention
* Add transaction handling during checkout
* Add movie search and filtering
* Add pagination
* Add product stock management route
* Add booking expiration
* Add booking confirmation emails
* Improve Cloudinary file cleanup
* Add role-based authorization to product management
* Improve password-reset token security
* Add API versioning such as `/api/v1`

---

# 👨‍💻 Author

**Bolarinwa Taiwo**

Backend Developer

### Technologies

```text
Node.js
Express.js
MongoDB
Mongoose
JavaScript
JWT
bcryptjs
Nodemailer
Cloudinary
REST API
```

---

## ⭐ Project

**Movie Nest Cinema API**

A backend cinema platform designed to manage users, movies, bookings, seats, cinema products, carts, checkout, and administrative operations.

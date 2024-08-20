const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

const app = express();
dotenv.config();
// MongoDB connection
mongoose
.connect(process.env.MONGO_URL)
.then(()=>console.log("Connected sucessfully to MongoDB"))
.catch((error)=>console.log(error));

// Middlewares

app.use(express.json());
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);  
app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);

// Start the serveur
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

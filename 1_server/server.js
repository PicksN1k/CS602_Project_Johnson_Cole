// File: server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';


const app = express();

const PORT = 3001;

const mongoURL =
  'mongodb://127.0.0.1:27017/cs602_project';


// Middleware
app.use(cors());

app.use(express.json());


// MongoDB connection
await mongoose.connect(mongoURL);

console.log("Connected to MongoDB");


// REST API routes
app.use('/api/products', productRoutes);


// Basic home route
app.get('/', (req, res) => {

  res.json({
    message: "CS602 Shopping Cart API"
  });

});


// Start server
app.listen(PORT, () => {

  console.log(
    `REST Server ready at: http://localhost:${PORT}`
  );

});
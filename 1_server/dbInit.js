// File: dbInit.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { Product, User, Order } from './models/index.js';


const mongoURL = 'mongodb://127.0.0.1:27017/cs602_project';

await mongoose.connect(mongoURL);

console.log("Connected to MongoDB");


// Clear old data

await Order.deleteMany({});
await User.deleteMany({});
await Product.deleteMany({});

console.log("Cleared existing data");


// Products

const products = [

  {
    _id: "P1001",
    name: "Wireless Mouse",
    description: "Wireless optical mouse with USB receiver",
    price: 24.99,
    quantity: 25
  },

  {
    _id: "P1002",
    name: "Mechanical Keyboard",
    description: "Mechanical keyboard with backlit keys",
    price: 79.99,
    quantity: 15
  },

  {
    _id: "P1003",
    name: "USB-C Hub",
    description: "USB-C hub with HDMI and USB ports",
    price: 39.99,
    quantity: 20
  },

  {
    _id: "P1004",
    name: "Laptop Stand",
    description: "Adjustable aluminum laptop stand",
    price: 44.99,
    quantity: 12
  },

  {
    _id: "P1005",
    name: "Webcam",
    description: "1080p webcam with built-in microphone",
    price: 59.99,
    quantity: 18
  },

  {
    _id: "P1006",
    name: "Gaming Headset",
    description: "Over-ear gaming headset with microphone",
    price: 69.99,
    quantity: 10
  },

  {
    _id: "P1007",
    name: "USB Microphone",
    description: "USB condenser microphone for streaming and calls",
    price: 89.99,
    quantity: 8
  },

  {
    _id: "P1008",
    name: "Desk Mat",
    description: "Large desk mat for keyboard and mouse",
    price: 19.99,
    quantity: 30
  }

];

await Product.insertMany(products);

console.log("Inserted", products.length, "products");


// Users

const adminPassword =
  await bcrypt.hash("admin123", 10);

const customerPassword =
  await bcrypt.hash("customer123", 10);


const users = [

  {
    username: "admin",
    password: adminPassword,
    role: "admin"
  },

  {
    username: "customer",
    password: customerPassword,
    role: "customer"
  }

];

await User.insertMany(users);

console.log("Inserted", users.length, "users");

console.log("\nTest Accounts:");
console.log("Admin: admin / admin123");
console.log("Customer: customer / customer123");


await mongoose.disconnect();

console.log("\nDatabase initialization complete.");
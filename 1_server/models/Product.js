// File: models/Product.js

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({

  _id: String,

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  quantity: {
    type: Number,
    required: true,
    min: 0
  }

}, {
  collection: 'products'
});

export const Product = mongoose.model("Product", productSchema);
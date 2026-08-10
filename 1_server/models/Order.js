// File: models/Order.js

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({

  product: {
    type: String,
    ref: 'Product',
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  price: {
    type: Number,
    required: true
  }

}, {
  _id: false
});


const orderSchema = new Schema({

  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [orderItemSchema],

  total: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, {
  collection: 'orders'
});

export const Order = mongoose.model("Order", orderSchema);
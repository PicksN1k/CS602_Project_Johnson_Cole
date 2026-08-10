// File: models/User.js

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  }

}, {
  collection: 'users'
});

export const User = mongoose.model("User", userSchema);
// File: authModule.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from './models/index.js';

const JWT_SECRET = "CS602_PROJECT_SECRET";


// LOGIN
export const login = async (username, password) => {

  const user = await User.findOne({
    username: username
  });

  if (!user) {
    throw new Error(
      "Invalid username or password"
    );
  }

  const passwordMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatch) {
    throw new Error(
      "Invalid username or password"
    );
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: "2h"
    }
  );

  return {
    token: token,

    user: {
      id: user._id.toString(),
      username: user.username,
      role: user.role
    }
  };
};


// GET USER FROM JWT TOKEN
export const getUserFromToken = (authorization) => {

  if (!authorization) {
    return null;
  }

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const token =
    authorization.substring(7);

  try {

    return jwt.verify(
      token,
      JWT_SECRET
    );

  } catch (error) {

    console.log(
      "Invalid token:",
      error.message
    );

    return null;
  }
};


// REQUIRE LOGGED IN USER
export const requireUser = (context) => {

  if (!context.user) {

    throw new Error(
      "Authentication required"
    );

  }

  return context.user;
};


// REQUIRE ADMIN
export const requireAdmin = (context) => {

  const user =
    requireUser(context);

  if (user.role !== "admin") {

    throw new Error(
      "Admin access required"
    );

  }

  return user;
};
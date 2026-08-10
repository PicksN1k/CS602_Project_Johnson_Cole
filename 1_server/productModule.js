// File: productModule.js

import { Product } from './models/index.js';


// Get all products
export const getAllProducts = async () => {
  console.log("\nGet all products");

  const result = await Product.find({});

  return result;
};


// Search products by name or description
export const lookupByName = async (name) => {
  console.log("\nLookup products by name/description:", name);

  const pattern = new RegExp(name, 'i');

  const result = await Product.find({
    $or: [
      { name: pattern },
      { description: pattern }
    ]
  });

  return result;
};


// Search products by price range
export const lookupByPrice = async (min, max) => {
  console.log("\nLookup products by price:", min, "-", max);

  const result = await Product.find({
    price: {
      $gte: Number(min),
      $lte: Number(max)
    }
  });

  return result;
};

// ADMIN - Add product
export const addProduct = async (
  id,
  name,
  description,
  price,
  quantity
) => {

  const existingProduct =
    await Product.findById(id);

  if (existingProduct) {
    throw new Error("Product ID already exists");
  }

  const product = new Product({
    _id: id,
    name,
    description,
    price,
    quantity
  });

  await product.save();

  return product;
};


// ADMIN - Update product
export const updateProduct = async (
  id,
  name,
  description,
  price,
  quantity
) => {

  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  if (name !== undefined)
    product.name = name;

  if (description !== undefined)
    product.description = description;

  if (price !== undefined)
    product.price = price;

  if (quantity !== undefined)
    product.quantity = quantity;

  await product.save();

  return product;
};


// ADMIN - Delete product
export const deleteProduct = async (id) => {

  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  await Product.findByIdAndDelete(id);

  return true;
};
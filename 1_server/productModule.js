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
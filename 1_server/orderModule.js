// File: orderModule.js

import { Order, Product, User } from './models/index.js';


// Create a new customer order
export const createOrder = async (customerId, items) => {

  if (!items || items.length === 0) {
    throw new Error("Order must contain at least one product");
  }

  let total = 0;
  const orderItems = [];


  // Check inventory before creating the order
  for (const item of items) {

    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    if (product.quantity < item.quantity) {
      throw new Error(
        `Not enough ${product.name} in stock`
      );
    }

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price
    });

    total += product.price * item.quantity;
  }


  // Reduce inventory only after all items pass validation
  for (const item of items) {

    await Product.findByIdAndUpdate(
      item.productId,
      {
        $inc: {
          quantity: -item.quantity
        }
      }
    );
  }


  const order = new Order({

    customer: customerId,

    items: orderItems,

    total: Number(total.toFixed(2))

  });


  await order.save();

  return order;
};


// Get orders belonging to the logged-in customer
export const getCustomerOrders = async (customerId) => {

  return await Order.find({
    customer: customerId
  })
    .populate("customer")
    .populate("items.product");
};


// ADMIN - Get all customers
export const getCustomers = async () => {

  return await User.find({
    role: "customer"
  });
};


// ADMIN - Get orders for a particular customer
export const getOrdersByCustomer = async (customerId) => {

  return await Order.find({
    customer: customerId
  })
    .populate("customer")
    .populate("items.product");
};


// ADMIN - Delete an order
export const deleteOrder = async (orderId) => {

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }


  // Put the inventory back
  for (const item of order.items) {

    await Product.findByIdAndUpdate(
      item.product,
      {
        $inc: {
          quantity: item.quantity
        }
      }
    );
  }


  await Order.findByIdAndDelete(orderId);

  return true;
};

// ADMIN - Update an existing order
export const updateOrder = async (orderId, newItems) => {

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (!newItems || newItems.length === 0) {
    throw new Error("Order must contain at least one product");
  }


  // Restore inventory from the existing order
  for (const item of order.items) {

    await Product.findByIdAndUpdate(
      item.product,
      {
        $inc: {
          quantity: item.quantity
        }
      }
    );
  }


  const updatedItems = [];
  let total = 0;

  try {

    // Validate the new order
    for (const item of newItems) {

      const product =
        await Product.findById(item.productId);

      if (!product) {
        throw new Error(
          `Product ${item.productId} not found`
        );
      }

      if (item.quantity <= 0) {
        throw new Error(
          "Quantity must be greater than zero"
        );
      }

      if (product.quantity < item.quantity) {
        throw new Error(
          `Not enough ${product.name} in stock`
        );
      }

      updatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      total += product.price * item.quantity;
    }


    // Remove the new quantities from inventory
    for (const item of newItems) {

      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            quantity: -item.quantity
          }
        }
      );
    }


    order.items = updatedItems;
    order.total = Number(total.toFixed(2));

    await order.save();

    return order;

  } catch (error) {

    // If the update fails, put the original inventory
    // back into the state it was in before the update.
    for (const item of order.items) {

      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            quantity: -item.quantity
          }
        }
      );
    }

    throw error;
  }
};
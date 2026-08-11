import { useEffect, useState } from "react";

import * as clientModule from "./clientModule.js";


export default function CustomerShop() {

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {

    loadProducts();
    loadOrders();

  }, []);


  async function loadProducts() {

    try {

      const result = await clientModule.getProducts();

      setProducts(result);

    } catch (error) {

      console.error(error);
      setError("Unable to load products.");

    }

  }


  async function loadOrders() {

    try {

      const result = await clientModule.getMyOrders();

      setOrders(result);

    } catch (error) {

      console.error(error);

    }

  }


  function handleQuantityChange(productId, value) {

    setQuantities({
      ...quantities,
      [productId]: Number(value)
    });

  }


  async function handlePlaceOrder() {

    setMessage("");
    setError("");

    const items = products
      .filter(product => quantities[product._id] > 0)
      .map(product => ({
        productId: product._id,
        quantity: quantities[product._id]
      }));


    if (items.length === 0) {

      setError(
        "Please select at least one product."
      );

      return;
    }


    try {

      const result =
        await clientModule.createOrder(items);

      setMessage(
        `Order placed successfully. Total: $${result.total.toFixed(2)}`
      );

      setQuantities({});

      await loadProducts();
      await loadOrders();

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Unable to place order."
      );

    }

  }


  return (

    <div>

      <h2>Shop Products</h2>


      {error && (
        <div className="error">
          {error}
        </div>
      )}


      {message && (
        <div className="success">
          {message}
        </div>
      )}


      <div className="product-grid">

        {products.map(product => (

          <div
            className="product-card"
            key={product._id}
          >

            <h3>
              {product.name}
            </h3>

            <p>
              {product.description}
            </p>

            <p className="price">
              ${product.price.toFixed(2)}
            </p>

            <p className="stock">
              In Stock: {product.quantity}
            </p>

            <label>
              Quantity
            </label>

            <input
              type="number"
              min="0"
              max={product.quantity}
              value={quantities[product._id] || ""}
              onChange={
                (event) =>
                  handleQuantityChange(
                    product._id,
                    event.target.value
                  )
              }
            />

          </div>

        ))}

      </div>


      <div className="section">

        <button
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>

      </div>


      <div className="section">

        <h2>My Orders</h2>


        {orders.length === 0 && (

          <p>
            You have not placed any orders yet.
          </p>

        )}


        {orders.map(order => (

          <div
            className="product-card"
            key={order._id}
          >

            <h3>
              Order {order._id}
            </h3>

            <p>
              Total: ${order.total.toFixed(2)}
            </p>

            <ul>

              {order.items.map(
                (item, index) => (

                  <li key={index}>

                    {item.product.name}

                    {" - "}

                    Quantity: {item.quantity}

                    {" - "}

                    ${item.price.toFixed(2)}

                  </li>

                )
              )}

            </ul>

          </div>

        ))}

      </div>

    </div>

  );

}
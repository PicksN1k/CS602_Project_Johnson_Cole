// File: AdminDashboard.js

import { useEffect, useState } from "react";
import * as clientModule from "./clientModule.js";

export default function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [customerError, setCustomerError] = useState("");

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    quantity: ""
  });


  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);


  // --------------------------------------------------
  // LOAD PRODUCTS
  // --------------------------------------------------

  async function loadProducts() {

    try {

      const result =
        await clientModule.getProducts();

      setProducts(result || []);

    } catch (error) {

      console.error(
        "PRODUCT LOAD ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to load products."
      );

    }

  }


  // --------------------------------------------------
  // LOAD CUSTOMERS
  // --------------------------------------------------

  async function loadCustomers() {

    try {

      setCustomerError("");

      const result =
        await clientModule.getCustomers();

      console.log(
        "CUSTOMERS RESULT:",
        result
      );

      setCustomers(result || []);

    } catch (error) {

      console.error(
        "CUSTOMER LOAD ERROR:",
        error
      );

      setCustomerError(
        error.message ||
        "Unable to load customers."
      );

    }

  }


  // --------------------------------------------------
  // VIEW CUSTOMER ORDERS
  // --------------------------------------------------

  async function viewCustomerOrders(customer) {

    try {

      setError("");
      setSelectedCustomer(customer);

      const result =
        await clientModule.getCustomerOrders(
          customer.id
        );

      setCustomerOrders(result || []);

    } catch (error) {

      console.error(
        "CUSTOMER ORDER ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to load customer orders."
      );

    }

  }


  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  function handleChange(event) {

    const { name, value } =
      event.target;

    setForm({
      ...form,
      [name]: value
    });

  }


  function clearForm() {

    setForm({
      id: "",
      name: "",
      description: "",
      price: "",
      quantity: ""
    });

    setMessage("");
  }


  function selectProduct(product) {

    setForm({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity
    });

    setMessage(
      `Editing ${product.name}`
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // --------------------------------------------------
  // ADD PRODUCT
  // --------------------------------------------------

  async function handleAddProduct(event) {

    event.preventDefault();

    try {

      setError("");
      setMessage("");

      await clientModule.addProduct(
        form.id,
        form.name,
        form.description,
        form.price,
        form.quantity
      );

      setMessage(
        "Product added successfully."
      );

      clearProductFields();

      await loadProducts();

    } catch (error) {

      console.error(
        "ADD PRODUCT ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to add product."
      );

    }

  }


  // --------------------------------------------------
  // UPDATE PRODUCT
  // --------------------------------------------------

  async function handleUpdateProduct() {

    try {

      setError("");
      setMessage("");

      if (!form.id) {

        setError(
          "Select a product to update."
        );

        return;
      }

      await clientModule.updateProduct(
        form.id,
        form.name,
        form.description,
        form.price,
        form.quantity
      );

      setMessage(
        "Product updated successfully."
      );

      clearProductFields();

      await loadProducts();

    } catch (error) {

      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to update product."
      );

    }

  }


  // --------------------------------------------------
  // DELETE PRODUCT
  // --------------------------------------------------

  async function handleDeleteProduct(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");
      setMessage("");

      await clientModule.deleteProduct(id);

      setMessage(
        "Product deleted successfully."
      );

      await loadProducts();

    } catch (error) {

      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to delete product."
      );

    }

  }


  // --------------------------------------------------
  // DELETE ORDER
  // --------------------------------------------------

  async function handleDeleteOrder(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this order?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");
      setMessage("");

      await clientModule.deleteOrder(id);

      setMessage(
        "Order deleted successfully."
      );

      if (selectedCustomer) {

        await viewCustomerOrders(
          selectedCustomer
        );

      }

      await loadProducts();

    } catch (error) {

      console.error(
        "DELETE ORDER ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to delete order."
      );

    }

  }


  function clearProductFields() {

    setForm({
      id: "",
      name: "",
      description: "",
      price: "",
      quantity: ""
    });

  }


  // --------------------------------------------------
  // DISPLAY
  // --------------------------------------------------

  return (

    <div>

      <h2>Admin Dashboard</h2>


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


      {/* PRODUCT MANAGEMENT */}

      <div className="section">

        <h2>Product Management</h2>

        <form onSubmit={handleAddProduct}>

          <label>Product ID</label>

          <input
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="Example: P1009"
            required
          />


          <label>Product Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product name"
            required
          />


          <label>Description</label>

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />


          <label>Price</label>

          <input
            type="number"
            step="0.01"
            min="0"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />


          <label>Quantity</label>

          <input
            type="number"
            min="0"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />


          <button type="submit">
            Add Product
          </button>

          {" "}

          <button
            type="button"
            onClick={handleUpdateProduct}
          >
            Update Product
          </button>

          {" "}

          <button
            type="button"
            onClick={clearForm}
          >
            Clear
          </button>

        </form>

      </div>


      {/* PRODUCTS */}

      <div className="section">

        <h2>Products</h2>

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {products.map(product => (

              <tr key={product._id}>

                <td>
                  {product._id}
                </td>

                <td>
                  {product.name}
                </td>

                <td>
                  ${Number(product.price).toFixed(2)}
                </td>

                <td>
                  {product.quantity}
                </td>

                <td>

                  <button
                    type="button"
                    onClick={() =>
                      selectProduct(product)
                    }
                  >
                    Edit
                  </button>

                  {" "}

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteProduct(
                        product._id
                      )
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* CUSTOMERS */}

      <div className="section">

        <h2>Customers</h2>


        {customerError && (

          <div className="error">

            {customerError}

            <br />

            <button
              type="button"
              onClick={loadCustomers}
            >
              Try Again
            </button>

          </div>

        )}


        {!customerError &&
          customers.length === 0 && (

          <p>
            No customer accounts found.
          </p>

        )}


        {customers.length > 0 && (

          <table>

            <thead>

              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Orders</th>
              </tr>

            </thead>

            <tbody>

              {customers.map(customer => (

                <tr key={customer.id}>

                  <td>
                    {customer.username}
                  </td>

                  <td>
                    {customer.role}
                  </td>

                  <td>

                    <button
                      type="button"
                      onClick={() =>
                        viewCustomerOrders(
                          customer
                        )
                      }
                    >
                      View Orders
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>


      {/* CUSTOMER ORDERS */}

      {selectedCustomer && (

        <div className="section">

          <h2>
            Orders for{" "}
            {selectedCustomer.username}
          </h2>


          {customerOrders.length === 0 ? (

            <p>
              This customer has no orders.
            </p>

          ) : (

            customerOrders.map(order => (

              <div
                className="product-card"
                key={order._id}
              >

                <h3>
                  Order {order._id}
                </h3>

                <p>
                  Total: $
                  {Number(order.total).toFixed(2)}
                </p>


                <ul>

                  {order.items.map(
                    (item, index) => (

                      <li key={index}>

                        {item.product?.name ||
                          "Product"}

                        {" - Quantity: "}

                        {item.quantity}

                        {" - $"}

                        {Number(
                          item.price
                        ).toFixed(2)}

                      </li>

                    )
                  )}

                </ul>


                <button
                  type="button"
                  onClick={() =>
                    handleDeleteOrder(
                      order._id
                    )
                  }
                >
                  Delete Order
                </button>

              </div>

            ))

          )}

        </div>

      )}

    </div>

  );

}
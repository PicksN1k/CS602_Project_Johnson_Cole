import { useEffect, useState } from "react";

import * as clientModule from "./clientModule.js";


export default function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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


  async function loadProducts() {

    try {

      const result =
        await clientModule.getProducts();

      setProducts(result);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load products."
      );

    }

  }


  async function loadCustomers() {

    try {

      const result =
        await clientModule.getCustomers();

      setCustomers(result);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load customers."
      );

    }

  }


  async function viewCustomerOrders(customer) {

    try {

      setError("");

      setSelectedCustomer(customer);

      const result =
        await clientModule.getCustomerOrders(
          customer.id
        );

      setCustomerOrders(result);

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Unable to load customer orders."
      );

    }

  }


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

  }


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

      clearForm();

      await loadProducts();

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Unable to add product."
      );

    }

  }


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

      clearForm();

      await loadProducts();

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Unable to update product."
      );

    }

  }


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

      console.error(error);

      setError(
        error.message ||
        "Unable to delete product."
      );

    }

  }


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

      console.error(error);

      setError(
        error.message ||
        "Unable to delete order."
      );

    }

  }


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
                  ${product.price.toFixed(2)}
                </td>

                <td>
                  {product.quantity}
                </td>

                <td>

                  <button
                    onClick={() =>
                      selectProduct(product)
                    }
                  >
                    Edit
                  </button>

                  {" "}

                  <button
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


      <div className="section">

        <h2>Customers</h2>

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

      </div>


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
                  {order.total.toFixed(2)}
                </p>


                <ul>

                  {order.items.map(
                    (item, index) => (

                      <li key={index}>

                        {item.product?.name ||
                          "Product"}

                        {" - "}

                        Quantity:{" "}
                        {item.quantity}

                        {" - $"}

                        {item.price.toFixed(2)}

                      </li>

                    )
                  )}

                </ul>


                <button
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
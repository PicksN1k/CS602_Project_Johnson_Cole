// File: App.js

import { useState } from "react";

import Login from "./Login.js";
import * as clientModule from "./clientModule.js";

import "./App.css";
import CustomerShop from "./CustomerShop.js";
import AdminDashboard from "./AdminDashboard.js";

function App() {

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;

  });


  async function handleLogin(username, password) {

    const result = await clientModule.login(
      username,
      password
    );

    localStorage.setItem(
      "token",
      result.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(result.user)
    );

    setUser(result.user);
  }


  function handleLogout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  }


  if (!user) {

    return (
      <div className="container">

        <Login onLogin={handleLogin} />

      </div>
    );

  }


  return (

    <div className="container">

      <h1>CS602 Shopping Cart</h1>

      <p>
        Logged in as: <strong>{user.username}</strong>
      </p>

      <p>
        Role: <strong>{user.role}</strong>
      </p>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />


      {user.role === "customer" && (

        <CustomerShop />

      )}


      {user.role === "admin" && (

        <AdminDashboard />

      )}

    </div>

  );

}

export default App;
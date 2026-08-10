import { useState } from "react";


export default function Login({ onLogin }) {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");


  async function handleSubmit(event) {

    event.preventDefault();

    try {

      setError("");

      await onLogin(
        username,
        password
      );

    } catch (error) {

      console.error(error);

      setError(
        "Invalid username or password"
      );

    }
  }


  return (

    <div>

      <h1>CS602 Shopping Cart</h1>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <div>

          <label>Username: </label>

          <input
            type="text"
            value={username}
            onChange={
              (e) =>
                setUsername(e.target.value)
            }
            required
          />

        </div>

        <br />

        <div>

          <label>Password: </label>

          <input
            type="password"
            value={password}
            onChange={
              (e) =>
                setPassword(e.target.value)
            }
            required
          />

        </div>

        <br />

        <button type="submit">
          Login
        </button>

      </form>

      {error && (
        <p>{error}</p>
      )}

      <hr />

      <p>
        Customer: customer / customer123
      </p>

      <p>
        Admin: admin / admin123
      </p>

    </div>

  );
}
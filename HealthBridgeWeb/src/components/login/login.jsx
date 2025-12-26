import styles from './login.module.css';
import { useState } from 'react';

function Login({ handleLoginSuccess }) {
  // React states for storing form data and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh
    setErrorMessage(""); // reset previous error

    try {
      // Send POST request to PHP backend
      const response = await fetch("http://localhost/serverHB/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        setErrorMessage("Server returned invalid response. Please try again.");
        console.error("Invalid JSON response:", jsonError);
        return;
      }

      // Check for success
      if (!data.success) {
        setErrorMessage(data.message || "Login failed");
      } else {
        // Pass role/session/adminId to parent
        handleLoginSuccess(data);
      }

    } catch (networkError) {
      console.error("Network error:", networkError);
      setErrorMessage("Unable to reach server. Please check your connection.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>

        <label className={styles.label}>
          Username:
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            onInvalid={(e) => e.target.setCustomValidity("Please enter your username")}
            onInput={(e) => e.target.setCustomValidity("")}
          />
        </label>

        <label className={styles.label}>
          Password:
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onInvalid={(e) => e.target.setCustomValidity("Please enter your password")}
            onInput={(e) => e.target.setCustomValidity("")}
          />
        </label>

        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

        <button type="submit" className={styles.loginButton}>Submit</button>
      </form>
    </div>
  );
}

export default Login;

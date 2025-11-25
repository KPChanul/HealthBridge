import styles from './login.module.css';
import { useState } from 'react';

function Login({onLoginSuccess}) {

    // React states for storing form data and error message
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page refresh

        
        // Send POST request to PHP backend
        const response = await fetch("http://localhost/serverHB/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },

            // send username + password as JSON
            body: JSON.stringify({ username, password })
        });
        // receive JSON from backend
        const data = await response.json();
        
        // if login failed → show error
        if (!data.success) {
            setErrorMessage(data.message);
        } else {
            sessionStorage.setItem("sessionID", data.sessionID);
            onLoginSuccess({ role: data.role, admin_id: data.admin_id });
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
            onInvalid={(e) => e.target.setCustomValidity("Please enter your user name")}
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

        <label className={styles.errorMessage}>
          {errorMessage}
        </label>

        <button type="submit" className={styles.loginButton}>Submit</button>
      </form>
    </div>
    );
}
export default Login;
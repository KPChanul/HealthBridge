import { useState } from "react";
import './subscribe.css';

function Subscribe() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost/ServerHB/subscribe.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      setMessage(data.message);
      if (data.success) setEmail(""); // Clear input if successful
    } catch (err) {
      setMessage("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="subscribe-box">
      <h3>Subscribe for Updates</h3>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe"}
      </button>

      {message && <p className={message.includes("successfully") ? "success" : "error"}>{message}</p>}
    </div>
  );
}

export default Subscribe;

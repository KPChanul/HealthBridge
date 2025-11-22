import "./Feedback.css";
import { useState } from "react";

export default function FeedbackForm() {
  // State to store form values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    type: "",
    message: "",
  });

  const [status, setStatus] = useState(""); // Status message for user

  // Update state when input/select/textarea changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setStatus("Sending...");

    try {
      // Send form data to PHP backend
      const response = await fetch("http://localhost/myproject/send.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setStatus(result.message); // Show success/error message
    } catch (error) {
      setStatus("Error sending feedback. Please try again.");
    }
  };

  return (
    <div className="feedback-container">
      <h2 id="feedback-h2">Send Us Your Feedback</h2>
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="name">Full Name : </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label htmlFor="email">Email Address : </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label htmlFor="role">You are a</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">-- Select your role --</option>
            <option value="donor">Donor</option>
            <option value="patient">Patient</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Feedback Type */}
        <div className="form-group">
          <label htmlFor="type">Feedback Type</label>
          <select
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">-- Select --</option>
            <option value="issue">Report an Issue</option>
            <option value="suggestion">Suggestion</option>
            <option value="general">General Comment</option>
          </select>
        </div>

        {/* Message */}
        <div className="form-group">
          <label htmlFor="message">Your Message : </label>
          <textarea
            id="message"
            name="message"
            placeholder="Write your feedback here..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit">Submit Feedback</button>
      </form>

      {/* Show status message */}
      {status && <p>{status}</p>}
    </div>
  );
}

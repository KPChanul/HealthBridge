import "./Feedback.css";

export default function ContactUsForm() {
  return (
    <div className="feedback-container">
      <h2 id="feedback-h2">Send Us Your Feedback</h2>
      <form action="#" method="POST">
        <div className="form-group">
          <label for="name">Full Name : </label>
          <input type="text" id="name" name="name" required />
        </div>

        <div className="form-group">
          <label for="email">Email Address : </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            required
          />
        </div>
        <div class="form-group">
          <label for="role">You are a</label>
          <select id="role" name="role" required>
            <option value="">-- Select your role --</option>
            <option value="donor">Donor</option>
            <option value="patient">Patient</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label for="type">Feedback Type</label>
          <select name="type" id="type" required>
            <option value="">-- Select --</option>
            <option value="issue">Report an Issue</option>
            <option value="suggestion">Suggestion</option>
            <option value="general">General Comment</option>
          </select>
        </div>

        <div class="form-group">
          <label for="message">Your Message : </label>
          <textarea
            id="message"
            name="message"
            placeholder="Write your feedback here..."
            required
          ></textarea>
        </div>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}

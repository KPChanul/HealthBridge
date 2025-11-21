export default function ContactUsForm() {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>

      <form>

        <label>Name</label>
        <input type="text" name="name" placeholder="Enter your name" required />

        <label>Email</label>
        <input type="email" name="email" placeholder="Enter your email" required />

        <label>Message</label>
        <textarea
          name="message"
          rows="4"
          placeholder="Write your message..."
          required
        ></textarea>

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

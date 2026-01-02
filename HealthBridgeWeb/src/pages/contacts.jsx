import FeedbackForm from "../components/Feedback-Form/FeedBack.jsx";
import "font-awesome/css/font-awesome.min.css";
import "./contacts.css";
import Header from "../components/header/Header.jsx"
import Footer from "../components/Footer/Footer.jsx"


function Contacts() {
  return (
    <>
    <Header/>
      
      <section className="contact">
        <div className="content">
          <h2>Contact Us</h2>
          <p>
            We value your feedback and are here to assist with any questions or
            concerns. Please use the form to send us your suggestions,
            inquiries, or comments, and we will respond as soon as possible to
            help you.
          </p>
        </div>


        {/* WRAPPER (LEFT INFO + RIGHT FORM) */}
        <div className="contact-wrapper">
          {/* LEFT SIDE (Contact Information) */}
          <div className="contactInfo">
            <div className="box">
              <div className="icon">
                <i className="fa fa-map-marker" aria-hidden="true"></i>
              </div>
              <div className="text">
                <h3>Address</h3>
                <p>University of Moratuwa</p>
                <p>Bandaranayake Mawatha, Katubedda, Moratuwa</p>
              </div>
            </div>

            <div className="box">
              <div className="icon">
                <i className="fa fa-phone" aria-hidden="true"></i>
              </div>
              <div className="text">
                <h3>Phone</h3>
                <p>0112 640 051</p>
              </div>
            </div>

            <div className="box">
              <div className="icon">
                <i className="fa fa-envelope-o" aria-hidden="true"></i>
              </div>
              <div className="text">
                <h3>Email</h3>
                <p>healthbridge.uom@gmail.com</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (Feedback Form) */}
          <div className="feedback-form">
            <FeedbackForm />
          </div>
        </div>
      </section>
      
      <Footer/>
    </>
  );
}

export default Contacts;

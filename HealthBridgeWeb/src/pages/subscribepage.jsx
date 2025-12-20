import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/Footer/Footer.jsx";
import Subscribe from "../components/Subscribe/subscribe.jsx";

function SubscribePage() {
  return (
    <>
      <Header />
      <div style={{ padding: "50px 20px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "30px", color: "#0a2540" }}>Subscribe for Updates</h1>
        <Subscribe />
      </div>
      <Footer />
    </>
  );
}

export default SubscribePage;

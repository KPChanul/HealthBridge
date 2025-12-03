// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import About from "./pages/aboutus.jsx";
import Contacts from "./pages/contacts.jsx";
import AdminPage from "./pages/admin.jsx";
import Donations from "./pages/donations.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import './App.css'



function App() {
 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about-us" element={<About />}/>
        <Route path="/contacts" element={<Contacts />}/>   {/*this page is include a feedback form and contact details*/}
        <Route path="/donations" element={< Donations />}/>   {/*this page is include donation cards*/}
       
        <Route path="/HowItWorks" element={< HowItWorks />}/>
        
        <Route path="/admin" element={< AdminPage />}/>    {/*this page is include both sysadmin and admin pages after loging in*/}
        
      </Routes>
      

      
      
    </Router>
  )
}

export default App

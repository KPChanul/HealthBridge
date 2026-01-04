// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import About from "./pages/aboutus.jsx";
import Contacts from "./pages/contacts.jsx";
import AdminPage from "./pages/admin.jsx";
import Donations from "./pages/Donation_page/Donation.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import SubscribePage from "./pages/subscribepage.jsx";
import './App.css'



function App() {
 

  return (

    
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about-us" element={<About />}/>
        <Route path="/contacts" element={<Contacts />}/>   {/*this page is include a feedback form and contact details*/}
        <Route path="/donations" element={<Donations />}/>  
       
        <Route path="/HowItWorks" element={< HowItWorks />}/>
        
        <Route path="/admin" element={< AdminPage />}/>    {/*this page is include both sysadmin and admin pages after loging in*/}
        <Route path="/subscribe" element={<SubscribePage />} />
      </Routes>
      
      

      
      
    </Router>
  )
}

export default App

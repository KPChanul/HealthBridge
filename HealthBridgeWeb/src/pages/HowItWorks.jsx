
import React from 'react';
import Header from "../components/header/Header"
import '../pagesCSS/howItWorks.css'; // Import the CSS file
import Footer  from '../components/Footer/Footer.jsx';
import iconOrganise from '../assets/img11.png';
import iconVerify from '../assets/img22.png';
import iconDonate from '../assets/img33.png';
import iconReport from '../assets/img33.png';

function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "1. Organise & Submit Cause",
      description: "Individuals or registered entities create a detailed campaign, outlining their need, fundraising goal, and compelling story.",
      imageSrc: iconOrganise // New property for image source
    },
    {
      id: 2,
      title: "2. Verification & Vetting",
      description: "Causes are rigorously reviewed by specialized moderators and independent auditors to ensure transparency and legitimacy.",
      imageSrc: iconVerify // New property for image source
    },
    {
      id: 3,
      title: "3. Browse & Donate Securely",
      description: "Donors browse verified campaigns, select a cause, and contribute using various secure methods (Cards, eZ Cash, Bank Transfer).",
      imageSrc: iconDonate // New property for image source
    },
    {
      id: 4,
      title: "4. Funds Disbursed & Reported",
      description: "Funds are securely released to the beneficiary. Donors receive progress updates, ensuring accountability and transparency.",
      imageSrc: iconReport // New property for image source
    },
  ];

  return (
    <>
      <Header /> 
      
      {/* --- MAIN PAGE CONTENT START --- */}
      <main className="how-it-works-container">
        
        <header className="works-header">
          <h1>How HealthBridge Works</h1>
          <p>Connecting verified needs with generous donors, step by step.</p>
        </header>

        {/* --- The Crowdfunding Flow Section --- */}
        <section className="works-flowchart">
          <h2>Our Simple Process</h2>
          <div className="steps-wrapper">
            {steps.map((step) => (
              <div key={step.id} className="work-step">
                <div className="step-icon-box">
                  {/* --- REPLACED PLACEHOLDER WITH IMG TAG --- */}
                  <img 
                    src={step.imageSrc} 
                    alt={`Icon for Step ${step.id}`} 
                    className="step-icon-image"
                  />
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {step.id < steps.length && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </section>
        
        <hr className="divider" />

        {/* --- Key Features/Why Us Section --- */}
        <section className="works-faq">
          <h2>Key Pillars of Our Platform</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Verified Transparency</h3>
              <p>Rigorous third-party audits ensure 100% of the intended funds reach the verified beneficiary, promoting trust and accountability.</p>
            </div>
            <div className="faq-item">
              <h3>Multiple Payment Options</h3>
              <p>We support various local and international payment gateways to make donating simple and accessible for everyone.</p>
            </div>
            <div className="faq-item">
              <h3>Progress Updates</h3>
              <p>Follow the journey! Donors receive mandatory updates on the cause they supported until the goal is achieved.</p>
            </div>
          </div>
        </section>

      </main>
      {/* --- MAIN PAGE CONTENT END --- */}

      {/* Assuming your Footer component will be placed here */}
       <Footer /> 

    </>
  );
}

export default HowItWorks;
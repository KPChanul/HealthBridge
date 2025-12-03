import { useEffect, useState } from "react";
import "./about.css";
import healthImage from "../assets/maindemo.png";
import missionImg from "../assets/mission1.png";
import visionImg from "../assets/vision1.png";



function About() {
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    document.title = "About - HealthBridge";

    const handleScroll = () => {
      // Reveal sections on scroll
      const sections = document.querySelectorAll(".info-section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          setVisibleSections((prev) => ({
            ...prev,
            [section.id]: true,
          }));
        }
      });
      
      // Parallax effect for hero image
const hero = document.querySelector(".about-hero img");
window.addEventListener("scroll", () => {
  if (hero) {
    const scrollY = window.scrollY;

    // Maximum downward movement in pixels
    const maxTranslate = 60; // adjust as needed
    // Calculate translateY, then clamp it between min and max
    let translateY = scrollY * 0.5; 
    translateY = Math.min(translateY, maxTranslate);
    hero.style.transform = `scale(1.1) translateY(${translateY}px)`;
  }
});
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // trigger on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    
    <main className="main-container">
      
      {/* Fixed header */}
      <div style={{width: "100%",height: "60px", backgroundColor: "#007BFF", position: "fixed",top: 0,left: 0,display: "flex",alignItems: "center",justifyContent: "center",zIndex: 1000}}>
        My Fixed Header
      </div>
      {/* Hero Section */}
      
      <hr/>
      <div className="about-hero">
        <img src={healthImage} alt="HealthBridge" />
      </div>

      {/* About Section */}
      <section
        style={{margin:"70px 50px 10px 50px"}}
      >
        <center><h2>About HealthBridge</h2></center>
        <p>
          HealthBridge is a medical funding support platform developed by a team
          of undergraduate students from the
          <strong>
            {" "}
            Department of Computer Science & Engineering, University of Moratuwa
          </strong>
          . It provides a secure, transparent, and efficient way for students
          and their immediate families to receive financial assistance during
          medical emergencies.
        </p>
        <p>
          Our goal is to ensure that every student can focus on their academics
          without being burdened by sudden medical expenses.
        </p>
      </section>
      <section className="box-container">
      {/* Mission */}
      <div
        id="mission-section"
        className={`info-section ${
          visibleSections["mission-section"] ? "visible" : ""
        }`}
      >
        <img src={missionImg}/>
        <center><h2>Our Mission</h2></center>
        <p>
          To ensure that no student is left helpless during medical emergencies.
          HealthBridge aims to provide quick, reliable, and transparent medical
          funding so students and their families can access the support they
          need, allowing students to continue their education without
          disruption.
        </p>
      </div>

      {/* Vision */}
      <div
        id="vision-section"
        className={`info-section ${
          visibleSections["vision-section"] ? "visible" : ""
        }`}
      > 
        <img src={visionImg}/>
        <center><h2>Our Vision</h2></center>
        <p>
          To create a compassionate and sustainable support network where every
          student has equal access to medical assistance.
        </p>
        <p>
          We envision expanding HealthBridge beyond the University of Moratuwa,
          reaching universities nationwide, and building a community-supported
          platform that ensures timely financial aid is always available during
          medical crises.
        </p>
      </div>
      </section>
    </main>
  );
}


export default About
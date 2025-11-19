import { useEffect, useState } from "react";
import "./about.css";
import healthImage from "./assets/HealthBridge.png";

export default function AboutUs() {
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
      if (hero) {
        const scrollY = window.scrollY;
        hero.style.transform = `scale(1.1) translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // trigger on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <img src={healthImage} alt="HealthBridge" />
      </div>

      {/* About Section */}
      <section
        id="about-section"
        className={`info-section ${
          visibleSections["about-section"] ? "visible" : ""
        }`}
      >
        <h2>About HealthBridge</h2>
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

      {/* Mission */}
      <section
        id="mission-section"
        className={`info-section ${
          visibleSections["mission-section"] ? "visible" : ""
        }`}
      >
        <h2>Our Mission</h2>
        <p>
          To ensure that no student is left helpless during medical emergencies.
          HealthBridge aims to provide quick, reliable, and transparent medical
          funding so students and their families can access the support they
          need, allowing students to continue their education without
          disruption.
        </p>
      </section>

      {/* Vision */}
      <section
        id="vision-section"
        className={`info-section ${
          visibleSections["vision-section"] ? "visible" : ""
        }`}
      >
        <h2>Our Vision</h2>
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
      </section>
    </div>
  );
}

import React from 'react'
import Header from "../components/header/Header"
import mainImage from '../assets/main3.jpg'
import mainImage2 from '../assets/main4.webp'
import mainImage3 from '../assets/main5.avif'
import '../pagesCSS/home.css'
import disImage from "../assets/imageFormiddle.png"
import MenuLinks from '../components/header/MenuLinks'

import img1 from '../assets/img11b.png'
import img2 from '../assets/img22b.png'
import img3 from '../assets/img33b.png'

function Home(){
    return(
    
    <>
        <Header/>
        <div className='contImg'>
            <div className='imageContainer'>
                <img className='mainImage' src={mainImage} alt="main home image1" />
                <img className='mainImage' src={mainImage2} alt="main home image2" />
                <img className='mainImage' src={mainImage3} alt="main home image3" />
            </div>
        </div>

        <div className='headTopic'>
            <div className='homeTopic'>
                <h1 className='topic'>Investing in Wellness, Building Healthier Futures</h1>
            </div>
        </div>

        <div className="btn">
            <button className='donateBtn'><span></span><MenuLinks linkname="Donate now" url="/donations" className='donation-link'/></button>
            <button className='subscribeBtn'><span></span><MenuLinks linkname="subscribe now" url="/donations" className='donation-link'/></button>
        </div>

        <div className="discription">

            <div className="dis">
                <h2 className='disTopic'>Platform Description</h2>
                <p className='disPar'>
                    HealthBridge.lk is a trusted, secure, and completely free online fundraising platform designed for 
                    impact. We connect compassionate individuals to vital causes, empowering you to take immediate and effective 
                    action and enrich lives across Sri Lanka through easy, transparent giving.
                </p>
                <MenuLinks linkname="Learn More" url="/HowItWorks" className='howitWOrk'/>
            </div>

            <div className='disimage'>
                <img src={disImage} alt="discription image" />
            </div>

        </div>

        {/* home page card section */}

        <div className="karuna-fundraising-section">
            <div className="left-text-area">
                <h2>Fundraising on HealthBridge.lk takes only a few minutes</h2>
            </div>
            <div className="steps-container">
                <div className="step-card">
                    <div className="step-number">1</div>
                    <div className="step-image">
                        <img src={img1} alt="img1" />
                    </div>
                    <div className="step-content">
                        <h3>Get Started</h3>
                        <p>Set up a profile|register with your details</p>
                    </div>
                </div>

                <div className="step-card">
                    <div className="step-number">2</div>
                    <div className="step-image">
                        <img src={img2} alt="img2" />
                    </div>
                    <div className="step-content">
                        <h3>Craft Your Story</h3>
                        <p>Inspire your followers and rally your community.</p>
                    </div>
                </div>

                <div className="step-card">
                    <div className="step-number">3</div>
                    <div className="step-image">
                        <img src={img3} alt="img3" />
                    </div>
                    <div className="step-content">
                        <h3>Get Discovered</h3>
                        <p>Raise more with less effort.</p>
                    </div>
                </div>
            </div>
        </div>

        {/*end of card section */}
        
    </>
    
    )
}

export default Home
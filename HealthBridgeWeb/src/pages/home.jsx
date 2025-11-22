import React from 'react'
import Header from "../components/header/Header"
import mainImage from '../assets/main3.jpg'
import mainImage2 from '../assets/main4.webp'
import mainImage3 from '../assets/main5.avif'
import '../pagesCSS/home.css'

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
        
    </>
    
    )
}

export default Home
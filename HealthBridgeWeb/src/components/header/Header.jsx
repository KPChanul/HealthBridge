/*import React from 'react'*/
import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import MenuLinks from './MenuLinks'
import './Header.css'
import { CiMenuBurger } from "react-icons/ci";

function Header() {

  const [active, setActive] = useState(false);   // <-- toggle state

  const handleMenuClick = () => {
    setActive(!active);   // toggle true/false
  };


  return (

    <>
      <div className='headIcon' onClick={handleMenuClick}>
          <CiMenuBurger />
      </div>
      <header className='Header'>

        <img src={logo} alt="logo" className='logoimage' />
        <div>
            <MenuLinks linkname="Home" url="/" className='home-link'/>
            <MenuLinks linkname="About Us" url="/about-us" className='about-link'/>
            <MenuLinks linkname="Contact Us" url="/contacts" className='contactUs-link'/>
            <MenuLinks linkname="How it works" url="/HowItWorks" className='howitworks-link'/>
            <MenuLinks linkname="Donate" url="/donations" className='donation-linklink'/>
        </div>
      </header>

      <header className={`menuBar ${active ? "menuBar-active" : ""}`}>

        <div className='box1'>
          <MenuLinks linkname="About Us" url="/about-us" className='about-link'/>
          <MenuLinks linkname="Contact Us" url="/contacts" className='contactUs-link'/>
          <MenuLinks linkname="How it works" url="/HowItWorks" className='howitworks-link'/>
        </div>

        <div className='menuFooter'>
          <div className='home-link2'>
            <MenuLinks linkname="Home" url="/" className='home-link'/>
          </div>

          <div className='donation-linklink2'>
            <MenuLinks linkname="Donate" url="/donations" className='donation-linklink'/>
          </div>
        </div>

      </header>
    </>
  )
}

export default Header
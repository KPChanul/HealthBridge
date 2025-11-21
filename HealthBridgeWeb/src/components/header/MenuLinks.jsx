import React from 'react'
import { Link } from "react-router-dom";
import './MenuLinks.css'

function MenuLinks(props) {
  return (
        
        <Link className={`menu-links ${props.className}`} to={props.url}>{props.linkname}</Link>
        
  )
}

export default MenuLinks
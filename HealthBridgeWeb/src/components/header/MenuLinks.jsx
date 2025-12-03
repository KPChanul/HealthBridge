import React from 'react'
import { Link , useLocation} from "react-router-dom";
import './MenuLinks.css'

function MenuLinks(props) {
      const location = useLocation();
      const isActive = location.pathname === props.url;
      const linkClasses = `menu-links ${props.className} ${isActive ? 'active-link' : ''}`;

  return (
        
        

        <Link className={linkClasses} to={props.url}>
            {props.linkname}
        </Link>

      
  );

}

export default MenuLinks
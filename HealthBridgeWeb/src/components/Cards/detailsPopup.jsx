//pop up window for more details  
import React from 'react';
import ReactDOM from 'react-dom';
import { X } from "lucide-react";
import './PopupStyles.css';




const MoreDetails=({patientName,description,onClose})=>{

    const modalContent = (


        <div className="modal-overlay" onClick={onClose}>
        <div className="details-modal" onClick={(e)=>e.stopPropagation()}>

          <div className="modal-header">
            <h3>{patientName}'s Case Details</h3>
            <button className='close-button'   onClick={onClose}><X size={20} /></button>
          </div>

          <div className="modal-content">
            <p>{description}</p>
          </div>

        </div>

      </div>

    );


    return ReactDOM.createPortal(
        modalContent,
        document.getElementById('modal-root') //  Target the global container
    );
};

export default MoreDetails
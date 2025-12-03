import React,{useState} from 'react';
import './PopupStyles.css';
import ReactDOM from 'react-dom';
import { X } from "lucide-react";


const PaymentModal=({onClose,patientName})=>{

    const handlePayment = (e) => {
        e.preventDefault();
        
        // --- 2. Fix String Termination Error (Missing closing quote/backtick) ---
        alert(`Processing donation of LKR ${donationAmount} for ${patientName}.`);
        onClose();
    };

    const [donationAmount,setDonationAmount]=useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cvc, setCvc] = useState('');




    const paymentContent=(


    <div className="modal-overlay" onClick={onClose}>

      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h3>Make a Donation for {patientName}</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form  onSubmit={handlePayment}>
          <p className='payment-info-text'>We accept Visa and Mastercard for secure donations.</p>
          
          
          <div className="form-group">
            <label htmlFor="amount">Donation Amount (LKR)</label>
            <input 
              id="amount" 
              type="number" 
              placeholder="e.g. 1000" 
              required 
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              min="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardholder">Cardholder Name</label>
            <input 
              id="cardholder" 
              type="text" 
              placeholder="Full Name on Card" 
              //required 
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input 
              id="cardNumber" 
              type="text" 
              placeholder="XXXX XXXX XXXX XXXX" 
              //required 
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength="19" 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
                <label htmlFor="expiry">Expiry Date (MM/YY)</label>
                <input 
                  id="expiry" 
                  type="text" 
                  placeholder="MM/YY" 
                  //required 
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  maxLength="5"
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="cvc">CVC</label>
                <input 
                  id="cvc" 
                  type="text" 
                  placeholder="XXX" 
                  //required 
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  maxLength="4"
                />
              </div>
          </div> 
          <button type="submit" className="payment-submit-button">
            Pay Now
          </button> 





        </form>

      </div>

    </div>

    
    )



    return ReactDOM.createPortal(
            paymentContent,
            document.getElementById('modal-root') //  Target the global container
        );

    
    

    

};

export default PaymentModal
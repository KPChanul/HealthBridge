import React,{useState} from 'react';
import { MapPin,Calendar,Phone,Mail}  from 'lucide-react';
import './card.css';
import MoreDetails from './detailsPopup';   
import PaymentModal from './payPopup';

const MAX_DESC_LENGTH = 110;

const CardInterface =(props)=>{

  //pop up for more details states
  const [showDetailsModal,setShowDetailsModal]  =useState(false);
  const openDetailsModal=()=>setShowDetailsModal(true);
  const closeDetailsModal=()=>setShowDetailsModal(false);

  //render description function
  
  const renderDescription=()=>{
    if (props.description.length<=MAX_DESC_LENGTH){
      return <p className="case-brief-description">{props.description}</p>;
    }

    //Truncated text create
    const truncatedText=props.description.substring(0,MAX_DESC_LENGTH)+"...";

    return(
      <div>
        <p className="case-brief-description">{truncatedText}</p>
        <button 
          onClick={openDetailsModal} 
          className="see-more-button"
        >
          See More Details
        </button>

      </div>
    );

  };


    //Format Date Function define
    const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'numeric', day: 'numeric' });

    };


    //calculate funded percentage
    const fundedPercent=props.goal>0
         ?Math.round((props.raised/props.goal)*100):0;


    //formatAmount function define
    const formatAmount=(amount)=>{
    if(amount==null|| amount==undefined) return 'Rs. 0';
    return new Intl.NumberFormat('en-IN', { 
            style: 'currency', 
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
  
    }


    //pop up for payment popup

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const handleDonateClick = () => setShowPaymentModal(true)
    const closeModal = () =>setShowPaymentModal(false);













return(
    <div className="case-card">

        <div className="dynamic-content-wrapper">
            <div className='case-header'>
                <h3>{props.patientName} </h3>
                {props.isurgent?<span className="tag-urgent">Urgent</span>:<span className="tag-standard">Active</span>}
            </div>

            <p className='health-issue'>{props.healthIssue}</p>

            {/*display description*/}
            {renderDescription()}

            {/*some space for pop up window*/}
            {showDetailsModal && <MoreDetails
                    patientName={props.patientName} 
                    description={props.description} 
                    onClose={closeDetailsModal} 

             />}
            



        </div>    

        <hr className="card-separator"/>

        <div className="goal-status">

          <span>Raised: {formatAmount(props.raised)}</span>
          <span>Goal: {formatAmount(props.goal)}</span>

        </div>


        <div className="progress-container">
            <div className="progress-bar"
                style={{ width: `${fundedPercent > 100 ? 100 : fundedPercent}%` }}>
            </div>
        </div> 

        <div className="goal-status">
          <span className="funded-percent">{fundedPercent}% funded</span>
        </div>


        <div className="case-contact-details">
          <p>
            <MapPin className='icon' />
            {props.address}
          </p>
          <p>
            <Calendar className="icon" />
            Posted: {formatDate(props.postedDate)}
          </p>
          <p>
            <Phone className='icon' />
            {<a href={`tel:${props.contactPhone}`}>{props.contactPhone}</a>}
          </p>
          <p>
            <Mail className="icon" />
            <a href={`mailto:${props.contactEmail}`}>{props.contactEmail}</a>
          </p>



        </div>

        <div className="donate-button-section">
            <button className="donate-button" onClick={handleDonateClick} >
            Donate Now
            </button> 
        </div>  
            

        {/*showing payment pop up*/}    
        {showPaymentModal && <PaymentModal 
                onClose={closeModal}
                patientName={props.patientName}
                 />}

        



    </div>
        

    )



}
export default CardInterface

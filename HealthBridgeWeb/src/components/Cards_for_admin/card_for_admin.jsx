import React, { useState } from 'react';
import { MapPin, Calendar, Phone, Mail } from 'lucide-react';
import './card_for_admin.css';
import MoreDetails from './detailsPopup';
import DeleteConfirm from '../DeleteWarning/del';
import AdminForm from '../Admin_Form/Admin_form';

const MAX_DESC_LENGTH = 110;

/**
 * CardInterface_Admin Component
 * -----------------------------
 * Displays a single case card with administrative controls (Edit, Delete).
 * Handles the logic for opening details, edit forms, and delete confirmation.
 * * @param {object} props - The case data properties (patientName, goal, raised, etc.)
 */
const CardInterface_Admin = (props) => {

    // --- STATE MANAGEMENT ---

    // State for "See More Details" Modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const openDetailsModal = () => setShowDetailsModal(true);
    const closeDetailsModal = () => setShowDetailsModal(false);

    // State for "Delete Confirmation" Modal
    const [showDeleteConfirm, setDeleteConfirm] = useState(false);
    const handleDeleteClick = () => setDeleteConfirm(true);
    const closeDelete = () => setDeleteConfirm(false);

    // State for "Edit Case" Form Modal
    const [showForm, setShowForm] = useState(false);
    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);


    // --- HELPER FUNCTIONS ---

    // 1. Render Description: Truncates text if it exceeds MAX_DESC_LENGTH
    const renderDescription = () => {
        if (props.description.length <= MAX_DESC_LENGTH) {
            return <p className="case-brief-description">{props.description}</p>;
        }

        const truncatedText = props.description.substring(0, MAX_DESC_LENGTH) + "...";
        return (
            <div>
                <p className="case-brief-description">{truncatedText}</p>
                <button onClick={openDetailsModal} className="see-more-button">
                    See More Details
                </button>
            </div>
        );
    };

    // 2. Date Formatter
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'numeric', day: 'numeric' });
    };

    // 3. Currency Formatter (LKR)
    const formatAmount = (amount) => {
        if (amount == null || amount == undefined) return 'Rs. 0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // 4. Calculations
    const fundedPercent = props.goal > 0 ? Math.round((props.raised / props.goal) * 100) : 0;
    const isFulfilled = props.isFulfilled;
    const isurgent = Number(props.isurgent);


    // --- DATA PREPARATION FOR EDIT FORM ---
    
    // Maps the card's props to the format expected by AdminForm.jsx
    const currentCaseData = {
        patientName: props.patientName,
        health_issue: props.healthIssue, 
        description: props.description,
        status: props.isurgent === 1 ? 'Urgent' : 'Active',
        raisedAmount: props.raised,
        goalAmount: props.goal,
        address: props.address,
        posted_date: props.postedDate,
        contact_phone: props.contactPhone,
        contact_email: props.contactEmail,
        bank_name: props.bankName || '', 
        branch: props.branch || '',
        account_holder: props.accountHolder || '',
        account_number: props.accountNumber || ''
    };


    // --- RENDER LOGIC ---

    return (
        <div className="case-card">

            <div className="dynamic-content-wrapper">
                
                {/* Header: Name and Status Badge */}
                <div className='case-header'>
                    <h3>{props.patientName} </h3>
                    {isFulfilled && <span className="tag-fulfilled">Fulfilled</span>}
                    {!isFulfilled && isurgent === 1 && <span className="tag-urgent">Urgent</span>}
                    {!isFulfilled && isurgent !== 1 && <span className="tag-standard">Active</span>}
                </div>

                <p className='health-issue'>{props.healthIssue}</p>

                {/* Description Section */}
                {renderDescription()}

                {/* 'See More' Modal */}
                {showDetailsModal && <MoreDetails
                    patientName={props.patientName}
                    description={props.description}
                    onClose={closeDetailsModal}
                />}
            </div>

            <hr className="card-separator" />

            {/* Funding Progress Section */}
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

            {/* Contact Details Section */}
            <div className="case-contact-details">
                <p>
                    <MapPin className='icon' /> {props.address}
                </p>
                <p>
                    <Calendar className="icon" /> Posted: {formatDate(props.postedDate)}
                </p>
                <p>
                    <Phone className='icon' /> <a href={`tel:${props.contactPhone}`}>{props.contactPhone}</a>
                </p>
                <p>
                    <Mail className="icon" /> <a href={`mailto:${props.contactEmail}`}>{props.contactEmail}</a>
                </p>
            </div>

            {/* Action Buttons (Edit / Delete) */}
            <div className="button-section">
                <button className="action-btn edit" onClick={openForm}> Edit </button>
                <button className="action-btn delete" onClick={handleDeleteClick}> Delete </button>
            </div>

            {/* --- MODALS --- */}

            {/* EDIT FORM MODAL */}
            {showForm && (
                <AdminForm
                    isOpen={showForm}
                    onClose={closeForm}
                    editData={currentCaseData}
                    // =================================================================
                    // TODO: BACKEND TEAM - CONNECT EDIT SUBMISSION (CARD VIEW)
                    // =================================================================
                    // This triggers when "Save Changes" is clicked on the card's edit form.
                    onSubmit={(updatedData) => {
                        console.log("Saving Changes (Card View)...", updatedData);
                        // 1. Call API to update this record using props.id (if available)
                        // 2. Refresh data
                        closeForm();
                    }}
                />
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteConfirm && (
                <DeleteConfirm
                    isOpen={showDeleteConfirm}
                    patientName={props.patientName}
                    onClose={closeDelete}
                    // =================================================================
                    // TODO: BACKEND TEAM - CONNECT DELETE ACTION (CARD VIEW)
                    // =================================================================
                    // This triggers when "Delete" is clicked inside the warning popup.
                    onConfirm={() => {
                         console.log("Deleting case (Card View)...");
                         // 1. Call API to delete record using props.id
                         // 2. Refresh data
                         closeDelete();
                    }}
                />
            )}

        </div>
    );
};

export default CardInterface_Admin;
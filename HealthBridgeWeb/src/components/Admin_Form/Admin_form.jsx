import  { useState, useEffect } from "react";
import styles from "./Admin_form.module.css";
import ReactDOM from 'react-dom';

/**
 * AdminForm Component
 * -------------------
 * A multi-step modal form used for both Creating (Add) and Editing (Update) cases.
 * @param {boolean} isOpen - Controls visibility of the modal.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onSubmit - Function to handle the final form submission (Passes data to Parent).
 * @param {object} editData - (Optional) If provided, the form pre-fills with this data for editing.
 */
const AdminForm = ({ isOpen, onClose, onSubmit, editData }) => {
    
    // --- 1. STATE MANAGEMENT ---

    // Tracks which page of the wizard the user is on (1: Patient Info, 2: Health Info, 3: Bank Info)
    const [step, setStep] = useState(1);
    
    const stepTitles = {
        1: "Patient Details",
        2: "Health Condition Details",
        3: "Bank Details"
    };

    // Defines the initial empty structure of the form data.
    // We keep this separate so we can easily reset the form when switching to "Add" mode.
    const initialFormState = {
        patientName: '',
        health_issue: '',
        description: '',
        status: 'Active',
        raisedAmount: 0,
        goalAmount: 0,
        address: '',
        posted_date: new Date().toLocaleDateString('en-GB'), // Default to today's date
        contact_phone: '',
        contact_email: '',
        bank_name: '',
        branch: '',
        account_holder: '',
        account_number: ''
    };

    // Holds the actual data entered by the user
    const [formData, setFormData] = useState(initialFormState);

    // --- 2. EFFECT HOOKS ---

    // This runs every time the modal opens or the 'editData' prop changes.
    // It determines if we are in "Edit Mode" (load existing data) or "Add Mode" (reset form).
    useEffect(() => {
        if (editData) {
            setFormData(editData); // Load existing data for editing
        } else {
           // Reset to clean state for adding a new case
           setFormData({
             ...initialFormState,
             posted_date: new Date().toLocaleDateString('en-GB')
           });
        }
        
        // CRITICAL: Always reset to Page 1 when reopening the modal
        setStep(1); 
    }, [editData, isOpen]);

    // --- 3. EVENT HANDLERS ---

    // Handles input changes for all text, select, and number inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            // Logic: If the field is an amount, ensure it is saved as a number (float), not a string.
            // This prevents math errors later in the backend.
            [name]: name === 'raisedAmount' || name === 'goalAmount'
                ? parseFloat(value) || 0
                : value
        }));
    };

    // Triggered when the user clicks "Save Changes" or "Add Case" on the final page (Step 3)
    const handleSubmit = (e) => {
        e.preventDefault(); // Stop the browser from refreshing
        
        // ==================================================================================
        // TODO: BACKEND TEAM - HANDLE FORM SUBMISSION
        // ==================================================================================
        // This function passes the gathered 'formData' back to the parent component (Admin.jsx).
        // The Parent component needs to handle the API calls:
        // 1. If 'editData' was present -> Send PUT/UPDATE request to MySQL.
        // 2. If 'editData' was null    -> Send POST/CREATE request to MySQL.
        // ==================================================================================
        
        onSubmit(formData); 
    };

    // --- 4. NAVIGATION LOGIC ---

    const handleNext = () => {
        setStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setStep(prevStep => prevStep - 1);
    };


    // --- 5. RENDER LOGIC ---

    // If modal is closed, render nothing to save performance
    if (!isOpen) return null;

    // Use a Portal to render this div at the end of the document.body.
    // This ensures the modal floats above all other content (z-index issues).
    return ReactDOM.createPortal(
        
        // Overlay: Clicking the dark background closes the modal
        <div className={styles['modal-overlay']} onClick={onClose}>
            
            {/* Content: Clicking inside the box stops the event from closing the modal */}
            <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                
                {/* Header: Dynamic Title and Step Indicator */}
                <div className={styles['modal-header']}>
                    <h2>
                        {editData ? 'Edit Case' : 'Add New Case'} 
                        <span className={styles['step-indicator']}> ( Step : {step} - {stepTitles[step]})</span>
                    </h2>
                    <button className={styles['close-btn']} onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles['modal-body']}>

                        {/* =========================================
                            PAGE 1: PATIENT  DETAILS
                           ========================================= */}
                        {step === 1 && (
                            <>
                                <div className={styles['form-group']}>
                                    <label htmlFor="patientName">Patient Name</label>
                                    <input
                                        type="text"
                                        id="patientName"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        placeholder="e.g., Kamal Fernando"
                                        required
                                    />
                                </div>


                                <div className={styles['form-group']}>
                                        <label htmlFor="address">Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="e.g., 123 Main Street, Colombo"
                                            required
                                        />
                                </div>

                                <div className={styles['form-row']}>
                                    <div className={styles['form-group']}>
                                        <label htmlFor="contact_phone">Phone</label>
                                        <input
                                            type="tel"
                                            id="contact_phone"
                                            name="contact_phone"
                                            value={formData.contact_phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+94123456789"
                                        />
                                    </div>
                                    <div className={styles['form-group']}>
                                        <label htmlFor="contact_email">Email</label>
                                        <input
                                            type="email"
                                            id="contact_email"
                                            name="contact_email"
                                            value={formData.contact_email}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., kamal@example.com"
                                        />
                                    </div>
                                </div>
                            </>
                        )}    


                        {/* =========================================
                            PAGE 2: CASE  DETAILS
                           ========================================= */}
                        {step === 2 && (
                            <>
                           <div className={styles['form-row']}>
                                    <div className={styles['form-group']}>
                                        <label htmlFor="health_issue">Health Issue</label>
                                        <input
                                            type="text"
                                            id="health_issue"
                                            name="health_issue"
                                            value={formData.health_issue}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Kidney Failure"
                                        />
                                    </div>

                                    <div className={styles['form-group']}>
                                        <label htmlFor="posted_date">Posted Date</label>
                                        <input
                                            type="text"
                                            id="posted_date"
                                            name="posted_date"
                                            value={formData.posted_date}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    
                            </div>


                            <div className={styles['form-group']}>
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Provide a detailed description of the health condition..."
                                    />
                            </div>

                            <div className={styles['form-row-3-columns']}>
                                    <div className={styles['form-group']}>
                                        <label htmlFor="raised">Raised Amount</label>
                                        <input
                                            type="number"
                                            id="raised"
                                            name="raisedAmount"
                                            value={formData.raisedAmount}
                                            onChange={handleChange}
                                            placeholder="e.g., 150000"
                                        />
                                    </div>
                                    <div className={styles['form-group']}>
                                        <label htmlFor="goal">Goal Amount</label>
                                        <input
                                            type="number"
                                            id="goal"
                                            name="goalAmount"
                                            value={formData.goalAmount}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., 500000"
                                        />
                                    </div>

                                    <div className={styles['form-group']}>
                                        <label htmlFor="status">Status</label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                    </div>
                            </div>
                            </>
                        )}

                        {/* =========================================
                            PAGE 3: BANKING DETAILS
                           ========================================= */}
                        {step === 3 && (
                            <>
                        
                                <div className={styles['form-row']}>
                                    <div className={styles['form-group']}>
                                        <label htmlFor="bank_name">Bank Name</label>
                                        <input
                                            type="text"
                                            id="bank_name"
                                            name="bank_name"
                                            value={formData.bank_name}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Bank of Ceylon"
                                        />
                                    </div>
                                    <div className={styles['form-group']}>
                                        <label htmlFor="branch">Branch</label>
                                        <input
                                            type="text"
                                            id="branch"
                                            name="branch"
                                            value={formData.branch}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Colombo Fort"
                                        />
                                    </div>
                                </div>
                                <div className={styles['form-group']}>
                                    <label htmlFor="account_holder">Account Holder</label>
                                    <input
                                        type="text"
                                        id="account_holder"
                                        name="account_holder"
                                        value={formData.account_holder}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Kamal Fernando"
                                    />
                                </div>
                                <div className={styles['form-group']}>
                                    <label htmlFor="account_number">Account Number</label>
                                    <input
                                        type="text"
                                        id="account_number"
                                        name="account_number"
                                        value={formData.account_number}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 1234567890"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* --- FOOTER with DYNAMIC BUTTONS --- */}
                    <div className={styles['modal-footer']}>

                        {/* Step 1: Show NEXT button only */}
                        {step === 1 && ( 
                         <div className={styles['button-section-admin']}>

                            <button type="button" className={styles['modal-btn-cancel']} onClick={onClose}>
                              Cancel
                            </button>

                            <button 
                                type="button" // Important: type="button" so it doesn't auto-submit the form
                                className={styles['modal-btn-next']} 
                                onClick={handleNext}
                            >
                                Next
                            </button>

                         </div>
                        )}

                        {/* Step 2: Show BACK and NEXT buttons */}
                        {step === 2 && ( 
                         <div className={styles['button-section-admin']}>
                            <button 
                                    type="button" 
                                    className={styles['modal-btn-back']} 
                                    onClick={handleBack}
                                >
                                    Back
                            </button>

                            <button 
                                type="button" // Important: type="button" so it doesn't auto-submit the form
                                className={styles['modal-btn-next']} 
                                onClick={handleNext}
                            >
                                Next
                            </button>
                         </div>
                        )}

                        {/* Step 3: Show BACK and SUBMIT buttons */}
                        {step === 3 && (
                            <div className={styles['button-section-admin']}>
                                <button 
                                    type="button" 
                                    className={styles['modal-btn-back']} 
                                    onClick={handleBack}
                                >
                                    Back
                                </button>
                                
                                <button 
                                    type="submit" // Triggers onSubmit={handleSubmit} on the <form> tag
                                    className={styles['modal-btn-submit']}
                                >
                                    {/* TODO: BACKEND TEAM
                                       The Text below changes based on mode, but the 'type="submit"' 
                                       always triggers the handleSubmit function defined above.
                                    */}
                                    {editData ? 'Save Changes' : 'Add Case'}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>,
        
        // Target container for the Portal
        document.body
    );
};

export default AdminForm;
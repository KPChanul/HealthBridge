import styles from './del.module.css';
import ReactDOM from 'react-dom';

/**
 * DeleteConfirm Component
 * -----------------------
 * A modal that asks for user confirmation before deleting a record.
 * @param {boolean} isOpen - Controls visibility of the modal.
 * @param {function} onClose - Function to close the modal without taking action.
 * @param {function} onConfirm - Function to trigger the actual delete logic (Backend API).
 * @param {string} patientName - Name of the patient to display in the warning message.
 */
const DeleteConfirm = ({ isOpen, onClose, onConfirm, patientName }) => {

    // 1. Early Return: If the modal is not flagged as open, render nothing.
    // This prevents the modal from existing in the DOM when not needed.
    if (!isOpen) return null;

    // 2. Portal: Renders the modal outside the parent DOM hierarchy (attached to document.body).
    // This ensures the modal overlays correctly regardless of parent z-index or overflow settings.
    return ReactDOM.createPortal(

        // Overlay: The dark background behind the modal.
        // Clicking this area triggers onClose to dismiss the modal (UX best practice).
        <div className={`${styles['modal-overlay']} ${styles['confirm-modal']}`} onClick={onClose}>

            {/* Content: The actual modal box. 
                e.stopPropagation() prevents clicks inside the box from bubbling up 
                and closing the modal via the overlay click handler above. 
            */}
            <div className={`${styles['modal-content']}`} onClick={(e) => e.stopPropagation()}>
                
                {/* Body: Displays the warning icon and the specific message */}
                <div className={`${styles['modal-body']}`}>
                    <div className={`${styles['warning-icon']}`}>⚠️</div>
                    <h3>Delete Case?</h3>

                    <p>
                        Are you sure you want to delete the case for <strong>{patientName}</strong>?&nbsp;
                        This action cannot be undone.
                    </p>
                </div>

                {/* Footer: Contains the primary action buttons */}
                <div className={`${styles['modal-footer']}`}>

                    {/* Cancel Action - Closes modal without changes */}
                    <button className={`${styles['modal-btn']} ${styles.cancel}`} onClick={onClose}>
                        Cancel
                    </button>

                    {/* ===================================================================
                        TODO: BACKEND TEAM - IMPLEMENT DELETE FUNCTIONALITY
                        ===================================================================
                        1. The 'onClick' event below currently calls 'onConfirm'.
                        2. You must ensure the Parent Component passes a function to 'onConfirm'
                           that performs the DELETE request to the PHP/SQL backend.
                        3. Once the promise/fetch resolves, the parent should close this modal.
                    */}
                    <button 
                        className={`${styles['modal-btn']} ${styles.delete}`} 
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>

            </div>

        </div>,

        // Target container for the Portal
        document.body
    );
};

export default DeleteConfirm;
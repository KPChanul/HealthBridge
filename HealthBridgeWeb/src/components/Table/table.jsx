import DeleteConfirm from '../DeleteWarning/del';
import styles from './table.module.css';
import { useState } from 'react';
import AdminForm from '../Admin_Form/Admin_form';

/**
 * CaseTable Component
 * -------------------
 * Displays a sortable/filterable table of cases.
 * Handles the logic for opening the "Edit" and "Delete" modals.
 * @param {Array} cases - The list of case objects to display.
 * @param {Function} onEdit - (Optional) Prop function to trigger parent update logic.
 * @param {Function} onDelete - (Optional) Prop function to trigger parent delete logic.
 */
const CaseTable = ({ cases, onEdit, onDelete}) => {

    // --- STATE MANAGEMENT ---

    // State to control the visibility of the delete confirmation modal
    // Stores the entire case object to be deleted (or null if modal is closed)
    const [deleteTarget, setDeleteTarget ] = useState(null);

    // Store the case data to be edited (or null if modal is closed)
    const [editTarget, setEditTarget] = useState(null);


    // --- HELPER FUNCTIONS ---

    // 1. Helper for Currency: Formats numbers to LKR (e.g., "LKR 1,500.00")
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0
        }).format(amount);
    };

    // 2. Helper for Progress Bar: Calculates percentage (0-100)
    const getProgressPercentage = (raised, goal) => {
        // Ensure we are working with numbers using Number()
        const r = Number(raised) || 0;
        const g = Number(goal) || 0;
        if (g === 0) return 0;
        return Math.min(Math.round((r / g) * 100), 100);
    };

    // 3. Helper for Status Label
    // Transforms database logic (is_urgent boolean, math) into UI labels ('Active', 'Urgent', 'Fulfilled')
    const getStatus=(item)=>{
        if(Number(item.raised)>=Number(item.goal)) return 'Fulfilled';
        if(item.is_urgent==1) return 'Urgent';
        return 'Active';
    };

    // --- DATA MAPPING HANDLER ---

    // Prepares the database data to fit the specific format required by the AdminForm
    const handleEditClick = (caseData) => {

        const formattedData = {
            ...caseData, // Copy existing IDs and matching fields (like health_issue, email)
            
            // Map the mismatched fields between DB and Form State:
            patientName: caseData.patient_name,
            branch: caseData.bank_branch,
            raisedAmount: caseData.raised,
            goalAmount: caseData.goal,
            
            // Convert database status (0/1) to Form status ('Active'/'Urgent')
            status: caseData.is_urgent == 1 ? 'Urgent' : 'Active' 
        };

        setEditTarget(formattedData);
    };

    // --- RENDER LOGIC ---

    return(
        <div className={styles["cases-table-container"]}>
            <table className={styles["cases-table"]}>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Condition</th>
                        <th>Status</th>
                        <th>Address</th>
                        <th>Progress</th>
                        <th>Raised / Goal</th>
                        <th>Posted Date</th>
                        <th>Contact</th>
                        <th>Bank Name</th>
                        <th>Bank Branch</th>
                        <th>Account Holder</th>
                        <th>Account Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {cases.length > 0 ? (
                    
                    cases.map((caseData) => {

                        // Calculate status for this specific row
                        const status = getStatus(caseData);

                        return(
                        <tr key={caseData.id}>
                            <td className={styles["patient-name-cell"]}>{caseData.patient_name}</td>
                            <td>{caseData.health_issue}</td>
                            <td>
                                <span className={styles[`status-badge ${status.toLowerCase()}`]}>
                                {status}
                                </span>
                            </td>
                            <td>{caseData.address}</td>

                            <td>
                                <div className={styles["progress-cell"]}>
                                    <div className={styles["progress-bar-mini"]}>
                                        <div 
                                        className={styles["progress-fill-mini"]}
                                        style={{ width: `${getProgressPercentage(caseData.raised, caseData.goal)}%` }}
                                        >
                                        </div>
                                    </div>
                                    <span className={styles["progress-text"]}>
                                        {getProgressPercentage(caseData.raised, caseData.goal)}%
                                    </span>
                                </div>
                            </td>

                            <td className={styles["amount-cell"]}>
                                <span className={styles["raised-amount"]}>{formatCurrency(caseData.raised)}</span>
                                <span className={styles["goal-amount"]}> / {formatCurrency(caseData.goal)}</span>
                            </td>

                            <td>{caseData.posted_date}</td>

                            <td className={styles["contact-cell"]}>
                                <div>{caseData.contact_phone}</div>
                                <div className={styles["email-text"]}>{caseData.contact_email}</div>
                            </td>
                            <td>{caseData.bank_name}</td>
                            <td>{caseData.bank_branch}</td>
                            <td>{caseData.account_holder}</td>
                            <td>{caseData.account_number}</td>

                            <td className={styles["actions-cell"]}>
                                <button className={styles["table-edit-btn"]} onClick={() => handleEditClick(caseData)}>
                                    Edit
                                </button>
                                <button className={styles["table-delete-btn"]} onClick={() => setDeleteTarget(caseData)}>
                                    Delete
                                </button>
                            </td>

                        </tr>
                        );
                    })

                    ):( 
                        <tr>
                            <td colSpan="13" className="no-data-cell">
                               <center>No cases match your current search criteria.</center>
                            </td>
                        </tr>
                      ) }
                </tbody>
            </table>

            {/* --- MODALS SECTION --- */}
            {/* These components are only rendered when their respective State is not null */}

            {editTarget && <AdminForm
                isOpen={true}
                onClose={() => setEditTarget(null)}
                editData={editTarget}

                // =================================================================
                // TODO: BACKEND TEAM - CONNECT EDIT FUNCTIONALITY
                // =================================================================
                // When the form is submitted, this function is triggered.
                // You need to take 'updatedData' and send a PUT request to the API.
                onSubmit={(updatedData) => {
                    console.log("Saving Changes...", updatedData);
                    // 1. Call API to update record
                    // 2. Refresh Table Data
                    setEditTarget(null); // Close modal on success
                }}
                />
            }


            {deleteTarget && <DeleteConfirm
                isOpen={true}
                onClose={() => setDeleteTarget(null)}
                patientName={deleteTarget.patient_name}

                // =================================================================
                // TODO: BACKEND TEAM - CONNECT DELETE FUNCTIONALITY
                // =================================================================
                // When "Delete" is clicked in the popup, this function is triggered.
                // You need to take 'deleteTarget.id' and send a DELETE request.
                onConfirm={() => {
                    console.log("Deleting case ID:", deleteTarget.id);
                    // 1. Call API to delete record
                    // 2. Refresh Table Data
                    setDeleteTarget(null); // Close modal on success
                }}
                />
            }
        </div>
    )
}

export default CaseTable;
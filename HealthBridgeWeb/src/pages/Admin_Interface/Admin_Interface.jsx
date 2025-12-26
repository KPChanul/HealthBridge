import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../admin.jsx';
import CardInterface_Admin from '../../components/Cards_for_admin/card_for_admin.jsx'; 
import styles from './Admin_Interface.module.css';
import { Plus } from 'lucide-react';
import AdminHeader from '../../components/Header_for_admin/AdminHeader.jsx';
import AdminForm from '../../components/Admin_Form/Admin_form.jsx';
import CaseTable from '../../components/Table/table.jsx';


const CARDS_PER_PAGE = 6;

/**
 * Admin Interface (Parent Component)
 * ----------------------------------
 * This is the main dashboard controller.
 * Responsibilities:
 * 1. Fetching all data from the database (READ).
 * 2. Managing global state (view mode, search filters, pagination).
 * 3. Handling the "Add New Case" logic (CREATE).
 */
const Admin = ({ onLogOut }) => {
    const { adminId } = useContext(AdminContext);
    
    // --- STATE MANAGEMENT ---

    const [viewMode, setViewMode] = useState('card'); // Toggle between 'card' or 'table'
    const [showAddForm, setShowAddForm] = useState(false); // Controls "Add Case" modal visibility

    // Data States
    const [data, setData] = useState([]); // Holds raw data from API
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 

    // UI States (Pagination & Filtering)
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'urgent', 'fulfilled'


    // Normalize data: Ensure 'cases' is always an array, even if API returns an object
    const cases = Array.isArray(data) ? data : (data?.data || []);
    
    // --- STATISTICS CALCULATION ---
    // Calculated on the fly based on the 'cases' array
    const totalCases = cases.length;
    const urgentCases = cases.filter(c => c.is_urgent == 1).length;
    const fulfilledCases = cases.filter(c => Number(c.raised) >= Number(c.goal)).length;

    // --- FILTERING LOGIC ---

    const filteredCases = cases.filter(c => {
        // 1. Filter by Status Buttons
        if (filter === 'urgent' && c.is_urgent != 1) return false;
        if (filter === 'fulfilled' && Number(c.raised) < Number(c.goal)) return false;

        // 2. Filter by Search Bar (Patient Name or Health Issue)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                c.patient_name.toLowerCase().includes(term) || 
                c.health_issue.toLowerCase().includes(term)
            );
        }
        return true;
    });

    // --- PAGINATION LOGIC ---

    const totalFilteredCases = filteredCases.length;
    const totalPages = Math.ceil(totalFilteredCases / CARDS_PER_PAGE);
    
    // Calculate start/end indices for slicing the array
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    
    // Determine the specific subset of cases to display on the current page
    const casesToDisplay = filteredCases.slice(startIndex, endIndex);

    // --- EFFECT HOOKS ---

    // Reset pagination to Page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filter]);


    // --- API: FETCH DATA (READ) ---
    // This is your EXISTING backend connection. It works!
    useEffect(() => {
        // Only attempt fetch when adminId is available
        if (!adminId ) {
            setError("Missing admin credentials. Please login.");
            setData([]);
            setLoading(false);
           return
        }

        
        setLoading(true);
        fetch("http://localhost/serverHB/admin.php", 
            { method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({
                admin_id: adminId,
                action:"get"
                })
            })
             .then(response => {
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return response.json();   
        })
        .then(json => {
            if (!json.success) {
                setError(json.message || "Failed to load cases");
                setData([]);
            } else {
                setData(json.data || []);
                setError(null);
            }
        })
        .catch(() => {
            setError("Failed to fetch cases. Please try again later.");
            setData([]);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [adminId]);

    // --- PAGINATION HANDLER ---
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    // --- RENDER HELPERS ---
    
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; 
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Previous Button
        pageNumbers.push(
            <span key="prev" onClick={() => handlePageChange(currentPage - 1)} className={`pagination-item ${currentPage === 1 ? 'disabled' : 'active'}`}>&lt; Previous</span>
        );

        // Numbered Buttons
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <span key={i} onClick={() => handlePageChange(i)} className={`pagination-item ${i === currentPage ? 'current' : 'page-number'}`}>{i}</span>
            );
        }

        // Next Button
        pageNumbers.push(
            <span key="next" onClick={() => handlePageChange(currentPage + 1)} className={`pagination-item ${currentPage === totalPages ? 'disabled' : 'active'}`}>Next &gt;</span>
        );
        return pageNumbers;
    };


    return(
        
        <>
        {/* Top Navigation Header */}
        <AdminHeader 
            onLogOut={onLogOut}
            currentView={viewMode}
            onViewChange={setViewMode}
        />
        
        <main className={styles.page}>

            {/* Dashboard Controls: Filters, Search, Add Button */}
            <div className={styles['dashboard-controls']}>
                
                <div className={styles['filter-button-container']}>
                    <button 
                        onClick={() => setFilter('all')} 
                        className={`${styles.allCasesBtn} ${filter === 'all' ? styles.active : ''}`}
                    >
                        All Cases ({totalCases})
                    </button>
                    <button 
                        onClick={() => setFilter('urgent')} 
                        className={`${styles.urgentCasesBtn} ${filter === 'urgent' ? styles.active : ''}`}
                    >
                        Urgent Cases ({urgentCases})
                    </button>
                    <button 
                        onClick={() => setFilter('fulfilled')} 
                        className={`${styles.fullfilledCasesBtn} ${filter === 'fulfilled' ? styles.active : ''}`}
                    >
                        Fulfilled Cases ({fulfilledCases})
                    </button>
                </div>

                <input 
                    className={styles['search-input']}
                    type="text"
                    placeholder="Search by Patient Name or Condition..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>
                        <Plus /> Add New Case
                </button>

                {/* --- ADD NEW CASE MODAL --- */}
                {showAddForm && (
                    <AdminForm 
                        isOpen={showAddForm}
                        onClose={() => setShowAddForm(false)} 
                        
                       
                        // This function receives the data from the form when "Add Case" is clicked.
                        onSubmit={async (newCaseData) => {
                            // Close modal and post to server, then refresh list
                            try{
                            
                            setLoading(true);
                            
                            
                                
                                const payload = {
                                    admin_id: adminId,
                                    action: "create",
                                    patient_name: newCaseData.patient_name,
                                    health_issue: newCaseData.health_issue,
                                    description: newCaseData.description,
                                    is_urgent: newCaseData.is_urgent || 0,
                                    raised: newCaseData.raised || 0,
                                    goal: newCaseData.goal || 0,
                                    address: newCaseData.address,
                                    contact_phone: newCaseData.contact_phone,
                                    contact_email: newCaseData.contact_email,
                                    bank_name: newCaseData.bank_name,
                                    bank_branch: newCaseData.bank_branch,
                                    account_holder: newCaseData.account_holder,
                                    account_number: newCaseData.account_number
                                };

                                const resp = await fetch('http://localhost/serverHB/admin.php', {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                });

                                if (!resp.ok) throw new Error(`Server Error`);
                                const json = await resp.json();

                                if (!json.success) {
                                    setError(json.message || 'Failed to create case');
                                } 
                                
                                    
                            }
                            
                            
                            

                            catch (err) {
                                setError('Failed to create case. Please try again.');
                            } finally {
                                setLoading(false);
                                setShowAddForm(false);
                                
                            }
                        }}
                    />
                )}
            </div>
            
            {/* Status Messages */}
            { error ? (
                    <p className={styles['filter-details-count']}>{error}</p>
                ) : (
                    <p className={styles['filter-details-count']}>
                        Showing {filteredCases.length} result{filteredCases.length !== 1 ? "s" : ""}.
                    </p>
                ) }

            {/* --- MAIN CONTENT AREA --- */}
            
            {viewMode === 'card' ? (
                // --- CARD VIEW ---
                (filteredCases.length === 0 && error==null)? (
                    <p style={{ marginTop: '50px', fontSize: '1.2rem', color: '#555' }}>
                    No cases match the current criteria.
                    </p>
                ):
                (filteredCases.length === 0 && error!=null)?(
                  <p style={{ marginTop: '50px', fontSize: '1.2rem', color: '#555' }}>
                    {error}
                    </p>  
                ):
                 (
                    <>
                    <div className={styles['cases-grid-view']}>
                        {casesToDisplay.map((caseItem) => (
                        <CardInterface_Admin
                            key={caseItem.id}
                            post_id={caseItem.id}
                            patientName={caseItem.patient_name}
                            healthIssue={caseItem.health_issue}
                            isurgent={caseItem.is_urgent}
                            goal={caseItem.goal}
                            raised={caseItem.raised}
                            address={caseItem.address}
                            postedDate={caseItem.posted_time.split(' ')[0]|| ''}
                            contactPhone={caseItem.contact_phone}
                            contactEmail={caseItem.contact_email}
                            description={caseItem.description}
                            isFulfilled={Number(caseItem.raised) >= Number(caseItem.goal)}
                            bankName={caseItem.bank_name || ''} 
                            branch={caseItem.bank_branch || ''}
                            accountHolder={caseItem.account_holder || ''}
                            accountNumber={caseItem.account_number || ''}
                        />
                        ))}
                    </div>

                    {/* Pagination for Card View */}
                    {totalPages > 1 && (
                        <div className={styles['pagination-container']}>
                        {renderPageNumbers()}
                        </div>
                    )}
                    </>
                )
                ) : (
                // --- TABLE VIEW ---
                <div>
                    <CaseTable 
                        cases={casesToDisplay} 
                    />

                    {/* Pagination for Table View */}
                    {totalPages > 1 && (
                        <div className={styles['pagination-container']}>
                        {renderPageNumbers()}
                        </div>
                    )}
                </div>
                )}
                
        </main>
        
        </>
    )
};

export default Admin;
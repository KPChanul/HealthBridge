import {useState,useEffect} from 'react';
import CardInterface from '../../components/Cards/card';
import './Donation.css';
import Footer  from '../../components/Footer/Footer.jsx';
import Header from "../../components/header/Header";



const CARDS_PER_PAGE = 6;

function Donations(){

    // --- State Management ---
    
    
    const [data, setData] = useState([]); // state to hold data
    const [loading, setLoading] = useState(false); // loading state
    const [error, setError] = useState(null); // error state

    // State to track the currently active page number for pagination
    const [currentPage, setCurrentPage] = useState(1);

    // State to hold the text entered in the search bar
    const [searchTerm, setSearchTerm] = useState('');

    // State to track the active filter ('all' or 'urgent')
    const [filter, setFilter] = useState('all');

    // ---fletching data from sql ---

  useEffect(() => {
        // Fetch data from PHP backend
        setLoading(true);
        fetch("http://localhost/serverHB/get_cases.php")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Connection issue. Check your internet connection.");
                }
                return response.json();
            })
            .then((resp) => {
                // Backend may return either an array directly or an object { data: [...] }
                const fetched = Array.isArray(resp) ? resp : (resp?.data || []);
                setData(fetched);
                setError(null);
            })
            .catch((err) => {
                setError("Failed to fetch cases. Please try again later.");
                setData([]); // ensure state is an array
            })
            .finally(() => {
                setLoading(false);
            });
  }, []);
  
  




    // Derived `cases` array (normalize state shape)
    const cases = Array.isArray(data) ? data : (data?.data || []);
    
    // --- Data Calculation ---

    // Calculate the total number of cases in the original data set
    const totalCases = cases.length;

    // Calculate the total number of urgent cases for the filter button count
    const urgentCases = cases.filter(c => c.is_urgent==1).length;

    // Calculate the total number of fulfilled cases
    const fulfilledCases = cases.filter(c => Number(c.raised) >= Number(c.goal)).length;

    // --- Filtering Logic ---

    // Apply filtering based on the current state (filter and searchTerm)
    const filteredCases = cases.filter(c => {
        // 1. Filter by 'urgent' status: If 'urgent' filter is active AND the case is NOT urgent, exclude it.
        if (filter === 'urgent' && c.is_urgent!=1) {
            return false;
        }

        // Filter by 'fulfilled' status:
        if (filter === 'fulfilled' && Number(c.raised) < Number(c.goal)) {
            return false;
        }

        // 2. Filter by search term: If a search term exists AND the patient name does NOT include the term, exclude it.
        if (searchTerm) {
            return c.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
        }

        // If the case passed the filters, include it.
        return true;
    });

    // --- Pagination Logic ---

    // Total number of cases after filtering/searching
    const totalFilteredCases = filteredCases.length;

    // Calculate the total number of pages required (e.g., 15 cases / 6 per page = 3 pages)
    const totalPages = Math.ceil(totalFilteredCases / CARDS_PER_PAGE);

    // Calculate the starting index (e.g., Page 2 starts at index 6 if CARDS_PER_PAGE is 6)
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;

    // Calculate the ending index (e.g., Page 2 ends at index 12)
    const endIndex = startIndex + CARDS_PER_PAGE;

    // Slice the filtered array to get only the cases for the current page
    
    const casesToDisplay = filteredCases.slice(startIndex, endIndex);

    // --- Effects & Handlers ---

    // Effect to reset the current page to 1 whenever the search term or filter changes.
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filter]);

    // Handler function to change the page number
    const handlePageChange = (page) => {
        // Only allow navigation to valid pages
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll the window slightly down to keep the cards in view after navigation
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    // --- Render Helper Function for Pagination Controls ---
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Maximum number of page links to show (e.g., 1, 2, 3, 4, 5)

        // Determine the starting page number to keep the current page centered in the control strip
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        
        // Determine the ending page number
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Adjust start page if we are near the end of the total pages
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Previous button rendering
        pageNumbers.push(
            <span
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                // Disable button if on the first page
                className={`pagination-item ${currentPage === 1 ? 'disabled' : 'active'}`}
            >
                &lt; Previous
            </span>
        );

        // Render the calculated block of page numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <span
                    key={i}
                    onClick={() => handlePageChange(i)}
                    // Highlight the current page number
                    className={`pagination-item ${i === currentPage ? 'current' : 'page-number'}`}
                >
                    {i}
                </span>
            );
        }

        // Next button rendering
        pageNumbers.push(
            <span
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                // Disable button if on the last page
                className={`pagination-item ${currentPage === totalPages ? 'disabled' : 'active'}`}
            >
                Next &gt;
            </span>
        );

        return pageNumbers;
    };

   

    return(

        <>
        <Header/>

        
        <main className="page">
            <h1 className='topic'>Active Cases</h1>
            <p className='para'>Stand with these families. Even the smallest gift creates powerful momentum.</p>
            

            {/*Search Bar*/}
            <input 
                className='search-input'
                type="text"
                placeholder="Search case by Patient Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
    
            />

            
            {/* Filter Buttons */}

            <div className="filter-button-container">
                <button 
                    onClick={() => setFilter('all')}
                    style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', fontWeight: 'bold', backgroundColor: filter === 'all' ? '#007bff' : '#d0e0ff', color: filter === 'all' ? 'white' : '#007bff', cursor: 'pointer', transition: '0.2s' }}>
                    All Cases ({totalCases})
                </button>


                <button 
                    onClick={() => setFilter('urgent')}
                    style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', fontWeight: 'bold', backgroundColor: filter === 'urgent' ? '#ff9933' : '#ffebd8', color: filter === 'urgent' ? 'white' : '#ff9933', cursor: 'pointer', transition: '0.2s' }}>
                    Urgent Cases ({urgentCases})
                </button>

                {/* NEW FULFILLED CASES BUTTON */}
                <button 
                    onClick={() => setFilter('fulfilled')}
                    style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', fontWeight: 'bold', backgroundColor: filter === 'fulfilled' ? '#28a745' : '#e6ffed', color: filter === 'fulfilled' ? 'white' : '#28a745', cursor: 'pointer', transition: '0.2s' }}>
                    Fulfilled Cases ({fulfilledCases})
                </button>

            </div>
            
                                { error ? (
                                        <p className='filter-details-count'>{error}</p>
                                    ) : (
                                        <p className='filter-details-count'>
                                            showing {filteredCases.length} result{filteredCases.length !== 1 ? "s" : ""}.
                                        </p>
                                    ) }
                {filteredCases.length==0?(
                    <p style={{ marginTop: '50px', fontSize: '1.2rem', color: '#555' }}>No cases match the current criteria.</p>
                ):(
                <div className="cases-grid-view">
                    {casesToDisplay.map((caseItem)=>(
                        <CardInterface 
                        
                        key={caseItem.id}
                        patientName={caseItem.patient_name}
                        healthIssue={caseItem.health_issue}
                        isurgent={caseItem.is_urgent}
                        goal={caseItem.goal}
                        raised={caseItem.raised}
                        address={caseItem.address}
                        postedDate={caseItem.posted_date}
                        contactPhone={caseItem.contact_phone}
                        contactEmail={caseItem.contact_email}
                        description={caseItem.description}

                        // NEW PROP: Calculate the fulfillment status and pass it
                        isFulfilled={Number(caseItem.raised) >= Number(caseItem.goal)}
                        
                        />

                    ))}
                </div> 
                )}

                {totalPages > 1 && (
                <div className="pagination-container">
                    {renderPageNumbers()}
                </div>
            )}

            

        </main>
        <Footer />
        </>
    )
};


export default Donations












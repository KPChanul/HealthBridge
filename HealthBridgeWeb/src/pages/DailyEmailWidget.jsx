// components/DailyEmailWidget.jsx
import React, { useState } from 'react';

const DailyEmailWidget = () => {
    const [isSending, setIsSending] = useState(false);
    const [showModal, setShowModal] = useState(false); // Controls the popup

    // 1. Initial Click: Opens the "Are you sure?" popup
    const handleInitialClick = () => {
        setShowModal(true);
    };

    // 2. Confirmed: User clicked "Yes" in the popup
    const confirmSend = async () => {
        setShowModal(false); // Close popup
        setIsSending(true);  // Start loading

        try {
            // Note: I kept your specific URL here
            const response = await fetch('http://localhost/ServerHB/send_daily_emails.php');
            const data = await response.json();

            if (data.success) {
                alert(`✅ Success! ${data.message}`);
            } else {
                alert(`⚠️ Notice: ${data.message}`);
            }

        } catch (error) {
            console.error("Error sending emails:", error);
            alert("❌ Error: Could not connect to the server.");
        } finally {
            setIsSending(false);
        }
    };

    // 3. Cancelled: User clicked "Cancel"
    const cancelSend = () => {
        setShowModal(false);
    };

    return (
        <>
            {/* --- THE WIDGET CARD --- */}
            <div style={styles.container}>
                <div style={styles.header}>
                    <h3 style={styles.title}>📢 Email Notification Center</h3>
                </div>
                
                <p style={styles.description}>
                    This tool collects all <strong>pending</strong> cases created today and sends a single summary email to all subscribers.
                </p>

                <button 
                    onClick={handleInitialClick} 
                    disabled={isSending}
                    style={{
                        ...styles.button,
                        backgroundColor: isSending ? '#ccc' : '#6c5ce7', // Purple color
                        cursor: isSending ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isSending ? "Sending Emails..." : "Send Daily Updates Now"}
                </button>
                
                <p style={styles.footer}>
                    Recommended: Use this once at the end of the day.
                </p>
            </div>

            {/* --- THE CUSTOM CENTERED POPUP (MODAL) --- */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalBox}>
                        <h3 style={{marginTop: 0, color: '#2d3436'}}>⚠️ Confirm Action</h3>
                        <p style={{color: '#636e72'}}>
                            Are you sure you want to send the daily email digest to all subscribers?
                        </p>
                        <div style={styles.modalButtons}>
                            <button onClick={cancelSend} style={styles.cancelBtn}>Cancel</button>
                            <button onClick={confirmSend} style={styles.confirmBtn}>Yes, Send Emails</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// --- STYLES ---
const styles = {
    // Widget Styles (Preserved)
    container: {
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
    },
    header: { marginBottom: '10px', borderBottom: '2px solid #6c5ce7', paddingBottom: '5px' },
    title: { margin: 0, color: '#2d3436', fontSize: '18px' },
    description: { color: '#636e72', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' },
    button: { width: '100%', padding: '12px', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.3s' },
    footer: { marginTop: '15px', fontSize: '12px', color: '#b2bec3', textAlign: 'center' },

    // --- NEW MODAL STYLES ---
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
        display: 'flex',
        justifyContent: 'center', // Centers horizontally
        alignItems: 'center',     // Centers vertically
        zIndex: 1000
    },
    modalBox: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        width: '350px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        textAlign: 'center'
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px'
    },
    cancelBtn: {
        padding: '10px 20px',
        border: '1px solid #ccc',
        backgroundColor: 'blue',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    confirmBtn: {
        padding: '10px 20px',
        border: 'none',
        backgroundColor: '#d63031', // Red for caution
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default DailyEmailWidget;
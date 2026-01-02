// components/DailyEmailWidget.jsx
import React, { useState } from 'react';

const DailyEmailWidget = () => {
    const [isSending, setIsSending] = useState(false);

    const handleSendDailyEmails = async () => {
        // Confirmation dialog (Safety check)
        if (!window.confirm("Are you sure you want to send the daily email digest to all subscribers?")) {
            return;
        }

        setIsSending(true);

        try {
        
            const response = await fetch('http://localhost/HealthBridge/Server/send_daily_emails.php');
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

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>📢 Email Notification Center</h3>
            </div>
            
            <p style={styles.description}>
                This tool collects all <strong>pending</strong> cases created today and sends a single summary email to all subscribers.
            </p>

            <button 
                onClick={handleSendDailyEmails} 
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
    );
};

// Simple internal CSS styles for this component
const styles = {
    container: {
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        marginBottom: '10px',
        borderBottom: '2px solid #6c5ce7',
        paddingBottom: '5px'
    },
    title: {
        margin: 0,
        color: '#2d3436',
        fontSize: '18px'
    },
    description: {
        color: '#636e72',
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '20px'
    },
    button: {
        width: '100%',
        padding: '12px',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    },
    footer: {
        marginTop: '15px',
        fontSize: '12px',
        color: '#b2bec3',
        textAlign: 'center'
    }
};

export default DailyEmailWidget;
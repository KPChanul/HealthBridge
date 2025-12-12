import React, { useState, useEffect, useRef } from "react";
import styles from "./AdminHeader.module.css";
import { Bell, User, ChevronDown, LogOut, Lock, Eye, EyeOff } from 'lucide-react';

/**
 * AdminHeader Component
 * ---------------------
 * The top navigation bar for the Admin Dashboard.
 * * Responsibilities:
 * 1. Navigation: Toggles between Card and Table views.
 * 2. Status: Shows a static notification indicator.
 * 3. User Profile: A dropdown menu containing:
 * - Admin ID and Role.
 * - Password reveal toggle (for checking credentials).
 * - Logout functionality.
 * * @param {string} admin_id - The ID of the currently logged-in admin.
 * @param {string} admin_password - The current admin's password (must be passed securely).
 * @param {string} currentView - Current display mode ('card' or 'table').
 * @param {function} onViewChange - Callback to switch views.
 * @param {function} onLogOut - Callback to handle user logout.
 */
const AdminHeader = ({ admin_id, admin_password, currentView, onViewChange, onLogOut }) => {

    // --- STATE MANAGEMENT ---
    
    // Tracks if the profile dropdown menu is open or closed
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // State to toggle password visibility (masked vs plain text)
    const [showPassword, setShowPassword] = useState(false);

    // Ref to track the profile menu DOM element for click-outside detection
    const dropdownRef = useRef(null);

    // --- EFFECT: HANDLE CLICK OUTSIDE ---
    
    // Closes the dropdown menu if the user clicks anywhere outside of it.
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the dropdown exists AND the click target is NOT inside the dropdown...
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
                setShowPassword(false); // Security: Always re-mask password when menu closes
            }
        };

        // Bind the event listener to the entire document
        document.addEventListener("mousedown", handleClickOutside);
        
        // Cleanup: Remove listener when component unmounts to prevent memory leaks
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    // --- EVENT HANDLERS ---
    
    const toggleProfileMenu = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    // Prevent the menu from closing when clicking the specific "Eye" button
    const togglePasswordVisibility = (e) => {
        e.stopPropagation(); // Stop the click from bubbling up to the profileContainer
        setShowPassword(!showPassword);
    };

    return (
        <header className={styles.adminHeader}>
            
            {/* SECTION 1: TITLE */}
            <div className={styles.headerBrand}>
                <h1>Admin Control Panel</h1>
            </div>

            {/* SECTION 2: VIEW TOGGLES */}
            <nav className={styles.headerNav}>
                <button 
                    className={`${styles.navLink} ${currentView === 'card' ? styles.active : ''}`}
                    onClick={() => onViewChange('card')}
                >
                    Card View
                </button>    
                <button 
                    className={`${styles.navLink} ${currentView === 'table' ? styles.active : ''}`}
                    onClick={() => onViewChange('table')}
                >
                    Table View
                </button>
            </nav>

            {/* SECTION 3: ICONS & PROFILE */}
            <div className={styles.headerRightSide}>
                
                

                {/* Profile Dropdown Section */}
                {/* ref={dropdownRef} allows us to detect clicks inside/outside this box */}
                <div 
                    className={styles.profileContainer} 
                    onClick={toggleProfileMenu}
                    ref={dropdownRef} 
                >
                    {/* =========================================================
                        TODO: BACKEND TEAM - DYNAMIC AVATAR-Optional
                       =========================================================
                       Currently showing a static User icon.
                       Future Goal: Fetch and display the admin's profile picture.
                       Example: <img src={adminData.profile_url} alt="Admin" />
                    */}
                    <div className={styles.avatarCircle}>
                        <User size={20} />
                    </div>
                    
                    <ChevronDown size={16} className={styles.arrowIcon} />

                    {/* Dropdown Menu - Conditionally Rendered */}
                    {isProfileOpen && (
                        <div className={styles.dropdownMenu}>
                            <div className={styles.menuHeader}>
                                {/* =========================================================
                                    TODO: BACKEND TEAM - ADMIN DETAILS
                                   =========================================================
                                   Ensure 'admin_id' prop is populated from the actual session/database.
                                   If you have a 'Name' or 'Role' column in DB, pass it as a prop.
                                */}
                                <p className={styles.adminName}>Admin ID: {admin_id}</p>
                                <p className={styles.adminRole}>Administrator</p>
                            </div>
                            
                            <hr className={styles.divider} />
                            
                            {/* Password Indicator with Toggle */}
                            <div className={`${styles.menuItem} ${styles.passwordRow}`}>
                                <Lock size={16} />
                                
                                <span className={styles.passwordText}>
                                    {/* =========================================================
                                       TODO: BACKEND TEAM - SECURITY WARNING
                                       =========================================================
                                       1. Ensure the 'admin_password' prop is fetched over HTTPS.
                                       2. This is useful for admins to check their credentials, 
                                          but treat this data sensitivity carefully.
                                    */}
                                    {showPassword ? (admin_password || "No Password") : "••••••••"}
                                </span>
                                
                                <button 
                                    className={styles.eyeBtn} 
                                    onClick={togglePasswordVisibility}
                                    title={showPassword ? "Hide Password" : "Show Password"}
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>

                            {/* Logout Button */}
                            <button className={`${styles.menuItem} ${styles.logout}`} onClick={onLogOut}>
                                <LogOut size={16} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>    

        </header>
    );
};

export default AdminHeader;
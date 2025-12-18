import Login from '../components/login/login.jsx';
import Admin from "./admin.interface.jsx"
import SysAdmin from './sysadmin.interface.jsx';
import { useState, useEffect } from 'react'; // Import useEffect

const USER_STORAGE_KEY = 'healthbridge_admin_user';

function AdminPage() {

    // 1. INITIAL STATE: Check Local Storage first. If data exists, use it. 
    //    If not, use the default logged-out state ({ role: "login" }).
    const getInitialUser = () => {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        try {
            return storedUser ? JSON.parse(storedUser) : { role: "login" };
        } catch (e) {
            console.error("Failed to parse user data from storage", e);
            return { role: "login" };
        }
    };
    
    const [user, setUser] = useState(getInitialUser);

    // 2. SIDE EFFECT: Whenever the 'user' state changes, update Local Storage.
    useEffect(() => {
        // Save the current user object (including role and data) to local storage
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }, [user]); // Run this effect only when the 'user' state changes

    // Function to handle the successful login (updates state and triggers useEffect to save)
    const handleLoginSuccess = (data) => {
        setUser(data);
    };

    // FIX: Function to handle the logout logic correctly
    const handleLogOut = () => {
        // Clear Local Storage first
        localStorage.removeItem(USER_STORAGE_KEY);
        // Reset state to force re-render and go to login page
        setUser({ role: "login" }); 
    };

    return (
        <>
            {/* If role is "login" → show the Login page */}
            {user.role === "login" && (
                <Login 
                    onLoginSuccess={handleLoginSuccess} 
                />
            )}

            {/* If role is "admin" → show Admin interface */}
            {user.role === "admin" && 
                <Admin 
                    admin_id={user.admin_id} 
                    onLogOut={handleLogOut} 
                /> 
            }

            {/* If role is "sysadmin" → show System Admin interface */}
            {user.role === "sysadmin" && 
                <SysAdmin 
                    onLogOut={handleLogOut} 
                />
            }
        </>
    );
}

export default AdminPage;
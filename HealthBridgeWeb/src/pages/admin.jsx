//make a login frame. if it is sys admin find the pasword is correct then remove login.jsx and disply sysadmin.jsx 
//if it is noraml admin and password is correct remove login.jsx and disply admin.jsx acording to admin's data
import React, { useEffect,createContext, useState } from 'react';
import Login from '../components/login/login.jsx';
import Admin from "../pages/Admin_Interface/Admin_Interface.jsx";
import SysAdmin from './sysadmin.interface.jsx';

export const AdminContext = createContext(null);

function AdminPage() {

    // user role and credentials
    const [role, setRole] = useState( "login");

    // separate adminId state (exposed via context)
    const [adminId, setAdminId] = useState(null);
    


    //this triggerevery time the window refresh
    useEffect(() => {
        const saved = sessionStorage.getItem("auth");
        if (saved) {
            const parsed = JSON.parse(saved);
            setRole(parsed.role);
            setAdminId(parsed.adminId);
            
        }
    }, []);
    //update the last task column in session table  per every 2min
    useEffect(() => {
        const interval = setInterval(async () => {
            if ( adminId) {
                try {
                    const res = await fetch("http://localhost/serverHB/refresh_sessions.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ admin_id: adminId })
                    });
                    const data = await res.json();
                    if (!data.success) {
                        // Session expired → log out frontend
                        sessionStorage.removeItem("auth");
                        setRole("login");
                        setAdminId(null);
                        
                    }
                } catch (err) {
                    console.error("Session refresh failed", err);
                }
            }
        }, 2 * 60 * 1000); // every 2 minutes

    return () => clearInterval(interval);
}, [ adminId]);

    const handleLoginSuccess = (data) => {
        setRole(data.role);
        setAdminId(data.adminId);
        
        sessionStorage.setItem("auth", JSON.stringify(data));
    };

    const handleLogOut = async () => {
        try {
            await fetch("http://localhost/serverHB/logout.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    admin_id: adminId
                    
                })
            });
            // Clear frontend state and local storage
            sessionStorage.removeItem("auth");
            setRole("login");
            setAdminId(null);
            
        } catch (err) {
            console.error("Logout request failed", err);
            // Even if request fails, still clear local state
        } 
    };

    return (
        <AdminContext.Provider value={{ adminId,    role }}>
            {/* If role is null → show the login page */}
            {role === "login" && (
                <Login handleLoginSuccess={handleLoginSuccess} />
            )}

            {/* If role is "admin" → show Admin interface */}
            {role === "admin" && <Admin onLogOut={handleLogOut} /> }

            {/* If role is "sysadmin" → show System Admin interface */}
            {role === "sysadmin" && 
                <SysAdmin 
                    onLogOut={handleLogOut} 
                />
            }
        </AdminContext.Provider>
    );
}

export default AdminPage;
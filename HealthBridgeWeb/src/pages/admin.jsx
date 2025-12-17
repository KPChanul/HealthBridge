//make a login frame. if it is sys admin find the pasword is correct then remove login.jsx and disply sysadmin.jsx 
//if it is noraml admin and password is correct remove login.jsx and disply admin.jsx acording to admin's data
import React, { createContext, useState } from 'react';
import Login from '../components/login/login.jsx';
import Admin from "../pages/Admin_Interface/Admin_Interface.jsx";
import SysAdmin from './sysadmin.interface.jsx';

export const AdminContext = createContext(null);

function AdminPage() {

    // user role and credentials
    const [role, setRole] = useState( "admin");

    // separate adminId/sessionID state (exposed via context)
    const [adminId, setAdminId] = useState(130002);
    const [sessionID, setSessionID] = useState("32145975eac37313cdf7230f04c9cb92d40970c89c95cdd961c8d877fcae632f");

    const handleLoginSuccess = (data) => {
        setRole(data.role);
        setAdminId(data.adminId);
        setSessionID(data.sessionID);
    };

    const handleLogOut = async () => {
        try {
            await fetch("http://localhost/serverHB/logout.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    admin_id: adminId,
                    session_id: sessionID
                })
            });
            // Clear frontend state
            setRole("login");
            setAdminId(null);
            setSessionID(null);
        } catch (err) {
            console.error("Logout request failed", err);
            // Even if request fails, still clear local state
        } 
    };

    return (
        <AdminContext.Provider value={{ adminId,  sessionID,  role }}>
            {/* If role is null → show the login page */}
            {role === "login" && (
                <Login handleLoginSuccess={handleLoginSuccess} />
            )}

            {/* If role is "admin" → show Admin interface */}
            {role === "admin" && <Admin onLogOut={handleLogOut} /> }

            {/* If role is "sysadmin" → show System Admin interface */}
            {role === "sysadmin" && <SysAdmin onLogOut={handleLogOut} />}
        </AdminContext.Provider>
    );
}

export default AdminPage
//make a login frame. if it is sys admin find the pasword is correct then remove login.jsx and disply sysadmin.jsx 
//if it is noraml admin and password is correct remove login.jsx and disply admin.jsx acording to admin's data
import Login from '../components/login/login.jsx';
import Admin from "./admin.interface.jsx"
import SysAdmin from './sysadmin.interface.jsx';
import { useState } from 'react';

function AdminPage() {

    // this state stores the logged-in user's data

    const [user, setUser] = useState({ role: "login" });

    return (
        <>
            {/* If role is null → show the login page */}
            {user.role === "login" && (
                <Login onLoginSuccess={(data) => setUser(data)} />
            )}

            {/* If role is "admin" → show Admin interface */}
            {user.role === "admin" && <Admin admin_id={user.admin_id}  onLogOut={() => useState({ role: "login" })}/> }

            {/* If role is "sysadmin" → show System Admin interface */}
            {user.role === "sysadmin" && <SysAdmin onLogOut={() => useState({ role: "login" })} />}
        </>
    );
}


export default AdminPage
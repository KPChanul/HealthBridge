//make a login frame. if it is sys admin find the pasword is correct then remove login.jsx and disply sysadmin.jsx 
//if it is noraml admin and password is correct remove login.jsx and disply admin.jsx acording to admin's data
import Login from '../components/login/login.jsx';
import Admin from "./admin.interface.jsx"
import SysAdmin from './sysadmin.interface.jsx';
import { useState } from 'react';

function AdminPage() {

    // this state stores the logged-in user's role

    const [role, setRole] = useState(null);

    return (
        <>
            {/* If role is null → show the login page */}
            {role === null && (
                <Login onLoginSuccess={(userRole) => setRole(userRole)} />
            )}

            {/* If role is "admin" → show Admin interface */}
            {role === "admin" && <Admin onLogOut={() => setRole(null)}/> }

            {/* If role is "sysadmin" → show System Admin interface */}
            {role === "sysadmin" && <SysAdmin onLogOut={() => setRole(null)} />}
        </>
    );
}


export default AdminPage
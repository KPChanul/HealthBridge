//make a login frame. if it is sys admin find the pasword is correct then remove login.jsx and disply sysadmin.jsx 
//if it is noraml admin and password is correct remove login.jsx and disply admin.jsx acording to admin's data
import Login from '../components/login/login.jsx';
import Admin from "./admin.interface.jsx"
import SysAdmin from './sysadmin.interface.jsx';


function AdminPage(){
    return(
    <><Login/></>
    )
}

export default AdminPage
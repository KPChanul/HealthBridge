import { useContext,useEffect, useState } from "react";
import axios from "axios";
import '../pagesCSS/sysAdmin.css';
import { AdminContext } from './admin.jsx';

// Define the API URL once
const API_URL = 'http://localhost/serverHB/sysAdmin.php';


function SysAdmin({onLogOut}){
    const { adminId, sessionID } = useContext(AdminContext);
    const [sessions, setSessions] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [inputs , setInputs] = useState({});
    const [editingId, setEditingId] = useState(null); 
    const [editInputs, setEditInputs] = useState({});


    //// Function to fetch data in session table
    function getSessions() {
    // We add ?type=sessions to the URL to trigger the PHP logic above
        axios.get(`${API_URL}?type=sessions`).then(function(response){
            if (Array.isArray(response.data)) {

                // Sort the array: compare B to A for descending order
                const sortedSessions = response.data.sort((a, b) => 
                new Date(b.start_time) - new Date(a.start_time)
                );

                setSessions(response.data);
            }
        }).catch(error => console.error("Error fetching sessions:", error));
    }

    // Function to fetch data in admins table
    function getUsers() {
        axios.get(API_URL).then(function(response){
            if (Array.isArray(response.data)) {
                setAdmins(response.data);
            } else {
                console.error("API response is not an array:", response.data);
                setAdmins([]);
            }
        })
        .catch(error => {
            console.error("Error fetching admin list:", error);
        });
    }

    // Fetch data on initial component mount
    useEffect(()=> {
        getUsers();
        getSessions();
    }, []);

    // Function for controlled input handling
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(values => ({...values, [name]: value}));
    }

    // Function to handle form submission (POST)
    const handleSubmit = (event) =>{
        event.preventDefault();
        
        axios.post(API_URL, inputs).then(function(response){
            console.log("POST Response:", response.data);
            
            if(response.data.status === 1) {
                alert("Admin created successfully!");
                getUsers(); 
                setInputs({}); 
            } else {
                 alert(`Failed to create admin: ${response.data.message}`);
            }
        })
        .catch(error => {
            console.error("Error posting data:", error);
            alert("An error occurred while connecting to the server.");
        });
    }


    //function for delete option
    const handleDelete = (adminId) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) {
            return;
        }

        axios.delete(API_URL, { data: { admin_id: adminId } })
        .then(function(response){
            if(response.data.status === 1) {
                alert("Admin deleted successfully!");
                getUsers(); // Refresh the list
            } else {
                alert(`Failed to delete admin: ${response.data.message}`);
            }
        })
        .catch(error => {
            console.error("Error deleting data:", error);
            alert("An error occurred during deletion.");
        });
    }


    //function edit data
    // 1. Triggered when the 'Edit' button is pressed
    const handleEditClick = (user) => {
        setEditingId(user.admin_id);
        setEditInputs({ 
            admin_id: user.admin_id,
            name: user.name,
            password: '', 
        });
    };

    // 2. Handler for changes in the edit inputs
    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditInputs(values => ({...values, [name]: value}));
    };

    // 3. Handler for the UPDATE submission
    const handleUpdate = (event) => {
        event.preventDefault();

        // Check for basic input validity
        if (!editInputs.name || !editInputs.password) {
            alert("Name and Password are required for update.");
            return;
        }

        axios.put(API_URL, editInputs)
        .then(function(response){
            if(response.data.status === 1) {
                alert("Admin updated successfully!");
                setEditingId(null); // Exit edit mode
                setEditInputs({});  // Clear edit state
                getUsers();         // Refresh the list
            } else {
                alert(`Failed to update admin: ${response.data.message}`);
            }
        })
        .catch(error => {
            console.error("Error updating data:", error);
            alert("An error occurred during update.");
        });
    };





return(
    <>
    
    <button className="sysAdminlogOut" onClick={onLogOut}>Log Out</button> 

    <div className="dataInDataBase">
        <h2 className="adminAccTopiv">Admin Accounts</h2>
        <table>
            <thead>
                <tr className="firstRow">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Last-Logged-In</th>
                    <th colSpan="2">Action</th>
                </tr>
            </thead>
            <tbody>
                {admins.map((user) => (
                    <tr key={user.admin_id}> 
                        {editingId === user.admin_id ? (
                            // edit mode row
                            <td colSpan="5">
                                <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <span>ID: {user.admin_id}</span>
                                    <input type="text" name="name" value={editInputs.name || ''} onChange={handleEditChange} required placeholder="Name"/>
                                    {/* For update, require a new password or blank for no change */}
                                    <input type="password" name="password" value={editInputs.password || ''} onChange={handleEditChange} required placeholder="New Password"/> 
                                    <button type="submit" className="saveButton">Save</button>
                                    <button type="button" onClick={() => setEditingId(null)} className="cancelButton">Cancel</button>
                                </form>
                            </td>
                        ) : (
                            // display mode row
                            <><td>{user.admin_id}</td>
                                <td>{user.name}</td>
                                <td>{user.last_logged_in}</td>
                                <td>
                                    {user.admin_id === 1 ? (
                                        <span>&nbsp;</span>
                                    ) : (
                                        
                                        <button className="editButton" onClick={() => handleEditClick(user)}>Edit</button>

                                    )}
                                    
                                </td>
                                <td>
                                    {user.admin_id ===1 ? (
                                        <span>&nbsp;</span>
                                    ) : (

                                        <button className="deleteButton" onClick={() => handleDelete(user.admin_id)}>Delete</button>

                                    )}
                                    
                                </td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>


    <div className="addData">
        <h2 className="addTopic">Add New Admin</h2>
        <form onSubmit={handleSubmit}>
            <table cellSpacing="10">
                <tbody>
                    <tr>
                        <th><label htmlFor="name">Admin-Name:</label></th>
                        <td>
                            <input placeholder="Create Admin Name" type="text" name="name" id="name" value={inputs.name || ''} onChange={handleChange} required/>
                        </td> 
                    </tr>
                    <tr>
                        <th><label htmlFor="password">Password:</label></th>
                        <td>
                            <input placeholder="Create Password" type="password" name="password" id="password" value={inputs.password || ''} onChange={handleChange} required/>
                        </td> 
                    </tr>
                    <tr>
                        <td colSpan="2" align="right">
                            <button className="dataButtonSave" type="submit">Save</button>
                        </td> 
                    </tr>
                </tbody>
            </table>
        </form>
    </div>



    <div className="sessionData">
        <h2 className="adminAccTopiv">Admin Sessions</h2>
        <table>
            <thead>
                <tr className="firstRow">
                    <th>Admin ID</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                </tr>
            </thead>
            <tbody>
                {sessions.length > 0 ? (
                    sessions.map((session, index) => (
                        <tr key={index}>
                            <td>{session.admin_id}</td>
                            <td>{session.start_time}</td>
                            <td>{session.end_time || "Active"}</td>
                        </tr>
                    ))
            ) : (
                <tr><td colSpan="3">No session data available</td></tr>
            )}
            </tbody>
        </table>
    </div>

    <div className="extraSpace">
            
    </div>




    </>
    )
}

export default SysAdmin;
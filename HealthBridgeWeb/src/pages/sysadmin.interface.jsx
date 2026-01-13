import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../pagesCSS/sysAdmin.css";
import { AdminContext } from "./admin.jsx";
import Ribbon from "../components/ribbon";
import CaseTable from "../components/Table/table.jsx";

const API_URL = "http://localhost/serverHB/sysAdmin.php";
axios.defaults.withCredentials = true;

function SysAdmin({ onLogOut }) {

    const { adminId } = useContext(AdminContext);

    // 🔐 Persist active tab
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("sysadmin-active-tab") || "admins";
    });

    useEffect(() => {
        localStorage.setItem("sysadmin-active-tab", activeTab);
    }, [activeTab]);

    const [admins, setAdmins] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [inputs, setInputs] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [editInputs, setEditInputs] = useState({});
    const [selectedAdminId, setSelectedAdminId] = useState("");
    const [allCases, setAllCases] = useState([]);


    /* ================= DATA FETCH ================= */

    useEffect(() => {
        getAdmins();
        getSessions();
        getContents();
    }, []);

    const getAdmins = () => {
        axios.get(`${API_URL}?sysadmin-id=${adminId}`).then(res => {
            if (Array.isArray(res.data)) setAdmins(res.data);
        });
    };

    const getSessions = () => {
        axios.get(`${API_URL}?type=sessions&sysadmin-id=${adminId}`).then(res => {
            if (Array.isArray(res.data)) setSessions(res.data);
        });
    };

    const getContents = () => {
        axios.get(`http://localhost/serverHB/admin.php?type=all_cases&sysadmin-id=${adminId}`)
        .then(res => {
            if (Array.isArray(res.data)) {
                setAllCases(res.data);
            } else {
                console.error("API did not return an array:", res.data);
            }
        });
};

    /* ================= CREATE ================= */

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value,"sysadmin-id":adminId }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(API_URL, inputs).then(res => {
            if (res.data.success) {
                alert("Admin created successfully!");
                setInputs({});
                getAdmins();
            } else {
                alert(res.data.message);
            }
        });
    };

    /* ================= DELETE ================= */

    const handleDelete = (id) => {
        if (!window.confirm("Delete this admin?")) return;

        axios.delete(API_URL, {
            data: { admin_id: id,"sysadmin-id":adminId }
        }).then(res => {
            if (res.data.success) {
                alert("Admin deleted");
                getAdmins();
            } else {
                alert(res.data.message);
            }
        });
    };

    /* ================= EDIT ================= */

    const handleEditClick = (admin) => {
        setEditingId(admin.admin_id);
        setEditInputs({
            admin_id: admin.admin_id,
            name: admin.name,
            password: ""
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditInputs(prev => ({ ...prev, [name]: value,"sysadmin-id":adminId  }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        if (!editInputs.name || !editInputs.password) {
            alert("Name and password required");
            return;
        }

        axios.put(API_URL, editInputs).then(res => {
            if (res.data.success) {
                alert("Admin updated");
                setEditingId(null);
                setEditInputs({});
                getAdmins();
            } else {
                alert(res.data.message);
            }
        });
    };

    /* ================= UI ================= */

    return (
        <>
            <div className="sysbody">
                {/* ========== HEADER ========== */}
                <div className="headersysadmin">
                    <h1 className="adminTitle">System Admin Panel</h1>

                    <div className="adminHeaderRight">
                        <span className="adminIdDisplay">Admin ID: {adminId}</span>
                        <button className="sysAdminlogOut" onClick={onLogOut}>
                            Log Out
                        </button>
                    </div>
                </div>


                {/* ========== RIBBON ========== */}
                <Ribbon activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* ========== ADMINS DETAILS TAB ========== */}
                {activeTab === "admins" && (
                    <>
                        <div className="dataInDataBase">
                            <h2 className="adminAccTopiv">Admin Accounts</h2>

                            <table className="systable">
                                <thead>
                                    <tr className="firstRow">
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Last Logged In</th>
                                        <th colSpan="2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map(admin => (
                                        <tr key={admin.admin_id}>
                                            {editingId === admin.admin_id ? (
                                                <td colSpan="5">
                                                    <form onSubmit={handleUpdate} style={{ display: "flex", gap: "10px" }}>
                                                        <span>ID: {admin.admin_id}</span>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={editInputs.name}
                                                            onChange={handleEditChange}
                                                            required
                                                        />
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            value={editInputs.password}
                                                            onChange={handleEditChange}
                                                            placeholder="New Password"
                                                            required
                                                        />
                                                        <button className="saveButton" type="submit">Save</button>
                                                        <button
                                                            type="button"
                                                            className="cancelButton"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </form>
                                                </td>
                                            ) : (
                                                <>
                                                    <td>{admin.admin_id}</td>
                                                    <td>{admin.name}</td>
                                                    <td>{admin.last_logged_in}</td>
                                                    <td>
                                                        {admin.admin_id === 130000 ? null : (
                                                            <button
                                                                className="editButton"
                                                                onClick={() => handleEditClick(admin)}
                                                            >
                                                                Edit
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {admin.admin_id === 130000 ? null : (
                                                            <button
                                                                className="deleteButton"
                                                                onClick={() => handleDelete(admin.admin_id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ADD NEW ADMIN */}
                        <div className="addData">
                            <h2 className="addTopic">Add New Admin</h2>

                            <form onSubmit={handleSubmit}>
                                <table cellSpacing="10" className="systable">
                                    <tbody>
                                        <tr>
                                            <th>Admin Name</th>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={inputs.name || ""}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Password</th>
                                            <td>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={inputs.password || ""}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" align="right">
                                                <button className="dataButtonSave">Save</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </>
                )}

                {/* ========== SESSIONS TAB ========== */}
                {activeTab === "sessions" && (
                    <div className="sessionData">
                        <h2 className="adminAccTopiv">Admin Sessions</h2>

                        <table className="systable">
                            <thead>
                                <tr className="firstRow">
                                    <th>Admin ID</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((s, i) => (
                                    <tr key={i}>
                                        <td>{s.admin_id}</td>
                                        <td>{s.start_time}</td>
                                        <td>{s.end_time || "Active"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ========== PAYMENTS TAB ========== */}
                {activeTab === "payments" && (
                    <div className="dataInDataBase">
                        <h2 className="adminAccTopiv">Payment Details</h2>
                        <p>Payment module coming soon…</p>
                    </div>
                )}



                {/* ========== ADMIN CONTENTS TAB ========== */}
                {activeTab === "contents" && (
                    <div className="dataInDataBase">
                        <h2 className="adminAccTopiv">Admin Contents</h2>

                        <div className="filter-container">
                            <label htmlFor="admin-select" className="filter-label">Select Admin :</label>
                            <select 
                                id="admin-select"
                                className="filter-select"
                                value={selectedAdminId} 
                                onChange={(e) => setSelectedAdminId(e.target.value)}
                            >
                                <option value="">All Admins</option>
                                {admins.map(admin => (
                                    <option key={admin.admin_id} value={admin.admin_id}>
                                        {admin.name} ({admin.admin_id})
                                    </option>
                                ))}
                            </select>
                        </div>


                        <hr style={{ margin: "20px 0", opacity: "0.2" }} />

        
                        <CaseTable 
                            cases={selectedAdminId 
                                ? allCases.filter(c => String(c.admin_id) === String(selectedAdminId)) 
                                : allCases
                            } 
                            onEdit={getContents} 
                            onDelete={getContents} 
                        />
                        
                       
                    </div>
                )}

                <div className="extraSpace"></div>
            </div>
        </>
    );
}

export default SysAdmin;

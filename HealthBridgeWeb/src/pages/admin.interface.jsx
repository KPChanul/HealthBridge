
// admin.interface.jsx

function Admin({admin_id, onLogOut}){ // Ensure onLogOut is destructured here
    return(
        <>
            <h2>Admin Interface</h2>
            
            {/* Add any admin-specific content here */}
            
            {/* Log Out Button added here */}
            <button onClick={onLogOut}>Log Out</button>
        </>
    );
}

export default Admin;
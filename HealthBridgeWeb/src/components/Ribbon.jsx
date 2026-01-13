import "../pagesCSS/Ribbon.css";

function Ribbon({ activeTab, setActiveTab }) {
    return (
        <div className="ribbon">
            <button
                className={activeTab === "admins" ? "ribbon-tab active" : "ribbon-tab"}
                onClick={() => setActiveTab("admins")}
            >
                Admins Details
            </button>

            <button
                className={activeTab === "sessions" ? "ribbon-tab active" : "ribbon-tab"}
                onClick={() => setActiveTab("sessions")}
            >
                Admins Sessions
            </button>

            <button
                className={activeTab === "payments" ? "ribbon-tab active" : "ribbon-tab"}
                onClick={() => setActiveTab("payments")}
            >
                Payment Details
            </button>

           
            <button 
                className={activeTab === "contents" ?  "ribbon-tab active" : "ribbon-tab"} 
                onClick={() => setActiveTab("contents")}
            >
                Admin Contents
            </button>

        </div>
    );
}

export default Ribbon;

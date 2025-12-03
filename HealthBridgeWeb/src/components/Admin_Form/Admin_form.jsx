import React,{useState} from "react";

const AdminForm=()=>{
    







    return(
        <div className="admin-form-container">
            <h2 className="ad_heading">Admin: Create New Active Case Entry</h2>
            <form className="case-form">
                <input type="text" name="patientName" placeholder="1. Patient Name (e.g., Kasun Perera)" value={formData.patientName} onChange={handleChange} required />
                <input type="text" name="surgeryType" placeholder="2. Surgery Type (e.g., Cardiac Surgery)" value={formData.surgeryType} onChange={handleChange} required />
                <textarea name="description" placeholder="3. Case Description (Why is funding needed?)" value={formData.description} onChange={handleChange} required style={{ minHeight: '120px' }} />

                <div className="input-group">
                    <label>Raised Amount (Rs.): <input type="number" name="raised" value={formData.raised} onChange={handleChange} min="0" required /></label>
                    <label>Goal Amount (Rs.): <input type="number" name="goal" value={formData.goal} onChange={handleChange} min="1" required /></label>
                </div>

                <input type="text" name="hospital" placeholder="4. Hospital/Location" value={formData.hospital} onChange={handleChange} required />
                <input type="email" name="contactEmail" placeholder="5. Contact Email" value={formData.contactEmail} onChange={handleChange} required />
                <input type="tel" name="contactPhone" placeholder="6. Contact Phone (+94...)" value={formData.contactPhone} onChange={handleChange} />

                <label className="urgent-checkbox">
                    <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} />
                    Mark this case as "Urgent"
                </label>

                <button type="submit" className="submit-button">
                    Save Case
                </button>





            </form>


        </div>



    )
}



export default AdminForm
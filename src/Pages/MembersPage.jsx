import React, { useState, useEffect } from 'react';
import MemberTable from '../Components/MemberTable';
import axios from 'axios';


export default function MembersPage() {
  const [members, setMembers] = useState([]);
  //const [selectedMember, setSelectedMember] = useState(null); // Store selected member data
  //const [showPopup, setShowPopup] = useState(false); // Control popup visibility
  const [, setAvailableColumns] = useState([]);
  const [, setSelectedColumns] = useState([]);

const fetchMembers = async () => {
  try {
    const [columnsRes, activeColsRes] = await Promise.all([
      axios.get('http://localhost:9000/api/table-columns'),
      axios.get('http://localhost:9000/api/table-columns/active')
    ]);

    setAvailableColumns(columnsRes.data);
    setSelectedColumns(activeColsRes.data);

    if (activeColsRes.data.length > 0) {
      const memberRes = await axios.post('http://localhost:9000/api/member-data', { columns: activeColsRes.data });
      setMembers(memberRes.data); // ✅ Correct usage
    }
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};


  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div style={{ padding: '2rem', overflowX: 'auto' }}>
      <h1>Member List</h1>
      {/* <CreateMemberInline onUpdateTable={fetchMembers} /> Pass fetchMembers */}
      <MemberTable 
        members={members} 
        //onPdfClick={handlePdfClick} // Pass the handlePdfClick to MemberTable
      />
      {/* Show the popup with selected member data */}
      {/* {showPopup && selectedMember && (
        <MemberRowPopup 
          member={selectedMember} 
          //onClose={() => setShowPopup(false)} // Close popup
        />
      )} */}
    </div>
  );
}

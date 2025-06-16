import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MembersPage from './Pages/MembersPage';
import SidebarMenu from './Components/SideMenubar';
import './App.css'; // Import the styles
import AssessmentsPage from './Pages/AssessmentsPage';
import MemberQualityPage from './Pages/MemberQualityPage';
import Admin from './Pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <SidebarMenu />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MembersPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/MemberQuality" element={<MemberQualityPage/>}/>
            {/* <Route path="/assessments" element={<AssessmentsPage />} /> */}
            {/* <Route path="/adt-events" element={<div>ADT Events</div>} /> */}
            {/* <Route path="/users" element={<div>Users</div>} /> */}
            <Route path='/admin' element={<Admin/>}/>
            <Route path="/assessmentspage/:questionnaireId" element={<AssessmentsPage />} />
          </Routes>
        </div>
        
      </div>
    </BrowserRouter>
  );
}

export default App;

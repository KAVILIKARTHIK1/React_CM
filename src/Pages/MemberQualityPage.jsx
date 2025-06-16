import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CreateMemberInline from '../Components/CreateMemberInline';
import { Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
//import supabase from '../lib/supabaseClient';
import MemberTasks from '../Components/MemberTasks';
//import AdtEventsList from '../Components/AdtEventsList';
//import AssessmentsPage from './AssessmentsPage';
import QuestionnaireDropdown from '../Components/QuestionnaireDropdown';
import MemberRowPopup from '../Components/MemberRowPopup';
import axios from 'axios';
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  
//   const fetchMembers = async () => {
//     const { data, error } = await supabase
//       .from('membermaster')
//       .select('bimemberid, firstname, lastname, gender, dateofbirth, membermedicarestatus, pcp, status, programname, carecoordinator, edvisitscount, admissioncount, cmtriggersscore, stratificationscore');

//     if (error) {
//       console.error('Error fetching members:', error);
//     } else {
//       setMembers(data);
//       //console.log(members);
//     }
//   };
 
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function MemberQualityPage() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  //const [members, setMembers] = useState([]);

//   useEffect(() => {
//     fetchMembers();
//   }, []);
const query = useQuery();
const memberId = query.get('Id'); // 'TestMember1'

const [member, setMember] = useState(null);
const [ProfileMemberID, setProfileMemberID] = useState(null);
useEffect(() => {
  const fetchMemberData = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/memberdetails/${memberId}`);
      setProfileMemberID(response.data.memberid);
      setMember(response.data);
    } catch (error) {
      console.error('Error fetching member details:', error);
    }
  };

  if (memberId) {
    fetchMemberData();
  }
}, [memberId]);
//console.log('Member Data : ',member);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //console.log(member);
  return (
    <Box sx={{ bgcolor: 'background.paper', width: '100%', paddingTop:'2rem' }}>
      <Box sx={{ p: 2, border: '1px solid #ccc'}}>
      <Grid container spacing={12}>
        {/* Member ID */}
        <Grid item xs={2}>
          <Typography variant="subtitle2" align="center">Member ID</Typography>
          <Typography variant="subtitle1" align="center" fontWeight="bold" color="primary">
            {member?.bimemberid || '--'}
          </Typography>
        </Grid>

        {/* First Name */}
        <Grid item xs={2}>
          <Typography variant="subtitle2" align="center">First Name</Typography>
          <Typography variant="subtitle1" align="center" fontWeight="bold" color="primary">
            {member?.firstname || '--'}
          </Typography>
        </Grid>

        {/* Last Name */}
        <Grid item xs={2}>
          <Typography variant="subtitle2" align="center">Last Name</Typography>
          <Typography variant="subtitle1" align="center" fontWeight="bold" color="primary">
            {member?.lastname || '--'}
          </Typography>
        </Grid>

        {/* Age/Gender */}
        <Grid item xs={2}>
          <Typography variant="subtitle2" align="center">Age/Gender</Typography>
          <Typography variant="subtitle1" align="center" fontWeight="bold" color="primary">
            {member ? `${member.age} / ${member.gender}` : '--'}
          </Typography>
        </Grid>

        {/* PCP */}
        <Grid item xs={2}>
          <Typography variant="subtitle2" align="center">PCP</Typography>
          <Typography variant="subtitle1" align="center" fontWeight="bold" color="primary">
            {member?.pcp || '--'}
          </Typography>
        </Grid>

        {/* Current Status */}
        <Grid item xs={2}>
          <Typography variant="subtitle2" align="center">Current Status</Typography>
          <Typography variant="subtitle1" align="center" fontWeight="bold" color="primary">
            {member?.status || '--'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="member quality tabs"
        >
          <Tab label="Member Details" {...a11yProps(0)} />
          <Tab label="Member Tasks" {...a11yProps(1)} />
          <Tab label="Member Profile" {...a11yProps(2)} />
          <Tab label="ADT Events" {...a11yProps(3)} />
          <Tab label="Assessments" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        {/* Content for Quality Measures */}
        <CreateMemberInline /> {/* Pass fetchMembers */}
        
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        {/* Content for Member Scores */}
       <MemberTasks mid={ProfileMemberID}/>
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        {/* Content for Member Scores */}
        <MemberRowPopup 
          member={memberId} 
          //onClose={() => setShowPopup(false)} // Close popup
        />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        {/* Content for Care Gaps */}
        {/* <AdtEventsList/> */}
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        {/* Content for Care Gaps */}
        <QuestionnaireDropdown/>
      </TabPanel>
    </Box>
  );
}

export default MemberQualityPage;

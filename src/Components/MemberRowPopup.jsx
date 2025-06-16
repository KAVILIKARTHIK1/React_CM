import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CardContent,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip
} from '@mui/material';
//import supabase from '../lib/supabaseClient';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
// // DataChip Component for Yes/No indicators
const DataChip = ({ value }) => (
  <Chip
    label={value === 'Y' ? 'Yes' : 'No'}
    color={value === 'Y' ? 'success' : 'error'}
    size="small"
    variant="outlined"
  />
);

// CostBlock Component to display cost-related data
const CostBlock = ({ title, amount }) => (
  <Box sx={{ p: 1, textAlign: 'center' }}>
    <Typography variant="subtitle2">{title}</Typography>
    <Typography fontWeight="bold">{amount}</Typography>
  </Box>
);

const MemberProfile = ({ memberData }) => {
  // Aggregate data
  const member = memberData[0]; // Assuming the first row contains the main member information
  //console.log(memberData);
  // Grouping diagnoses and specialty visits from multiple rows of data
  const diagnosisDetails = memberData.HCC_Details
  .filter(row => row["DIAG Code"]) // Use correct key
  .map(row => ({
    HCCDescription: row["HCCDescription"],
    DIAG_Code: row["DIAG Code"], // Corrected
    Diag_Description: row["Diag Description"],
    Diag_PY: row["Diag PY"],
    Diag_CY: row["Diag CY"]
  }));

//console.log("Diag : ", diagnosisDetails);


    const specialtyVisits = memberData.Speciality_Details.filter(row=>row["Speciality"]).map(row => ({
      Speciality: row["Speciality"],
      LatestSpecialityVisitDate: row["LatestSpecialityVisitDate"],
      SpecialityProvider: row["SpecialityProvider"]
    }));
   // console.log("Speciality : ",specialtyVisits);
    const QualitymeasureData = memberData.Quality_Gaps.filter(row => row["MeasureName"]).map(row => ({
      MeasureShortName: row["MeasureName"],
      MeasureName: row["MeasureName"],
      MeasureValue:row["MeasureValue"]
    }));
  //console.log(QualitymeasureData);
const VisitDetails = memberData.Member_Details.length > 0 ? {
      ER_Visits_12: memberData.Member_Details[0]?.ER_Visits_12,
      ER_Visits_3: memberData.Member_Details[0]?.ER_Visits_3,
      IP_Visits_12: memberData.Member_Details[0]?.IP_Visits_12,
      IP_Visits_3: memberData.Member_Details[0]?.IP_Visits_3,
    } : {};
    const RAFScoreDetails = memberData.Member_Details.length > 0 ? {
      RAFScore: memberData.Member_Details[0]?.RAF_Score,
      PrevRAFScore: memberData.Member_Details[0]?.Prev_RAF_Score,
      ScoreGap: memberData.Member_Details[0]?.Score_GAP
    } : {};

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#DCDCDC',
      color: theme.palette.common.black,
      border: '1px solid #ccc',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      border: '1px solid #ccc',
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
      border: '1px solid #ccc',
    },
    '&:last-child td, &:last-child th': {
      border: '1px solid #ccc',
    },
  }));
  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h5" sx={{textAlign:'center'}} fontWeight={600}>Member Profile</Typography>
      <Typography  color="text.secondary" gutterBottom>
        TIN: {memberData.Member_Details[0].TINName}
      </Typography>
      <Typography  color="text.secondary" gutterBottom>
        NPI: {memberData.Member_Details[0].NPIName}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        {/* ER Section */}
        <Grid item xs={12} sm={6} md={4}>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="customized table">
            <TableHead>
              <TableRow>
              <StyledTableCell><strong>ER Visits (12 Months)</strong></StyledTableCell>
              <StyledTableCell><strong>ER Visits (3 Months)</strong></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell align="right">{VisitDetails.ER_Visits_12 || 0}</StyledTableCell>
                <StyledTableCell align="right">{VisitDetails.ER_Visits_3 || 0}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
          {/* <Card>
            <CardContent>
              <Typography variant="h6">Visits</Typography>
              <CostBlock title="ER Visits (12 Months)" amount={member.er_visits_12 || 0} />
              <CostBlock title="ER Visits (3 Months)" amount={member.er_visits_3 || 0} />
              <CostBlock title="IP Visits (12 Months)" amount={member.ip_visits_12 || 0} />
              <CostBlock title="IP Visits (3 Months)" amount={member.ip_visits_3 || 0} />
            </CardContent>
          </Card> */}
        </Grid>
        {/*IP Visits*/} 
        <Grid item xs={12} sm={6} md={4}>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="customized table">
            <TableHead>
              <TableRow>
              <StyledTableCell><strong>IP Visits (12 Months)</strong></StyledTableCell>
              <StyledTableCell><strong>IP Visits (3 Months)</strong></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell align="right">{VisitDetails.IP_Visits_12 || 0}</StyledTableCell>
                <StyledTableCell align="right">{VisitDetails.IP_Visits_3 || 0}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
          {/* <Card>
            <CardContent>
              <Typography variant="h6">Visits</Typography>
              <CostBlock title="ER Visits (12 Months)" amount={member.er_visits_12 || 0} />
              <CostBlock title="ER Visits (3 Months)" amount={member.er_visits_3 || 0} />
              <CostBlock title="IP Visits (12 Months)" amount={member.ip_visits_12 || 0} />
              <CostBlock title="IP Visits (3 Months)" amount={member.ip_visits_3 || 0} />
            </CardContent>
          </Card> */}
        </Grid>

        {/* RAF & AWV Section */}
        <Grid item xs={12} sm={6} md={4}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="raf score table">
              <TableHead>
                <TableRow>
                  <StyledTableCell><strong>RAF Score</strong></StyledTableCell>
                  <StyledTableCell><strong>Previous RAF</strong></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell align="right">{RAFScoreDetails.RAFScore || 'N/A'}</StyledTableCell>
                  <StyledTableCell align="right">{RAFScoreDetails.PrevRAFScore || 'N/A'}</StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {/* <Card>
            <CardContent>
              <Typography variant="h6">RAF & AWV</Typography>
              <Typography>RAF Score: {member.raf_score || 'N/A'}</Typography>
              <Typography>Previous RAF: {member.prev_raf_score || 'N/A'}</Typography>
              <Typography>AWV Code: {member.awv_code}</Typography>
              <Typography sx={{ color: 'red' }}>AWV Due Date: {member.awv_due_date}</Typography>
              <Typography>Medications: {member.medications_cnt}</Typography>
            </CardContent>
          </Card> */}
        </Grid>

        {/* Costs Section */}
        <Grid item xs={12} sm={6} md={4}>
        <CardContent sx={{padding:'0px', paddingBottom:'0px !important'}}>
        <Typography><strong>Expenditure :</strong></Typography>
          <TableContainer component={Paper}>
            <Table size="small" sx={{minWidth:'700px'}} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell><strong>Cost</strong></StyledTableCell>
                  <StyledTableCell align="right"><strong>2022</strong></StyledTableCell>
                  <StyledTableCell align="right"><strong>2023</strong></StyledTableCell>
                  <StyledTableCell align="right"><strong>2024</strong></StyledTableCell>
                  <StyledTableCell align="right"><strong>2025</strong></StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell >Total Cost</StyledTableCell>
                <StyledTableCell align="right">{`$${memberData.Member_Details[0].Totalcost_0 || 0}`}</StyledTableCell>
                <StyledTableCell align="right">{`$${memberData.Member_Details[0].Totalcost_1 || 0}`}</StyledTableCell>
                <StyledTableCell align="right">{`$${memberData.Member_Details[0].Totalcost_2 || 0}`}</StyledTableCell>
                <StyledTableCell align="right">{`$${memberData.Member_Details[0].Totalcost_3 || 0}`}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </CardContent>
      {/* <Card>
        <CardContent>
          <Typography variant="h6">Costs</Typography>
          <CostBlock title="Total Cost (2022)" amount={`$${member.totalcost_0 || 0}`} />
          <CostBlock title="Total Cost (2023)" amount={`$${member.totalcost_1 || 0}`} />
          <CostBlock title="Total Cost (2024)" amount={`$${member.totalcost_2 || 0}`} />
          <CostBlock title="Total Cost (2025)" amount={`$${member.totalcost_3 || 0}`} />
        </CardContent>
      </Card> */}
    </Grid>

    {/* Specialty Visits Section */}
    <Grid item xs={12} sm={12} md={6} >
      <CardContent sx={{padding:'0px', paddingBottom:'0px !important'}}>
        <Typography><strong>Specialty Visits :</strong></Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="specialty visits table">
            <TableHead>
              <TableRow>
                <StyledTableCell><strong>Specialty Provider</strong></StyledTableCell>
                <StyledTableCell><strong>Specialty</strong></StyledTableCell>
                <StyledTableCell><strong>Latest Visit Date</strong></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specialtyVisits.map((visit, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{visit.SpecialityProvider}</StyledTableCell>
                  <StyledTableCell>{visit.Speciality}</StyledTableCell>
                  <StyledTableCell>{visit.LatestSpecialityVisitDate}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Grid>

    {/* Quality Details Section */}
    <Grid item xs={12}>
        {/* <Card> */}
      <CardContent sx={{padding:'0px',paddingBottom:'0px'}}>
        <Typography><strong>Quality Gaps</strong></Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell><strong>Code</strong></StyledTableCell>
                <StyledTableCell><strong>Measure Name</strong></StyledTableCell>
                <StyledTableCell><strong>Gap</strong></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {QualitymeasureData.map((QM, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{QM.MeasureShortName}</StyledTableCell>
                  <StyledTableCell>{QM.MeasureName}</StyledTableCell>
                  <StyledTableCell><DataChip value={QM.MeasureValue}/></StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    {/* </Card> */}
    </Grid>

    {/* HCC Details Section */}
    <Grid item xs={12}>
        {/* <Card> */}
      <CardContent sx={{padding:'0px',paddingBottom:'0px'}}>
        <Typography><strong>HCC Details</strong></Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell><strong>HCC Description</strong></StyledTableCell>
                <StyledTableCell><strong>Diagnosis Code</strong></StyledTableCell>
                <StyledTableCell><strong>Description</strong></StyledTableCell>
                <StyledTableCell><strong>Diag PY</strong></StyledTableCell>
                <StyledTableCell><strong>Diag CY</strong></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diagnosisDetails.map((detail, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{detail.HCCDescription}</StyledTableCell>
                  <StyledTableCell>{detail.DIAG_Code}</StyledTableCell>
                  <StyledTableCell>{detail.Diag_Description}</StyledTableCell>
                  <StyledTableCell><DataChip value={detail.Diag_PY} /></StyledTableCell>
                  <StyledTableCell><DataChip value={detail.Diag_CY} /></StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    {/* </Card> */}
    </Grid>

    
  </Grid>
</Box>
  );
};

const MemberRowPage = ({ member }) => {
  const [memberData, setMemberData] = useState(null);
  //console.log("MemberID : ",member);
  //alert(member);
  useEffect(() => {
  const fetchProfileMemberData = async () => {
    try {
      const response = await fetch(`http://localhost:9000/api/MMBRProfile/${member}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data) {
        // For example, you can flatten or process here if needed,
        // but since your data is already grouped by keys like Member_Details, Speciality_Details, etc.
        // you can just save it directly
        setMemberData(data);
      } else {
        setMemberData(null);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      setMemberData(null);
    }
  };

  if (member) {
    fetchProfileMemberData();
  }
}, [member]);
  //console.log("")
  console.log('Fetched Member Data:', JSON.stringify(memberData, null, 2));

  return (
    <Box>
      {memberData ? (
        <MemberProfile memberData={memberData} />
      ) : (
        <Typography sx={{ px: 2, py: 4 }}>Loading member data...</Typography>
      )}
    </Box>
  );
};

export default MemberRowPage;

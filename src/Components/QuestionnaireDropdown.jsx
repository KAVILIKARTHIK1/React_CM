import React, { useState, useEffect } from 'react';
import {
  Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer,TablePagination, TableHead, TableRow, Button,
  Paper, TableSortLabel
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
//import supabase from '../lib/supabaseClient';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import axios from 'axios';

export default function QuestionnaireDropdown() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selected, setSelected] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [assessmentList, setAssessmentList] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('assessmentdate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const memberId = query.get('Id');
  const columns = [
    { id: 'assessmenttype', label: 'Assessment Type' },
    { id: 'assessmentstatus', label: 'Assessment Status' },
    { id: 'assessmentdate', label: 'Assessment Date' },
    { id: 'assessmentby', label: 'Assessment By' },
    { id: 'startdate', label: 'Start Date' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };
  
  const sortedData = [...assessmentList].sort(getComparator(order, orderBy));


  useEffect(() => {
    const fetchQuestionnaires = async () => {
      const response = await axios.get('http://localhost:9000/api/questionnaire');
      const data = response.data;

      if(data) {
        setQuestionnaires(data);
      }
    };
    fetchQuestionnaires();
  }, []);

 useEffect(() => {
  const fetchAssessments = async () => {
    if (!memberId) return;
    const response = await axios.get(`http://localhost:9000/api/assessments/${memberId}`);
    if (response.data && Array.isArray(response.data)) {
      setAssessmentList(response.data);
    } else {
      alert("No Assessments");
      setAssessmentList([]);
    }
  };
  fetchAssessments();
}, [memberId]);
console.log(sortedData[0]);
//console.log(assessmentList)
  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedItem = questionnaires.find(item => item.questionnaireid === selectedId);
    sessionStorage.setItem('Mode', 'add');
    sessionStorage.setItem('ResponseId',0);
    setSelected(selectedItem.questionnaireid);
    setSelectedName(selectedItem.name);
    navigate(`/assessmentspage/${selectedId}?memberId=${memberId}&qtype=${selectedItem.name}`);
  };

  const handleEditAssessment = async (Mode, qType,responseid) => {
    const mode = Mode;
    sessionStorage.setItem('Mode', mode);
    sessionStorage.setItem('ResponseId',responseid);
    const response =await axios.get(`http://localhost:9000/api/questionnaire/${qType}`);

    const questionnaireId = response.data.questionnaireid;
    setSelected(questionnaireId); // still update state if needed

    navigate(`/assessmentspage/${questionnaireId}?memberId=${memberId}&qtype=${qType}`);
  };

  return (
    <>
      <FormControl sx={{ float: 'right', width: '160px', height: '50px', mb: 2 }}>
        <InputLabel id="questionnaire-select-label">Select Task</InputLabel>
        <Select
          labelId="questionnaire-select-label"
          name={selectedName}
          value={selected}
          onChange={handleChange}
        >
          {questionnaires.map((item) => (
            <MenuItem key={item.questionnaireid} value={item.questionnaireid}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}  sx={{ maxHeight: 400, overflow: 'auto' }}>
        <Table  aria-labelledby="tableTitle" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                textAlign: 'left',
                color: 'white',
                backgroundColor: '#231e49',
                position: 'sticky',
                top: 0,
                left: 0, // 🔑 Add this
                zIndex: 2, // 💡 Use higher zIndex than body cells to keep header on top
              }}
            >
                Action
              </TableCell>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  textAlign: 'left',
                  color: 'white',
                  backgroundColor: '#231e49',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1, // Ensures it stays above content when scrolling
                }}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  onClick={() => handleSort(column.id)}
                  sx={{
                    '&.Mui-active': {
                      color: 'white',
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(sortedData) && sortedData.length > 0 ? (
            sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#fff',
                      zIndex: 1,
                      display: 'flex',
                    }}
                  >
                    <Button
                      onClick={() =>
                        handleEditAssessment('Edit', row.Name, row.ResponseId)
                      }
                      sx={{ padding: '0px' }}
                    >
                      <EditSquareIcon />
                    </Button>
                  </TableCell>
                  <TableCell>{row.Name}</TableCell>
                  <TableCell>{row.AssessmentStatus}</TableCell>
                  <TableCell>{row.AssessmentDate}</TableCell>
                  <TableCell>{row.AssessmentBy}</TableCell>
                  <TableCell>{row.StartDate}</TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={assessmentList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </>
  );
}

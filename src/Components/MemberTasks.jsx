import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import {useEffect } from 'react';
//import supabase from '../lib/supabaseClient';
import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, Checkbox, 
     TextField
  } from '@mui/material';
import { useLocation } from 'react-router-dom';
//import { data } from 'react-router-dom';
import axios from 'axios';
// const taskNotes = [
//   {
//     date: '2025-04-01',
//     notesBy: 'Dr. Smith',
//     taskNotes: 'Patient responded well',
//     diagnosis: 'Diabetes',
//     sdoh: 'Low Income',
//     medications: 'Metformin',
//     codes: 'E11.9'
//   }
// ];

// const tasks = [
//   {
//     sno: 1,
//     task: 'Follow-up Visit',
//     duration: '30 mins',
//     status: 'Completed',
//     beginDate: '2025-03-25',
//     endDate: '2025-03-25',
//     createdBy: 'Nurse Joy',
//     notes: taskNotes
//   }
// ];

// const carePlans1 = [
//   {
//     carePlan: 'Diabetes Management',
//     createdBy: 'Dr. Grey',
//     createdDate: '2025-03-01',
//     status: 'Active',
//     outcome: 'Improving',
//     closedOn: '',
//     tasks
//   }
// ];
 

function NestedNotesTable({ notes }) {
  return (
    <Table size="small" sx={{ mt: 1 }}>
      <TableHead sx={{ background: 'linear-gradient(rgb(244, 248, 250), rgb(233, 242, 251) 50%, rgb(221, 231, 245) 50%, rgb(228, 237, 248))' }}>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Notes By</TableCell>
          <TableCell>Task Notes</TableCell>
          <TableCell>Diagnosis</TableCell>
          <TableCell>SDOH</TableCell>
          <TableCell>Medications</TableCell>
          <TableCell>Codes</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {notes.map((note, i) => (
          <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#ebeff3' : 'white' }}>
            <TableCell>{note.date}</TableCell>
            <TableCell>{note.fullname}</TableCell>
            <TableCell>{note.notes}</TableCell>
            <TableCell>{note.diagnosis}</TableCell>
            <TableCell>{note.sdoh}</TableCell>
            <TableCell>{note.medications}</TableCell>
            <TableCell>{note.codes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TaskRow({ task, index }) {
  const [open, setOpen] = React.useState(false);
  const rowBgColor = index % 2 === 0 ? '#ebeff3' : '#ffffff';
  const [Notes, setNotes]=useState([]);
  const fetchNotesForCarePlan = async (membertaskid) => {
    try{
        const NoteDetails=await axios.get(`http://localhost:9000/api/MemberTasksNotes/${membertaskid}`);
        const formattedTasks = NoteDetails.data.map(task => ({
                                ...task
                                }));

    setNotes(formattedTasks);
    }
    catch(error){
        console.error('Error fetching task details:', error);
    }
    // const { data: NoteDetails, error } = await supabase
    //   .from('vw_member_task_notes')
    //   .select('*')
    //  .eq('membertaskid', membertaskid)
    // if (error) {
    //   console.error('Error fetching task details:', error);
    //   return;
    // }

    
  };
  //console.log("Notes : ",Notes);
  return (
    <>
      <TableRow sx={{ backgroundColor: rowBgColor }}>
        <TableCell>
          <IconButton size="small" onClick={async () => {
            setOpen(!open);
            await fetchNotesForCarePlan(task.membertaskid);
              // Only fetch if tasks are not already loaded
              // if (!open && task.length === 0) {
              //   console.log("MemberTaskId : ",task.membertaskid);
              //   await fetchNotesForCarePlan(task.membertaskid);
              // }
              // else{
              //   console.log("Task Length : ",task.length);
              //   console.log("MemberTaskId : ",task.membertaskid);
              //   alert("No Data found");
              // }
            }}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{task.sequence}</TableCell>
        <TableCell>{task.description}</TableCell>
        <TableCell>{task.taskdurationseconds}</TableCell>
        <TableCell>{task.status}</TableCell>
        <TableCell>{task.target_start}</TableCell>
        <TableCell>{task.target_end}</TableCell>
        <TableCell>{task.fullname}</TableCell>
        <TableCell>
          <IconButton color="primary" size="small">
            <EditIcon />
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton color="secondary" size="small">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open}>
            <Box sx={{ m: 1 }}>
              <Typography variant="subtitle1">TaskNotes</Typography>
              <NestedNotesTable notes={Notes} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
function CarePlanRow({ plan, index }) {
  //alert(plan);
  //alert(index);
  const [open, setOpen] = React.useState(false);
  const rowBgColor = index % 2 === 0 ? '#ebeff3' : '#ffffff';
  const [Tasks, setTasks] = useState([]);

  const fetchTasksForCarePlan = async (carePlanId, memberId) => {
    try{
        const taskDetails=await axios.get(`http://localhost:9000/api/MemberTasks/${memberId}/${carePlanId}`);
        const formattedTasks = taskDetails.data.map(task => ({
                                    ...task,
                                    notes: []  // Ensures notes is always an array
                                    }));

        setTasks(formattedTasks);
    }
    catch(error){
        console.log();
    }
    // const { data: taskDetails, error } = await supabase
    //   .from('vw_member_tasks')
    //   .select('*')
    //  .eq('memberid', memberId)
    //   .or(`careplanid.eq.${carePlanId},careplanid.is.null`)
    // if (error) {
    //   console.error('Error fetching task details:', error);
    //   return;
    // }

    
  };
  console.log("Tasks : ",Tasks);
  return (
    <>
      <TableRow sx={{ backgroundColor: rowBgColor }}>
        <TableCell>
          <IconButton size="small" onClick={async () => {
            setOpen(!open);

              // Only fetch if tasks are not already loaded
              if (!open && plan.tasks.length === 0) {
                await fetchTasksForCarePlan(plan.CarePlanId, plan.MemberId);
              }
            }}
          >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{plan.CarePlanName}</TableCell>
        <TableCell>{plan.FullName}</TableCell>
        <TableCell>{plan.CreatedDate}</TableCell>
        <TableCell>{plan.Status}</TableCell>
        <TableCell>{plan.Outcome}</TableCell>
        <TableCell>{plan.ClosedDate}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open}>
            <Box sx={{ m: 1 }}>
              <Typography variant="subtitle1">Tasks</Typography>
              <Table size="small">
                <TableHead sx={{ background: 'linear-gradient(rgb(244, 248, 250), rgb(233, 242, 251) 50%, rgb(221, 231, 245) 50%, rgb(228, 237, 248))' }}>
                  <TableRow>
                    <TableCell />
                    <TableCell>S.No</TableCell>
                    <TableCell>Task</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Begin Dates</TableCell>
                    <TableCell>End Dates</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Tasks.map((task, idx) => (
                    <TaskRow key={idx} task={task} index={idx} />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export default function MemberTasks({mid}) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [today] = useState(() => new Date().toISOString().split("T")[0]);
  const [carePlans, setCarePlans] = useState([]);
  const [taskSequences, setTaskSequences] = React.useState({});
  const [taskEffectiveDates, setTaskEffectiveDates] = useState({});
  const [SavedMemberId, setSavedMemberId]=useState();
  //console.log("Categories : "+categories);

  //console.log(" Before UseEfect Console CarePlans: ",carePlans);

  const query = useQuery();
  const memberId = query.get('Id'); 
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedTasks({});
    setSelectedCategory("");
    setTasks([]);
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    try {
      const response = await axios.get('http://localhost:9000/api/tasks', {
        params: {
          categoryId,
          careplanId: 0 // or set this dynamically if needed
        }
      });

      const rawTasks = response.data;

      const enhanced = rawTasks.map((task) => ({
        id: task.id,
        description: task.description,
        position: task.Position
      }));

      setTasks(enhanced);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };
console.log("Tasks : ",tasks);

  const handleCheckboxChange = (taskId) => {
    setSelectedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try{
        const cmcodes=await axios.get('http://localhost:9000/api/categories');
        setCategories(cmcodes.data);
      }
      catch(error){
        console.log("Fetching Categories Error ",error);
      }
    };


    
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!memberId) return;
  
    const fetchCarePlans = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/careplans/${memberId}`);
            const tasksData = response.data;

            const grouped = tasksData.reduce((acc, task) => {
            const cpId = task.careplanid || 0;
            if (!acc[cpId]) {
                acc[cpId] = {
                CarePlanId: cpId,
                CreatedDate: task.createddate,
                FullName: task.employee_fullname || '',
                CarePlanLink: cpId === 0 ? '#' : `/cm-care-plan?id=${cpId}`,
                CarePlanName: task.careplanname || 'General',
                TaskCount: 0,
                MemberId: task.memberid,
                Outcome: task.outcome,
                ClosedDate: task.closeddate,
                Status: task.status,
                tasks: []
                };
                setSavedMemberId(task.memberid);
            }

            acc[cpId].TaskCount++;
            return acc;
            }, {});

            const result = Object.values(grouped).map(item => ({
            ...item,
            CarePlanName: `${item.CarePlanName} - [${item.TaskCount}${item.TaskCount === 1 ? ' Task]' : ' Tasks]'}`
            }));

            if (result.length > 0) {
            setCarePlans(result);
            } else {
            console.warn("No care plan data found.");
            }

        } catch (error) {
            console.error('Error fetching care plans from API:', error);
        }
    };
  
    fetchCarePlans();
  }, [memberId]); // ✅ Add only memberId, not carePlans
  //console.log(carePlans);
  const handleAddTasks =async () => {
    const selectedTaskIds = Object.keys(selectedTasks).filter(id => selectedTasks[id]);
    if (selectedTaskIds.length === 0) {
      alert("Select one or more tasks");
      return;
    }

    //console.log("TaskEffectiveDate : ",taskEffectiveDates);
    //console.log("Task Sequence : ",taskSequences);

    const tasksToAdd = selectedTaskIds.map(id => ({
      taskId: id,
      sequence: taskSequences[id]??0,
      effectiveDate: taskEffectiveDates[id]?? today,
    }));
    //console.log("Task To Add : ",tasksToAdd);
    try {
      //alert("Selected Category : "+selectedCategory);
      //console.log("MemberId : "+SavedMemberId);
      const response = await fetch('http://localhost:9000/api/Savetasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedCategory: selectedCategory,
          selectedTasks: tasksToAdd,
          carePlanId: null,
          memberId: mid,
          loginEmployeeId: "1"
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Tasks added:", data);
        handleClose();
        // Refresh your task list UI here
      } else {
        alert(data.error || "Error adding tasks");
      }
    } catch (error) {
      console.error(error);
      alert("Network or server error");
    }
    handleClose();
  };
  //const careplanid=carePlans["careplanid"];
  //console.log(careplanid);
  //console.log(" After UseEfect Console CarePlans: ",carePlans);
  return (
    <>
    <div>
    <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            sx={{ height: '100%', backgroundColor: '#231e49', float:'right' }}
            onClick={handleClickOpen}
          >
            Add Task
          </Button>
    </div>
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ background: 'linear-gradient(rgb(244, 248, 250), rgb(233, 242, 251) 50%, rgb(221, 231, 245) 50%, rgb(228, 237, 248))' }}>
          <TableRow>
            <TableCell />
            <TableCell>CarePlan</TableCell>
            <TableCell>CreatedBy</TableCell>
            <TableCell>CreatedDate</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Outcome</TableCell>
            <TableCell>ClosedOn</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {carePlans.map((plan, i) => (
            
            <CarePlanRow key={i} plan={plan} index={i} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>Choose Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Choose Category"
            >
              {categories.map((cat) => (
                
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {tasks.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Sequence</TableCell>
                  <TableCell>Effective Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={!!selectedTasks[task.id]}
                        onChange={() => handleCheckboxChange(task.id)}
                      />
                    </TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <TextField
                              size="small"
                              placeholder="Sequence"
                              value={taskSequences[task.id] || ''}
                              onChange={(e) =>
                                setTaskSequences(prev => ({ ...prev, [task.id]: e.target.value }))
                              }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="date"
                        value={taskEffectiveDates[task.id] ?? today}  // default to today or empty string
                        onChange={(e) =>
                          setTaskEffectiveDates(prev => ({ ...prev, [task.id]: e.target.value }))
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddTasks} variant="contained" color="primary">
            Add Task(s)
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

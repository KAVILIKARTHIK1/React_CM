// import React from 'react';
// import Box from '@mui/material/Box';
// import Collapse from '@mui/material/Collapse';
// import IconButton from '@mui/material/IconButton';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import EditIcon from '@mui/icons-material/Edit';

// // Sample Data
// const eventNotes = [
//   {
//     date: '2025-04-01',
//     notesBy: 'Dr. Smith',
//     eventNotes: 'Patient responded well',
//   }
// ];

// const subEvents = [
//   {
//     date: '2025-03-30',
//     receivingFacility: 'Facility A',
//     triggerEvent: 'Emergency Admission',
//     eventDescription: 'Patient was admitted due to an emergency',
//     admissionSource: 'Emergency Room',
//   }
// ];

// const adtEvents = [
//   {
//     date: '2025-03-25',
//     sendingFacility: 'Facility B',
//     patientClass: 'Inpatient',
//     admitDate: '2025-03-25',
//     dischargeDate: '2025-04-01',
//     pcp: 'Dr. Watson',
//     subEvents,
//     notes: eventNotes,
//   },
//   {
//     date: '2025-03-25',
//     sendingFacility: 'Facility B',
//     patientClass: 'Inpatient',
//     admitDate: '2025-03-25',
//     dischargeDate: '2025-04-01',
//     pcp: 'Dr. Watson',
//     subEvents,
//     notes: eventNotes,
//   },
//   {
//     date: '2025-03-25',
//     sendingFacility: 'Facility B',
//     patientClass: 'Inpatient',
//     admitDate: '2025-03-25',
//     dischargeDate: '2025-04-01',
//     pcp: 'Dr. Watson',
//     subEvents,
//     notes: eventNotes,
//   }
// ];

// // Sub Events Table
// function NestedSubEventsTable({ subEvents }) {
//   return (
//     <Table  >
//       <TableHead sx={{ background: 'linear-gradient(rgb(244, 248, 250), rgb(233, 242, 251))' }}>
//         <TableRow>
//           <TableCell>Date</TableCell>
//           <TableCell>Receiving Facility</TableCell>
//           <TableCell>Trigger Event</TableCell>
//           <TableCell>Event Description</TableCell>
//           <TableCell>Admission Source</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {subEvents.map((event, i) => (
//           <TableRow key={i}>
//             <TableCell>{event.date}</TableCell>
//             <TableCell>{event.receivingFacility}</TableCell>
//             <TableCell>{event.triggerEvent}</TableCell>
//             <TableCell>{event.eventDescription}</TableCell>
//             <TableCell>{event.admissionSource}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

// // Event Notes Table
// function NestedEventNotesTable({ notes }) {
//   return (
//     <Table >
//       <TableHead sx={{ background: 'linear-gradient(rgb(244, 248, 250), rgb(233, 242, 251))' }}>
//         <TableRow>
//           <TableCell>Date</TableCell>
//           <TableCell>Notes By</TableCell>
//           <TableCell>Event Notes</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {notes.map((note, i) => (
//           <TableRow key={i}>
//             <TableCell>{note.date}</TableCell>
//             <TableCell>{note.notesBy}</TableCell>
//             <TableCell>{note.eventNotes}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

// // Main Row With Collapse
// function AdtEventRow({ event, rowIndex }) {
//   const [open, setOpen] = React.useState(false);

//   return (
//     <>
//       <TableRow
//         sx={{
//           backgroundColor: rowIndex % 2 === 0 ? '#f5f5f5' : '#ffffff',
//         }}
//       >
//         <TableCell>
//           <IconButton size="small" onClick={() => setOpen(!open)}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell>
//           <IconButton color="primary" size="small">
//             <EditIcon />
//           </IconButton>
//         </TableCell>
//         <TableCell>{event.date}</TableCell>
//         <TableCell>{event.sendingFacility}</TableCell>
//         <TableCell>{event.patientClass}</TableCell>
//         <TableCell>{event.admitDate}</TableCell>
//         <TableCell>{event.dischargeDate}</TableCell>
//         <TableCell>{event.pcp}</TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box sx={{ m: 1 }}>
//               <Typography variant="subtitle1" gutterBottom>SUB EVENTS</Typography>
//               <NestedSubEventsTable subEvents={event.subEvents} />
//               <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>EVENT NOTES</Typography>
//               <NestedEventNotesTable notes={event.notes} />
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// }

// // Main Component
// export default function AdtEventsList() {
//   return (
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead sx={{ background: 'linear-gradient(rgb(244, 248, 250), rgb(233, 242, 251))' }}>
//           <TableRow>
//             <TableCell />
//             <TableCell>Actions</TableCell>
//             <TableCell>Date</TableCell>
//             <TableCell>Sending Facility</TableCell>
//             <TableCell>Patient Class</TableCell>
//             <TableCell>Admit Date</TableCell>
//             <TableCell>Discharge Date</TableCell>
//             <TableCell>PCP</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {adtEvents.map((event, index) => (
//             <AdtEventRow key={index} event={event} rowIndex={index} />
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

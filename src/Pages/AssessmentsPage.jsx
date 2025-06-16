import React, { useRef, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
//import supabase from '../lib/supabaseClient';
import { Backdrop, CircularProgress } from '@mui/material';
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Radio,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Container,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup
} from '@mui/material';
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';
import axios from 'axios';
const AssessmentsPage = () => {
  const { questionnaireId } = useParams();
  const location = useLocation();

  const [sections, setSections] = useState([]);
  const [formValues, setFormValues] = useState({
    startDate: '',
    assessmentStatus: '',
    notes: {},
  });
  const [answers, setAnswers] = useState({});
  const [member, setMember] = useState(null);

  const query = new URLSearchParams(location.search);
  const memberId = query.get('memberId');
  const qtype = query.get('qtype');
  const [ProfileMemberID, setProfileMemberID] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [combinedData, setCombinedData] = useState([]) ;
  //const Mode=sessionStorage.getItem('Mode');
  //const [LastResponse, setLastResponse]=useState([]);
  //const newAssessmentId="";
  const [newResponse, setNewResponse]=useState([]);
  const [,setQRD]=useState([]);
  const [, setNewAssessmentId]=useState();

  const [carePlan, setCarePlan] = useState('');
  const carePlanRef = useRef();
  const [loading, setLoading] = useState(false);
  //const [SavedQuestionnaires, setSavedQuestionnaires]=useState([]);
  const Mode = sessionStorage.getItem('Mode');
  //alert("Mode : ",Mode);
 // const [sections, setSections]=useState([]);
  useEffect(() => {
    const fetchSectionsAndQuestions = async () => {
      const response = await axios.get(`http://localhost:9000/api/sections/${questionnaireId}`);
      
      const Rid=sessionStorage.getItem('ResponseId');
      //alert(`ResponseID: ${Rid}`);
      if(Rid==='0'){
        //alert("If part");
        const Questions = await axios.get(`http://localhost:9000/api/questions/${questionnaireId}`);

        const sectionWithQuestions = response.data
          .map((section) => {
            const questions = Questions.data // ✅ Access the actual array
              .filter((q) => q.sectionid === section.sectionid)
              .map((q) => ({
                ...q,
                parsedOptions: q.options ? q.options.split(',') : [],
              }));

            return questions.length > 0 ? { ...section, questions } : null;
          })
          .filter(Boolean);

        setSections(sectionWithQuestions);
      }
      else {
        //alert("Else part");
        //   const { data: questionData, error: questionError } = await supabase
        //     .from('questionnaire_questions')
        //     .select('questionid, question, controltype, options, sectionid')
        //     .eq('questionnaireid', questionnaireId)
        //     .eq('active', true)
        //     .order('position');

        //   if (questionError) {
        //     console.error('Error fetching questions:', questionError);
        //     return;
        //   }
        const Questions = await axios.get(`http://localhost:9000/api/questions/${questionnaireId}`)
        const QuestionsResponses = await axios.get(`http://localhost:9000/api/questionnaire_Responses/${Rid}`)

        //   const {data:questionnaire_Responses, error:questionnaire_ResponsesError}=await supabase
        //   .from('questionnaire_responses')
        //   .select('startdate, assessmentstatus')
        //   .eq('responseid', Rid);
          
        //   if (questionnaire_ResponsesError) {
        //     console.error('Error fetching questions responses:', questionnaire_ResponsesError);
        //     return;
        //   }
        const QuestionsResponsesDetails = await axios.get(`http://localhost:9000/api/questionnaire_response_details/${Rid}`)

          // const { data: responseDetails, error: responseError } = await supabase
          //   .from('questionnaire_response_details')
          //   .select('questionid, answer, notes')
          //   .eq('responseid', Rid);

          // if (responseError) {
          //   console.error('Error fetching response details:', responseError);
          //   return;
          // }

          const prefilledAnswers = {};
          const prefilledNotes = {};

          const sectionWithQuestions = response.data
            .map((section) => {
              const questions = Questions.data
                .filter((q) => q.sectionid === section.sectionid)
                .map((q) => {
                  const response = QuestionsResponsesDetails.data.find((r) => r.questionid === q.questionid);
                  if (response) {
                    prefilledAnswers[q.questionid] = {
                      value: response.answer,
                      question: q.question,
                      notes: response.notes || '',
                    };
                    prefilledNotes[q.questionid] = response.notes || '';
                  }
                  return {
                    ...q,
                    parsedOptions: q.options ? q.options.split(',') : [],
                    selectedOption: response ? response.answer : null,
                  };
                });

              return questions.length > 0 ? { ...section, questions } : null;
            })
            .filter(Boolean); // Remove null entries
              setSections(sectionWithQuestions);
              setAnswers(prefilledAnswers);
              const { startdate, assessmentstatus } = QuestionsResponses.data[0];
              const formatDateToYYYYMMDD = (dateStr) => {
                    const date = new Date(dateStr);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                  };

                  const formattedStartDate = formatDateToYYYYMMDD(startdate);

              setFormValues((prev) => ({
                ...prev,
                startDate: formattedStartDate,
                assessmentStatus: assessmentstatus,
                notes: prefilledNotes,
              }));
        }

    };

    if (questionnaireId) {
      fetchSectionsAndQuestions();
    }
  }, [questionnaireId]);

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

  useEffect(() => {
  const fetchProfileMemberData = async () => {
    try {
      const response = await fetch(`http://localhost:9000/api/MMBRProfile/${memberId}`);
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

  if (memberId) {
    fetchProfileMemberData();
  }
}, [memberId]);

//console.log("memberData: ",memberData);
//console.log("Raf: ",memberData.Member_Details);

 
  //console.log('Fetched Member Data:', JSON.stringify(memberData, null, 2));
  const handleSaveAssessment=() =>{

    const RAFScoreDetails = memberData.Member_Details.length > 0 ? {
      RAFScore: memberData.Member_Details[0]?.RAF_Score,
      PrevRAFScore: memberData.Member_Details[0]?.Prev_RAF_Score,
      ScoreGap: memberData.Member_Details[0]?.Score_GAP
    } : {};


    //console.log(RAFScoreDetails);

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
    }));
   // console.log("Speciality : ",specialtyVisits);
    const QualitymeasureData = memberData.Quality_Gaps.filter(row => row["MeasureName"]).map(row => ({
      MeasureShortName: row["MeasureName"],
      MeasureName: row["MeasureName"],
      MeasureValue:row["MeasureValue"]
    }));
    //console.log(QualitymeasureData);
    const AdmissionDiag = memberData.Admission_Details.filter(row=>row["Admission Diagnosis"]).map(row=>({
      AdmissionDiagnosis: row["Admission Diagnosis"],
      AdmissionDesc: row["Description"],
      LatestAdmissionDate: row["Latest Admission Date"]
    }))
    //console.log(AdmissionDiag);
    const VisitDetails = memberData.Member_Details.length > 0 ? {
      ER_Visits_12: memberData.Member_Details[0]?.ER_Visits_12,
      ER_Visits_3: memberData.Member_Details[0]?.ER_Visits_3,
      IP_Visits_12: memberData.Member_Details[0]?.IP_Visits_12,
      IP_Visits_3: memberData.Member_Details[0]?.IP_Visits_3,
    } : {};

    //console.log(VisitDetails);

    const assessmentData = {
      startDate: formValues.startDate,
      assessmentStatus: formValues.assessmentStatus,
      questions: sections.flatMap(section =>
        section.questions.map((q) => {
          const answer = answers[q.questionid];
          return {
            sectionname: section.sectionname, // ← Add sectionname here
            questionid: q.questionid,
            question: q.question,
            controltype: q.controltype,
            answer: q.controltype === 'textbox'
              ? answer || ''
              : Array.isArray(answer)
                ? answer.join(',')
                : answer || '',
            notes: formValues.notes[q.questionid] || '',
          };
        })
      ),
    };

    //console.log("Saved Assessment JSON:", JSON.stringify(assessmentData, null, 2));

    const combinedData = [{
      memberprofiledata: {
        Visit_Details: VisitDetails,
        RAFScore_details: RAFScoreDetails,
        HCC_Details: diagnosisDetails,
        quality_Details: QualitymeasureData,
        Admission_Details: AdmissionDiag,
        Speciality_Details: specialtyVisits
      },
      Assessment_Data: assessmentData
    }];
    
    // setCombinedData(combinedData);
    // Optional: Save to DB using Supabase here
    DBSaving();

  };
  const DBSaving = async () => {
    const loggedInEmployeeId = "1";
    const fullName = "Karthik";


    if(Mode==='Edit'){
      const responseId = sessionStorage.getItem('ResponseId'); // make sure to set this from prefill fetch
      try {
        await axios.put(`http://localhost:9000/api/update_questionnaire_responses/${responseId}`, formValues);
        alert('Update successful!');
      } catch (error) {
        console.error('Axios error:', error);
        alert('Error updating response: ' + (error.response?.data?.error || error.message));
      }
      // const { error: updateError } = await supabase
      //   .from('questionnaire_responses')
      //   .update({
      //     assessmentstatus: formValues.assessmentStatus,
      //     startdate: new Date(formValues.startDate),
      //     assessmentby: fullName,
      //     assessmentdate: new Date(),
      //     generalnotes: formValues.notes?.general || '',
      //   })
      //   .eq('responseid', responseId);

      // if (updateError) {
      //   console.error('Error updating assessment:', updateError);
      //   return;
      // }

      DBQuestionnaireResponseDetails(responseId);
    }
    else{
      try{
        const lastResponse= await axios.get('http://localhost:9000/api/get_questionnaire_Responses/Responseid');
        if (lastResponse.data && Object.keys(lastResponse.data).length > 0) {
          const responseId = lastResponse.data.maxResponseId;
          const newId = `A-${responseId + 1}`;
          setNewAssessmentId(newId);
          
          const InsertQuestionnaire_Responses = {
            loggedInEmployeeId,
            questionnaireId,
            fullName,
            formValues,
            newId,
            ProfileMemberID
          };
          try {
            const insertRes = await axios.post(
              'http://localhost:9000/api/Insert_questionnaire_responses',
              InsertQuestionnaire_Responses
            );
            setNewResponse(newResponse);
            alert('Insert successful! Response ID: ' + insertRes.data.newResponseId);
          } catch (error) {
            console.error('Insert error:', error);
            alert('Insert failed: ' + (error.response?.data?.error || error.message));
          }
          // const { data: newResponse, error: responseError } = await supabase
          //   .from('questionnaire_responses')
          //   .insert([{
          //     createdby: parseInt(loggedInEmployeeId),
          //     createddate: new Date(),
          //     questionnaireid: questionnaireId,
          //     assessmentby: fullName,
          //     assessmentdate: new Date(),
          //     assessmentstatus: formValues.assessmentStatus,
          //     startdate: new Date(formValues.startDate),
          //     uniqueid: newId,
          //     memberid: ProfileMemberID,
          //     generalnotes: formValues.notes?.general || '',
          //   }])
          //   .select();
      
          // if (responseError) {
          //   console.error('Failed to insert assessment:', responseError);
          //   return;
          // } else {
          //   setNewResponse(newResponse);
          // }
      
          // Pass the actual responseId directly
          DBQuestionnaireResponseDetails(responseId);
      
        } else {
          const fallbackId = 'A-000001';
          setNewAssessmentId(fallbackId);
          alert("No previous assessments found. Starting with ID A-000001");
        }
      }
      catch(error){
        console.error('Axios error:', error);
        alert('Error updating response: ' + (error.response?.data?.error || error.message));
      }


      // const { data: lastResponse, error } = await supabase
      //   .from('questionnaire_responses')
      //   .select('responseid')
      //   .order('responseid', { ascending: false })
      //   .limit(1);
    
      // if (error) {
      //   console.error('Error Responseid:', error);
      //   return;
      // }
    
      
    }
  };  
const DBQuestionnaireResponseDetails = async (responseId) => {

  if (Mode==='Edit') {
    // First delete all existing response details for this responseId
    try{
      await axios.delete(`http://localhost:9000/api/Delete_ResponseDetails/${responseId}`);
     // alert('Delete successful!');
    }
    catch(error){
      console.error('Delete error:', error);
      alert('Error deleting: ' + (error.response?.data?.error || error.message));
    }
    // const { error: deleteError } = await supabase
    //   .from('questionnaire_response_details')
    //   .delete()
    //   .eq('responseid', responseId);

    // if (deleteError) {
    //   console.error('Error deleting existing response details:', deleteError);
    //   return;
    // }
  }

  // Prepare response details to insert
  const responseDetails = Object.entries(answers).map(([questionId, answerObj]) => ({
    responseid: responseId,
    questionid: parseInt(questionId),
    answer: answerObj.value,
    notes: answerObj.notes,
    question: answerObj.question
  }));
  console.log(responseDetails);
  // Insert all new answers
  // const { data: insertData, error: insertError } = await supabase
  //   .from('questionnaire_response_details')
  //   .insert(responseDetails);
  try {
    const insertData = await axios.post(
      'http://localhost:9000/api/New_questionnaire_response_details',
      responseDetails
    );
    setQRD(insertData);
    alert('Insert successful!');
  } catch (error) {
    console.error('Insert error:', error);
    alert('Insert failed: ' + (error.response?.data?.error || error.message));
  }
  // if (insertError) {
  //   console.error('Failed to insert response details:', insertError);
  // } else {
  //   setQRD(insertData);
  //   alert("Assessment submitted successfully!");
  // }
};


const GenerateCarePlan = async () => {
  if (formValues.assessmentStatus !== 'Completed') {
    alert('Assessment Status must be "Completed" to generate a care plan.');
    return;
  }

  setLoading(true); // Start loading

  try {
    const response = await fetch('http://localhost:9000/generate-care-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(combinedData[0]),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    setCarePlan(data.care_plan);

    // Wait for React to render the carePlan (1 frame delay)
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (data.care_plan) {
      const element = carePlanRef.current;
      await html2pdf()
        .set({
          margin: 10,
          filename: `${ProfileMemberID}-${qtype} Care_Plan [${new Date().toLocaleDateString()}].pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .save();
    } else {
      alert("Care Plan content is empty.");
    }
  } catch (err) {
    console.error('Error generating care plan:', err);
    alert('Failed to generate care plan.');
  } finally {
    setLoading(false); // Always stop loading
  }
};
const formatDateToYMD = (isoDate) => {
      if (!isoDate) return '';
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };
  
 //console.log("QRD : ",QRD);
 //console.log(JSON.stringify(combinedData, null, 2));
 //console.log("LastResponse : ",LastResponse);
 //console.log("New Response : ",newResponse);
 //console.log("Answers : ",answers);
 //console.log(LastResponse);
 // console.log(formValues);
 //console.log(LastResponse[0].responseid);
 //console.log(sections);
 //console.log(newAssessmentId);
 //console.log("Saved Questionnaires : ",SavedQuestionnaires);


  //console.log("Form Values : ",formValues);
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
  
      <Container sx={{ paddingTop: '2rem' }}>
        <Box sx={{ p: 2, border: '1px solid #ccc' }}>
          <Grid container spacing={18}>
            {[
              { label: 'Member ID', value: member?.bimemberid },
              { label: 'First Name', value: member?.firstname },
              { label: 'Last Name', value: member?.lastname },
              {
                label: 'Age/Gender',
                value: member ? `${member.age || '--'} / ${member.gender}` : '--'
              },
              { label: 'DOB', value: member?.dateofbirth? formatDateToYMD(member.dateofbirth) : '--' }
            ].map((item, idx) => (
              <Grid item xs={2} key={idx}>
                <Typography variant="subtitle2" align="center">{item.label}</Typography>
                <Typography variant="subtitle1" align="center" fontWeight="bold" color="primary">
                  {item.value || '--'}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
  
        <TableContainer component={Paper} elevation={3} sx={{ p: 3, mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: 'bold', color:'rgba(13, 27, 62, 0.7)', border:'none', fontSize: '18px', padding:'0px', textAlign: 'center' }}>
                  {qtype}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ float: 'right', backgroundColor: '#231e49', ml: 1 }}
                    onClick={GenerateCarePlan}
                  >
                    Generate CarePlan
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ float: 'right', backgroundColor: '#231e49' }}
                    onClick={handleSaveAssessment}
                  >
                    Save Assessment
                  </Button>
  
                  <div style={{ display: 'none' }}>
                    <div ref={carePlanRef}>
                      <div dangerouslySetInnerHTML={{ __html: carePlan }} />
                    </div>
                  </div>
                  
                </TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>Select Start Date</TableCell>
                <TableCell colSpan={2}>
                  <TextField
                    type="date"
                    value={formValues.startDate}
                    onChange={(e) =>
                      setFormValues({ ...formValues, startDate: e.target.value })
                    }
                    fullWidth
                    size="small"
                  />
                </TableCell>
              </TableRow>
  
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Assessment Status</TableCell>
                <TableCell colSpan={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formValues.assessmentStatus}
                      onChange={(e) =>
                        setFormValues({ ...formValues, assessmentStatus: e.target.value })
                      }
                      label="Status"
                    >
                      <MenuItem value="InProgress">InProgress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
  
              {sections.map((section) => (
                <React.Fragment key={section.sectionid}>
                  <TableRow>
                    <TableCell colSpan={3} sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                      {section.sectionheading || section.sectionname}
                    </TableCell>
                  </TableRow>
  
                  {section.questions.map((q) => (
                    <TableRow key={q.questionid}>
                      <TableCell>{q.question}</TableCell>
                      <TableCell>
                        {q.controltype === 'Checkbox' && (
                          <FormGroup>
                            {q.parsedOptions.map((opt, i) => (
                              <FormControlLabel
                                key={i}
                                control={
                                  <Checkbox
                                    checked={answers[q.questionid]?.value?.includes(opt.trim()) || false}
                                    onChange={(e) => {
                                      const current = answers[q.questionid]?.value || [];
                                      const updated = e.target.checked
                                        ? [...current, opt.trim()]
                                        : current.filter((o) => o !== opt.trim());
  
                                      const updatedAnswers = {
                                        ...answers,
                                        [q.questionid]: {
                                          value: updated,
                                          question: q.question
                                        }
                                      };
                                      setAnswers(updatedAnswers);
                                    }}
                                  />
                                }
                                label={opt.trim()}
                              />
                            ))}
                          </FormGroup>
                        )}
  
                        {q.controltype === 'textbox' && (
                          <TextField
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={answers[q.questionid]?.value || ''}
                            onChange={(e) => {
                              const updatedAnswers = {
                                ...answers,
                                [q.questionid]: {
                                  value: e.target.value,
                                  question: q.question
                                }
                              };
                              setAnswers(updatedAnswers);
                            }}
                          />
                        )}
  
                        {q.controltype === 'RadioButton' && (
                          <RadioGroup
                            value={answers[q.questionid]?.value || ''}
                            onChange={(e) => {
                              const updatedAnswers = {
                                ...answers,
                                [q.questionid]: {
                                  value: e.target.value,
                                  question: q.question
                                }
                              };
                              setAnswers(updatedAnswers);
                            }}
                          >
                            {q.parsedOptions.map((opt, i) => (
                              <FormControlLabel
                                key={i}
                                value={opt.trim()}
                                control={<Radio />}
                                label={opt.trim()}
                              />
                            ))}
                          </RadioGroup>
                        )}
  
                        {q.controltype === 'Dropdown' && (
                          <FormControl fullWidth size="small">
                            <InputLabel>Select</InputLabel>
                            <Select
                              value={answers[q.questionid]?.value || ''}
                              onChange={(e) => {
                                const updatedAnswers = {
                                  ...answers,
                                  [q.questionid]: {
                                    value: e.target.value,
                                    question: q.question
                                  }
                                };
                                setAnswers(updatedAnswers);
                              }}
                            >
                              {q.parsedOptions.map((opt, i) => (
                                <MenuItem key={i} value={opt.trim()}>
                                  {opt.trim()}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </TableCell>
  
                      <TableCell>
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          placeholder="Add notes"
                          value={formValues.notes[q.questionid] || ''}
                          onChange={(e) => {
                            const note = e.target.value;
  
                            setFormValues((prev) => ({
                              ...prev,
                              notes: {
                                ...prev.notes,
                                [q.questionid]: note,
                              },
                            }));
  
                            setAnswers((prev) => ({
                              ...prev,
                              [q.questionid]: {
                                ...(prev[q.questionid] || {}),
                                notes: note,
                                question: q.question
                              },
                            }));
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );  
};

export default AssessmentsPage;

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useCallback } from 'react';
//import supabase from '../lib/supabaseClient';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
export default function CreateMemberInline({ onUpdateTable }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      bimemberid: '',
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      medicareStatus: '',
      pcp: '',
      status: '',
      PayorACO: '',
      CarePartner_CareCoordinator: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation();
  const [, setMemberData]=useState([]);
  const queryParams = new URLSearchParams(location.search);
  const bimemberIdFromURL = queryParams.get("Id");

  // Function to fetch and bind member data
  const fetchMember = useCallback(async () => {
    if (!bimemberIdFromURL) return;

    const response = await axios.get(`http://localhost:9000/api/memberdetails/${bimemberIdFromURL}`);
    setMemberData(response);

    const formatDateToYMD = (isoDate) => {
      if (!isoDate) return '';
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    reset({
      bimemberid: response.data.bimemberid || '',
      firstName: response.data.firstname || '',
      lastName: response.data.lastname || '',
      gender: response.data.gender || '',
      dob: formatDateToYMD(response.data.dateofbirth) || '',
      medicareStatus: response.data.membermedicarestatus || '',
      pcp: response.data.pcp || '',
      status: response.data.status || '',
      PayorACO: response.data.programname || '',
      CarePartner_CareCoordinator: response.data.carecoordinator || ''
    });
  }, [bimemberIdFromURL, reset]);  // dependencies here

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      let memberId = formData.bimemberid;

      const response = await axios.get(`http://localhost:9000/api/memberdetails/${bimemberIdFromURL}`);

      const memberPayload = {
        bimemberid: formData.bimemberid,
        firstname: formData.firstName,
        lastname: formData.lastName,
        gender: formData.gender,
        dateofbirth: formData.dob,
        membermedicarestatus: formData.medicareStatus,
        pcp: formData.pcp,
        programname: formData.PayorACO,
        carecoordinator: formData.CarePartner_CareCoordinator,
        status: formData.status,
        edvisitscount: 0,
        admissioncount: 0,
        cmtriggersscore: 0,
        stratificationscore: 0,
      };

      if (response.data && response.data.bimemberid) {
        // Update existing member
        await axios.put(`http://localhost:9000/api/member/${memberId}`, memberPayload);
      } 
      // else {
      //   // Insert new member
      //   await axios.post(`http://localhost:9000/api/member`, memberPayload);
      // }


      onUpdateTable?.();
      reset();
      fetchMember(); // Re-fetch the member data to rebind the form
      setOpenDialog(true); // Show confirmation dialog
      setTimeout(() => {
        setOpenDialog(false);
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // const calculateAge = (dob) => {
  //   const birth = new Date(dob);
  //   const now = new Date();
  //   return now.getFullYear() - birth.getFullYear();
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{
          backgroundColor: '#fff',
          padding: 2,
          borderRadius: 2,
          boxShadow: 2,
          marginBottom: 3,
        }}
      >
        {/* Form fields */}
        <Grid item xs={2}>
          <Controller
            name="bimemberid"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Member ID" size="small" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={2}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="First Name" size="small" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={2}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Last Name" size="small" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={2}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select {...field} label="Gender">
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={2}>
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="DOB"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={2}>
          <Controller
            name="medicareStatus"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Medicare Status" size="small" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={2}>
          <Controller
            name="pcp"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="PCP" size="small" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={2}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Status" size="small" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={2}>
          <Controller
            name="PayorACO"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Payor/ACO" size="small" fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={2}>
          <Controller
            name="CarePartner_CareCoordinator"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Care Partner/Care Coordinator"
                size="small"
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={1}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            sx={{ height: '100%', backgroundColor: '#231e49' }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          Member Details are Saved successfully.
        </DialogContent>
        <DialogContent>
        Please wait to refresh the data.
        </DialogContent>
      </Dialog>
    </form>
  );
}

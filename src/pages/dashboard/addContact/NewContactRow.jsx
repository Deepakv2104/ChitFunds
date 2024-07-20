import React from 'react';
import { useFormik } from 'formik';
import { TextField, Grid, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validationSchema from './ValidationSchema';
const NewContactRow = ({ addContact }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      alternatePhone: '',
      aadharCardNo: '',
      chequeNo: '',
      profilePicUrl: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const contact = {
        ...values,
        key: new Date().getTime(),
      };
      await addContact(contact);
      toast.success('Contact added successfully!');
      resetForm();
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ height: '40px' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            name="phone"
            label="Phone"
            variant="outlined"
            fullWidth
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            sx={{ height: '40px' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            name="alternatePhone"
            label="Alternate Phone"
            variant="outlined"
            fullWidth
            value={formik.values.alternatePhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.alternatePhone && Boolean(formik.errors.alternatePhone)}
            helperText={formik.touched.alternatePhone && formik.errors.alternatePhone}
            sx={{ height: '40px' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            name="aadharCardNo"
            label="Aadhar Card No"
            variant="outlined"
            fullWidth
            value={formik.values.aadharCardNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.aadharCardNo && Boolean(formik.errors.aadharCardNo)}
            helperText={formik.touched.aadharCardNo && formik.errors.aadharCardNo}
            sx={{ height: '40px' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            name="chequeNo"
            label="Cheque No"
            variant="outlined"
            fullWidth
            value={formik.values.chequeNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.chequeNo && Boolean(formik.errors.chequeNo)}
            helperText={formik.touched.chequeNo && formik.errors.chequeNo}
            sx={{ height: '40px' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button type="submit" color="primary" fullWidth variant="contained" sx={{ backgroundColor: '#1976d2' }}>
            <AddIcon /> Add
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default NewContactRow;

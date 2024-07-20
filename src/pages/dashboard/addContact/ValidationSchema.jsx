import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone is required'),
  alternatePhone: yup
    .string()
    .matches(/^\d{10}$/, 'Alternate phone number must be exactly 10 digits')
    .required('Alternate Phone is required'),
  aadharCardNo: yup.string().required('Aadhar Card No is required'),
  chequeNo: yup.string().required('Cheque No is required'),
});

export default validationSchema;

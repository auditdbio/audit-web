import React, {useState} from 'react';
import {Box, Tabs, Tab, Typography, Button, InputAdornment} from "@mui/material";
import theme, {radiusOfComponents} from "../../../styles/themes.js";
import PasswordField from "../fields/password-field.jsx";
import {Form, Formik, Field} from 'formik';
import * as Yup from 'yup'
import SimpleField from "../fields/simple-field.jsx";

const SignupForm = () => {
    const [isAuditor, setIsAuditor] = useState('auditor')
    const initialValues = {
        role: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={(values) => {
                const newValue = {...values, role: isAuditor}
                console.log(newValue)
            }}
        >
            {({handleSubmit}) =>  (
                    <Form onSubmit={handleSubmit} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: '100%'
                    }}
                    >
                        <Typography sx={{
                            fontWeight: 500,
                            fontSize: '20px',
                            lineHeight: '24px',
                            textAlign: 'center'
                        }}>
                            Choose who you want to be
                        </Typography>
                        <Tabs
                            value={isAuditor}
                            onChange={(e, newValue) => {
                                setIsAuditor(newValue)
                            }}
                            name={'role'}
                            sx={tabsSx}
                            indicatorColor="none"
                        >
                            <Tab
                                value={'auditor'}
                                sx={[isAuditor === 'auditor' ? auditorTabSx
                                    : {backgroundColor: '#D9D9D9'}, tabSx]}
                                label="Auditor"/>
                            <Tab
                                value={'customer'}
                                sx={[isAuditor === 'customer' ? customerTabSx
                                    : {backgroundColor: '#D9D9D9'}, tabSx]}
                                label="Customer"/>
                        </Tabs>
                        <Box sx={fieldWrapper}>
                            <SimpleField name={'userName'} label={'User name'}/>
                            <SimpleField name={'email'} label={'E-mail'}/>
                            <PasswordField name={'password'} label={'Password'}/>
                            <PasswordField name={'confirmPassword'} label={'Confirm password'}/>
                            <Button type={'submit'} sx={submitButton}>Sing up</Button>
                        </Box>
                    </Form>
                )
            }
        </Formik>
    );
};

export default SignupForm;

const SignupSchema = Yup.object().shape({
    password: Yup.string()
        .min(2, 'Too Short!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('required'),
    userName: Yup.string().required('Required'),
    role: Yup.string(),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required')
});

const submitButton = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    padding: '20px 140px',
    color: '#FCFAF6',
    fontSize: '26px',
    fontWeight: 600,
    borderRadius: radiusOfComponents,
    maxWidth: '402px',
    margin: '0 auto',
    '&:hover': {
        backgroundColor: '#3a0154'
    },
    [theme.breakpoints.down('lg')]: {
        fontSize: '16px',
        paddingY: '15px'
    }
})

const fieldWrapper = (theme) => ({
    gap: '28px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.down('lg')]: {
        gap: '20px'
    }
})

const tabsSx = (theme) => ({
    marginTop: '36px',
    marginBottom: '76px',
    [theme.breakpoints.down('lg')]: {
        marginBottom: '40px'
    }
})

const tabSx = (theme) => ({
    width: '50%',
    color: '#222222',
    fontSize: '16px',
    textTransform: 'capitalize'
})

const auditorTabSx = (theme) => ({
    backgroundColor: theme.palette.primary.main,
    color: '#FCFAF6!important'
})

const customerTabSx = (theme) => ({
    color: '#FCFAF6!important',
    backgroundColor: theme.palette.secondary.main
})

const formLabelSx = (theme) => ({
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
    color: '#434242',
    [theme.breakpoints.down('lg')]: {
        fontSize: '14px'
    }
})

const fieldSx = (theme) => ({
    '& input': {
        paddingLeft: '35px'
    }
})

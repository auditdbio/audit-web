import React, {useState} from 'react';
import {Box, Typography, Button} from "@mui/material";
import theme, {radiusOfComponents} from "../../../styles/themes.js";
import PasswordField from "../fields/password-field.jsx";
import {Form, Formik, Field} from "formik";
import * as Yup from "yup";
import SimpleField from "../fields/simple-field.jsx";


const SigninForm = () => {
    const initialValues = {
        email: '',
        password: '',
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={SigninSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={(values) => {
                console.log(values)
            }}
        >
            {({handleSubmit}) => {
                return (
                    <Form onSubmit={handleSubmit}>
                        <Box sx={formWrapper}
                        >
                            <Box sx={fieldWrapper}>
                                <SimpleField name={'email'} label={'E-mail'}/>
                                <PasswordField name={'password'} label={'Password'}/>
                            </Box>
                            <Button type={'submit'} sx={submitButton}>Sing in</Button>
                        </Box>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default SigninForm;

const SigninSchema = Yup.object().shape({
    password: Yup.string()
        .min(2, 'Too Short!')
        .required('required'),
    email: Yup.string().email('Invalid email').required('required'),
});

const formWrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    gap: '106px',
    [theme.breakpoints.down('md')]: {
        gap: '75px'
    },
    [theme.breakpoints.down('xs')]: {
        gap: '60px',
    }
})

const submitButton = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    padding: '13px 140px',
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
        paddingY: '11px'
    },
    [theme.breakpoints.down('sm')]: {
        width: '225px',
        padding: '13px 80px',
        fontSize: '14px'
    }
})

const fieldWrapper = (theme) => ({
    gap: '28px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.down('lg')]: {
        gap: '20px'
    },
    [theme.breakpoints.down('md')]: {
        '& .MuiInputBase-root': {
            height: '44px',
            '& input': {
                paddingY: '7px'
            }
        }
    },
    [theme.breakpoints.down('sm')]: {
        gap: '16px',
        '& .password-wrapper, .field-wrapper': {
            gap: '16px'
        }
    }
})
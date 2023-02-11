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
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                            gap: '106px'
                        }}
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

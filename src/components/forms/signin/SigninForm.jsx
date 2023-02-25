import React from 'react';
import {Box, Button, Stack, Alert, AlertTitle, Snackbar} from "@mui/material";
import {radiusOfComponents} from "../../../styles/themes.js";
import PasswordField from "../fields/password-field.jsx";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import SimpleField from "../fields/simple-field.jsx";
import {useDispatch, useSelector} from "react-redux";
import {clearUserError, signIn} from "../../../redux/actions/userAction.js";


const SigninForm = () => {
    const dispatch = useDispatch()
    const error = useSelector(s => s.user.error)
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
                dispatch(signIn(values))
            }}
        >
            {({handleSubmit}) => {
                return (
                    <Form onSubmit={handleSubmit}>
                        <Box sx={formWrapper}
                        >
                            <Snackbar
                                autoHideDuration={10000}
                                open={!!error}
                                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                onClose={() => {
                                    dispatch(clearUserError())
                                }}
                            >
                                <Stack sx={{ width: '100%', flexDirection: 'column', gap: 2 }} spacing={2}>
                                    <Alert severity='error'>
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                </Stack>
                            </Snackbar>
                            <Box sx={fieldWrapper}>
                                <SimpleField name={'email'} label={'E-mail'}/>
                                <PasswordField name={'password'} label={'Password'}/>
                            </Box>
                            <Button type={'submit'} variant={'contained'} sx={submitButton}>Sing in</Button>
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
    gap: '75px',
    [theme.breakpoints.down('xs')]: {
        gap: '60px',
    }
})

const submitButton = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    padding: '11px 140px',
    color: '#FCFAF6',
    fontWeight: 600,
    borderRadius: radiusOfComponents,
    maxWidth: '402px',
    margin: '0 auto',
    fontSize: '16px',
    paddingY: '11px',
    [theme.breakpoints.down('sm')]: {
        width: '225px',
        padding: '13px 80px',
        fontSize: '14px'
    }
})

const fieldWrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '20px',
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
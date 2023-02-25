import React from 'react';
import {Form, Formik} from "formik";
import {Avatar, Box, Button, Slider, Typography, useMediaQuery} from "@mui/material";
import SimpleField from "../fields/simple-field.jsx";
import PasswordField from "../fields/password-field.jsx";
import TagsArray from "../../tagsArray/index.jsx";
import SalarySlider from "../salary-slider/salary-slider.jsx";
import theme from "../../../styles/themes.js";
import EditIcon from '@mui/icons-material/Edit';

const EditProfileForm = () => {
    const matchSm = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Formik
            initialValues={{}}
            // validationSchema={SigninSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={(values) => {
                // dispatch(signIn(values))
            }}
        >
            {({handleSubmit}) => {
                return (
                    <Form onSubmit={handleSubmit}>
                        <Box sx={wrapper}>
                            <Box sx={avatarWrapper}>
                                <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                    <Avatar/>
                                    <Button>
                                        <EditIcon fontSize={'small'}/>
                                        Edit photo
                                    </Button>
                                </Box>
                                { matchSm &&
                                    <Box sx={[fieldWrapper, {width: '100%'}]}>
                                        <SimpleField name={'first-name'} label={'First Name'}/>
                                        <SimpleField name={'last-name'} label={'Last name'}/>
                                    </Box>
                                }
                            </Box>
                            <Box sx={fieldsWrapper}>
                                <Box sx={fieldWrapper}>
                                    { !matchSm &&
                                        <>
                                            <SimpleField name={'first-name'} label={'First Name'}/>
                                            <SimpleField name={'last-name'} label={'Last name'}/>
                                        </>
                                    }
                                    <SimpleField name={'email'} label={'E-mail'}/>
                                    <PasswordField name={'password'} label={'Password'}/>
                                    <SimpleField name={'tags'} label={'Tags'}/>
                                </Box>
                                <Box sx={fieldWrapper}>
                                    <SimpleField name={'company'} label={'Company'}/>
                                    <SimpleField name={'about'} label={'About'}/>
                                    <SimpleField name={'telegram'} label={'Telegram'}/>
                                    <Box>
                                        <Typography sx={rateLabel}>
                                            Tax rate per stroke
                                        </Typography>
                                        <SalarySlider />
                                    </Box>
                                    <TagsArray/>
                                </Box>
                            </Box>
                        </Box>
                        <Button variant={'contained'} sx={buttonSx}>
                            Save changes
                        </Button>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default EditProfileForm;

const wrapper = (theme) => ({
    display: 'flex',
    gap: '52px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: '12px'
    },
})

const rateLabel = (theme) => ({
    fontSize: '15px',
    color: '#B2B3B3',
    fontWeight: 500
})

const fieldsWrapper = (theme) => ({
    display: 'flex',
    gap: '52px',
    width: '100%',
    '& p': {
        color: '#B2B3B3'
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: '14px'
    }
})

const fieldWrapper = (theme) => ({
    width: '100%',
    gap: '18px',
    display: 'flex',
    flexDirection: 'column',
    '& .password-wrapper': {
      gap: '12px'
    },
    '& .field-wrapper': {
        gap: '12px'
    },
    [theme.breakpoints.down('sm')]: {
        gap: '14px',
        '& .field-wrapper': {
            gap: '8px'
        },
        '& .password-wrapper': {
            gap: '8px'
        },
    },
    [theme.breakpoints.down('xs')]: {
        '& p': {
          fontSize: '12px'
        },
        '& input': {
            fontSize: '12px',
            paddingY: '9px'
        }
    }
})

const buttonSx = (theme) => ({
    display: 'block',
    margin: '70px auto 0',
    textTransform: 'unset',
    padding: '13px 0',
    fontWeight: 600,
    fontSize: '18px',
    width: '200px',
    borderRadius: '10px',
    [theme.breakpoints.down('md')]: {
        fontSize: '14px',
    },
    [theme.breakpoints.down('sm')]: {

    }
})

const avatarWrapper = (theme) => ({
    '& button': {
        textTransform: 'unset',
        marginTop: '35px',
        '& svg': {
            marginRight: '5px'
        }
    },
    '& .MuiAvatar-root': {
        width: '205px',
        height: '205px'
    },
    [theme.breakpoints.down('md')]: {
        '& .MuiAvatar-root': {
            width: '158px',
            height: '158px'
        },
        '& button': {
            marginTop: '25px',
            fontSize: '12px'
        }
    },
    [theme.breakpoints.down('sm')]: {
        '& .MuiAvatar-root': {
            width: '128px',
            height: '128px'
        },
        '& button': {
            marginTop: '15px',
        },
        display: 'flex',
        gap: '22px',
        '& p': {
            color: '#B2B3B3'
        },
    },
    [theme.breakpoints.down('xs')]: {
        '& .MuiAvatar-root': {
            width: '80px',
            height: '80px'
        },
        '& button': {
            paddingX: '4px',
            marginTop: '12px',
            fontSize: '8px'
        },
    }
})
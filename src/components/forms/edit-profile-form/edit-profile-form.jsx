import React, {useEffect, useMemo, useState} from 'react';
import {Field, Form, Formik} from "formik";
import {Avatar, Box, Button, Checkbox, Slider, TextField, Typography, useMediaQuery} from "@mui/material";
import SimpleField from "../fields/simple-field.jsx";
import PasswordField from "../fields/password-field.jsx";
import TagsArray from "../../tagsArray/index.jsx";
import SalarySlider from "../salary-slider/salary-slider.jsx";
import theme from "../../../styles/themes.js";
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom/dist";
import {createCustomer, getCustomer, updateCustomer} from "../../../redux/actions/customerAction.js";
import {useDispatch, useSelector} from "react-redux";
import {createAuditor, getAuditor, updateAuditor} from "../../../redux/actions/auditorAction.js";
import Loader from "../../Loader.jsx";
import {AUDITOR, CUSTOMER, PROJECTS} from "../../../redux/actions/types.js";
import TagsField from "../tags-field/tags-field.jsx";
import * as Yup from "yup";
import {changePassword} from "../../../redux/actions/userAction.js";
import ChangePasswordFormik from "../change-password-formik/index.jsx";
import AvatarForm from "../Avatar-form/index.jsx";
import {SliderRange} from "../salary-slider/slider-range.jsx";

const EditProfileForm = ({role}) => {
    const matchSm = useMediaQuery(theme.breakpoints.down('sm'))
    const dispatch = useDispatch()
    const customer = useSelector(s => s.customer.customer)
    const auditor = useSelector(s => s.auditor.auditor)

    const data = useMemo(() => {
        if (role === AUDITOR) {
            return auditor
        } else {
            return customer
        }
    }, [role, customer, auditor])

    if (!data) {
        return <Loader/>
    } else {
        return (
            <Formik
                initialValues={{
                    userId: data.user_id || '',
                    avatar: data.avatar || '',
                    free_at: '',
                    first_name: data?.first_name || '',
                    last_name: data?.last_name || '',
                    contacts: {
                        telegram: data?.contacts?.telegram || '',
                        email: data?.contacts?.email || '',
                        public_contacts: data.contacts?.public_contacts || false,
                    },
                    about: data?.about || '',
                    company: data?.company || '',
                    price_range: {
                        from: data?.price_range?.from || 0,
                        to: data?.price_range?.to || 0,
                    },
                    tags: data?.tags || [],
                }}
                validationSchema={EditProfileSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={(values) => {
                    if (role !== AUDITOR) {
                        if (!data.first_name && !data.last_name) {
                            dispatch(createCustomer(values))
                        } else {
                            dispatch(updateCustomer(values))
                        }
                    } else {
                        if (!data.first_name && !data.last_name) {
                            dispatch(createAuditor(values))
                        } else {
                            dispatch(updateAuditor(values))
                        }
                    }
                }}
            >
                {({handleSubmit, errors, values, setFieldValue}) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <Box sx={wrapper}>
                                <Box sx={avatarWrapper}>
                                    <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                        <AvatarForm name={'avatar'} role={role}/>
                                    </Box>
                                    {matchSm &&
                                        <Box sx={[fieldWrapper, {width: '100%'}]}>
                                            <SimpleField name={'first_name'} label={'First Name'}/>
                                            <SimpleField name={'last_name'} label={'Last name'}/>
                                        </Box>
                                    }
                                </Box>
                                <Box sx={fieldsWrapper}>
                                    <Box sx={fieldWrapper}>
                                        {!matchSm &&
                                            <>
                                                <SimpleField name={'first_name'} label={'First Name'}/>
                                                {/*<SimpleField name={'last_name'} label={'Last name'}/>*/}

                                            </>
                                        }
                                        <SimpleField name={'contacts.telegram'} label={'Telegram'}/>
                                        <Box>
                                            <SimpleField name={'contacts.email'} label={'E-mail'}/>
                                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: '5px'}}>
                                                <Checkbox
                                                    color={'success'}
                                                    id={'hide-contacts'}
                                                    checked={values.contacts?.public_contacts}
                                                    onChange={(e) => {
                                                        setFieldValue('contacts.public_contacts', e.target.checked)
                                                    }}
                                                />
                                                <label
                                                    htmlFor="hide-contacts"
                                                    style={{
                                                        width: '174px',
                                                        display: 'flex',
                                                        color: role === AUDITOR? theme.palette.secondary.main : theme.palette.primary.main,
                                                    }}
                                                >
                                                    Make contacts visible
                                                </label>
                                            </Box>
                                        </Box>
                                        <ChangePasswordFormik/>
                                        {!matchSm &&
                                            <TagsField name={'tags'} label={'Tags'}/>
                                        }
                                    </Box>
                                    <Box sx={fieldWrapper}>
                                        { !matchSm &&
                                            <SimpleField name={'last_name'} label={'Last name'}/>
                                        }
                                        {role === CUSTOMER &&
                                            <SimpleField name={'company'} label={'Company'}/>
                                        }
                                        <SimpleField name={'about'} label={'About'}/>
                                        {role !== CUSTOMER &&
                                            <Box>
                                                <Typography sx={rateLabel}>
                                                    Price per line of code
                                                </Typography>
                                                <Field
                                                    name="price_range"
                                                    value={values.price_range}
                                                    component={SliderRange}
                                                    sx={{
                                                        color: "#52176D",
                                                    }}
                                                    min={0}
                                                    max={200}
                                                    onChange={(e, newValue) => {
                                                        const value = Array.isArray(newValue) ? newValue : [newValue, newValue];
                                                        setFieldValue("price_range.from", value[0])
                                                        setFieldValue("price_range.to", value[1])
                                                    }}
                                                />
                                            </Box>
                                        }
                                        {matchSm &&
                                            <TagsField name={'tags'} label={'Tags'}/>
                                        }
                                        <TagsArray name={'tags'}/>
                                    </Box>
                                </Box>
                            </Box>
                            <Button
                                type={'submit'}
                                variant={'contained'}
                                sx={[buttonSx, role === AUDITOR ?
                                    {backgroundColor: theme.palette.secondary.main} : {}]}
                            >
                                Save changes
                            </Button>
                        </Form>
                    )
                }}
            </Formik>
        );
    }
};

export default EditProfileForm;

const EditProfileSchema = Yup.object().shape({
    first_name: Yup.string().required('Required'),
    last_name: Yup.string().required('Required'),
    contacts: Yup.object().shape({
        email: Yup.string().email('Invalid email').required('required'),
        telegram: Yup.string()
    }),
    about: Yup.string(),
    tags: Yup.array().min(1)
});

const PasswordValidation = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Too Short!'),
})

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
    '& .tags-array-wrapper': {
      margin: 'auto 0 0 0'
    },
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
    [theme.breakpoints.down('sm')]: {}
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

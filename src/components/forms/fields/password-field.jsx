import {InputAdornment, Typography} from "@mui/material";
import {Field, useField} from 'formik';
import { TextField } from 'formik-mui'
import React, {useState} from 'react';
import EyeIcon from "../../icons/eye-icon.jsx";
import RemovedEyeIcon from "../../icons/removed-eye-icon.jsx";

const PasswordField = ({name, label}) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    return (
        <>
            <Typography sx={formLabelSx}>{label}</Typography>
            <Field
                component={TextField}
                placeholder={'● ● ● ● ● ● ●'}
                fullWidth={true}
                sx={fieldSx}
                name={name}
                disabled={false}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment
                            sx={{cursor: 'pointer'}}
                            position="end"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            { showPassword ? <RemovedEyeIcon/> : <EyeIcon /> }
                        </InputAdornment>
                    ),
                }}
            />
        </>
    );
};

export default PasswordField;

const fieldSx = (theme) => ({
    '& input': {
        paddingLeft: '35px'
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
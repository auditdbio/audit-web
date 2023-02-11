import React from 'react';
import {Typography} from "@mui/material";
import {Field} from "formik";
import {TextField} from "formik-mui";

const SimpleField = ({name, label}) => {
    return (
        <>
            <Typography sx={formLabelSx}>{label}</Typography>
            <Field
                component={TextField}
                name={name}
                placeholder={'● ● ● ● ● ● ●'}
                fullWidth={true}
                disabled={false}
                sx={fieldSx}
            />
        </>
    );
};

export default SimpleField;

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
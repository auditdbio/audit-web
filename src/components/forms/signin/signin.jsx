import React, {useState} from 'react';
import {Box, Tabs, TextField, Tab, Typography, Button} from "@mui/material";
import {CustomCard} from "../../custom/Card";
import theme, {radiusOfComponents} from "../../../styles/themes.js";

const SigninForm = () => {

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            gap: '106px'
        }}
        >
            <Box sx={fieldWrapper}>
                <Typography sx={formLabelSx}>E-mail</Typography>
                <TextField
                    placeholder={''}
                    fullWidth={true}
                    sx={fieldSx}
                />
                <Typography sx={formLabelSx}>Password</Typography>
                <TextField
                    placeholder={''}
                    fullWidth={true}
                    sx={fieldSx}
                />
            </Box>
            <Button sx={submitButton}>Sing up</Button>
        </Box>
    );
};

export default SigninForm;

const submitButton = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    padding: '13px 140px',
    color: '#FCFAF6',
    fontSize: '26px',
    fontWeight: 600,
    borderRadius: radiusOfComponents,
    maxWidth: '402px',
    margin: '0 auto',
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

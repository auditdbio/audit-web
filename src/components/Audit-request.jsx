import React from 'react';
import {Box, Grid} from "@mui/material";
import AuditRequestCard from "./Audit-request-card";

const AuditRequest = () => {
    return (
        <Box sx={wrapper}>
            <Grid container spacing={2} >
                <Grid item sx={gridItemStyle}>
                    <AuditRequestCard />
                </Grid>
                <Grid item sx={gridItemStyle}>
                    <AuditRequestCard />
                </Grid>
                <Grid item sx={gridItemStyle}>
                    <AuditRequestCard />
                </Grid>
                <Grid item sx={gridItemStyle}>
                    <AuditRequestCard />
                </Grid>
                <Grid item sx={gridItemStyle}>
                    <AuditRequestCard />
                </Grid>
                <Grid item sx={gridItemStyle}>
                    <AuditRequestCard />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AuditRequest;

const wrapper = (theme) => ({
    padding: '58px 52px 42px',
    [theme.breakpoints.down('md')]: {
        padding: '45px 40px 33px'
    },
    [theme.breakpoints.down('sm')]: {
        padding: '36px 25px 45px'
    }
})

const gridItemStyle = (theme) => ({
    width: '25%',
    [theme.breakpoints.down('sm')]: {
        width: '33.330%'
    },
    [theme.breakpoints.down('xs')]: {
        width: '100%'
    }
})
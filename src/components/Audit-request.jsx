import React from 'react';
import {Box, Grid} from "@mui/material";
import AuditRequestCard from "./Audit-request-card";
import {useSelector} from "react-redux";

const AuditRequest = () => {
    const auditRequests = useSelector(s => s.audits.auditRequests)

    return (
        <Box sx={wrapper}>
            <Grid container spacing={2} >
                {
                    auditRequests?.map(request =>
                        <Grid item sx={gridItemStyle} key={request.id}>
                            <AuditRequestCard request={request} />
                        </Grid>
                    )
                }
            </Grid>
        </Box>
    );
};

export default AuditRequest;

const wrapper = (theme) => ({
    padding: '58px 52px 42px',
    minHeight: '560px',
    width: '100%',
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
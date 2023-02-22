import React from 'react';
import {Box, Grid} from "@mui/material";
import PublicProjectCard from "./homepage/auditors-projects-section/PublicProjectCard.jsx";
import AuditCard from "./Audit-card.jsx";
import theme from "../styles/themes.js";

const Audits = () => {
    return (
        <Box sx={wrapper}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={3} sm={4} sx={gridItemStyle}>
                    <AuditCard />
                </Grid>
                <Grid item xs={6} md={3} sm={4} sx={gridItemStyle}>
                    <AuditCard />
                </Grid>
                <Grid item xs={6} md={3} sm={4} sx={gridItemStyle}>
                    <AuditCard />
                </Grid>
                <Grid item xs={6} md={3} sm={4} sx={gridItemStyle}>
                    <AuditCard />
                </Grid>
                <Grid item xs={6} md={3} sm={4} sx={gridItemStyle}>
                    <AuditCard />
                </Grid>
                <Grid item xs={6} md={3} sm={4} sx={gridItemStyle}>
                    <AuditCard />
                </Grid>
                <Grid item xs={6} md={3} sm={4} sx={gridItemStyle}>
                    <AuditCard />
                </Grid>
                <Grid item xs={6} md={3} sm={4} sx={gridItemStyle}>
                    <AuditCard />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Audits;

const wrapper = (theme => ({
    padding: '54px 53px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        padding: '22px'
    }
}))

export const gridItemStyle = (theme) => ({
    [theme.breakpoints.down('xs')]: {
        width: '50%'
    }
})
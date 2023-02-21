import React from 'react';
import {Box, Grid} from "@mui/material";
import PublicProjectCard from "./homepage/auditors-projects-section/PublicProjectCard.jsx";

const Audits = () => {
    return (
        <Grid container spacing={3}>
            <Grid item lg={3} sx={gridItemStyle}>
                <PublicProjectCard />
            </Grid>
            <Grid item lg={3} sx={gridItemStyle}>
                <PublicProjectCard />
            </Grid>
            <Grid item lg={3} sx={gridItemStyle}>
                <PublicProjectCard />
            </Grid>
        </Grid>
    );
};

export default Audits;

const gridItemStyle = (theme) => ({
    // '& '
})
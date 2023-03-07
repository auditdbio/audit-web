import React from 'react';
import Layout from "../styles/Layout.jsx";
import {Box, Button} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";

const ProjectPage = () => {
    return (
        <Layout>
            <Box>
                <Button>
                    <ArrowBackIcon color={'secondary'}/>
                </Button>
            </Box>
        </Layout>
    );
};

export default ProjectPage;
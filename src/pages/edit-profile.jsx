import React from 'react';
import {Box} from "@mui/material";
import Layout from "../styles/Layout.jsx";
import {CustomCard} from "../components/custom/Card.jsx";
import EditProfileForm from "../components/forms/edit-profile-form/edit-profile-form.jsx";

const EditProfile = () => {
    return (
        <Layout>
            <CustomCard sx={editWrapper}>
                <EditProfileForm/>
            </CustomCard>
        </Layout>
    );
};

export default EditProfile;

const editWrapper = (theme) => ({
    padding: '41px 68px 70px',
    [theme.breakpoints.down('sm')]: {
        padding: '41px 48px 50px'
    },
    [theme.breakpoints.down('xs')]: {
        padding: '31px 28px 40px'
    }
})
import React from 'react';
import {Box} from "@mui/material";
import {ContentWrapper} from "../styles/themes.js";
import Layout from "../styles/Layout.jsx";
import {CustomCard} from "../components/custom/Card";
import SigninForm from "../components/forms/signin/SigninForm.jsx";


const SigninPage = () => {
    return (
        <Layout>
            <CustomCard sx={cardWrapper}>
                <SigninForm/>
            </CustomCard>
        </Layout>
    );
};

export default SigninPage;

const cardWrapper = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
        padding: '30px 40px',
    [theme.breakpoints.down('sm')]: {
        paddingY: '78px'
    }
})
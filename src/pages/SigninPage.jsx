import React from 'react';
import {Box} from "@mui/material";
import {ContentWrapper} from "../styles/themes.js";
import Layout from "../styles/Layout.jsx";
import {CustomCard} from "../components/custom/Card";
import SigninForm from "../components/forms/signin/signin.jsx";


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
    padding: '109px 130px',
    [theme.breakpoints.down('lg')]: {
        padding: '30px 40px',
    }
})
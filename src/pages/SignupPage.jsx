import React from 'react';
import Layout from "../styles/Layout.jsx";
import {CustomCard} from "../components/custom/Card";
import SignupForm from "../components/forms/signup/SignupForm.jsx";


const SignupPage = () => {
    return (
        <Layout>
            <CustomCard sx={cardWrapper}>
                <SignupForm/>
            </CustomCard>
        </Layout>
    );
};

export default SignupPage;

const cardWrapper = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '109px 130px',
    [theme.breakpoints.down('lg')]: {
        padding: '30px 40px',
    }
})
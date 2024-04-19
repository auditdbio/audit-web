import React from 'react';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card';
import SignupForm from '../components/forms/signup/SignupForm.jsx';
import Headings from '../router/Headings.jsx';

const SignupPage = () => {
  return (
    <Layout>
      <Headings title="Sign Up" />

      <CustomCard sx={cardWrapper}>
        <SignupForm />
      </CustomCard>
    </Layout>
  );
};

export default SignupPage;

const cardWrapper = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px 30px',
};

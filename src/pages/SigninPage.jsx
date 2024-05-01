import React from 'react';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card';
import SigninForm from '../components/forms/signin/SigninForm.jsx';
import Headings from '../router/Headings.jsx';

const SigninPage = () => {
  return (
    <Layout>
      <Headings title="Sign In" />

      <CustomCard sx={cardWrapper}>
        <SigninForm />
      </CustomCard>
    </Layout>
  );
};

export default SigninPage;

const cardWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '30px 40px',
  [theme.breakpoints.down('sm')]: {
    paddingY: '78px',
  },
});

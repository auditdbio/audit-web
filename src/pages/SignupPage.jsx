import React, { useEffect } from 'react';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card';
import SignupForm from '../components/forms/signup/SignupForm.jsx';
import { isAuth } from '../lib/helper.js';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth()) {
      navigate('/');
    }
  }, [isAuth()]);
  return (
    <Layout>
      <CustomCard sx={cardWrapper}>
        <SignupForm />
      </CustomCard>
    </Layout>
  );
};

export default SignupPage;

const cardWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '30px 40px',
});

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import EditProfileForm from '../components/forms/edit-profile-form/edit-profile-form.jsx';
import ChangePasswordFormik from '../components/forms/change-password-formik/index.jsx';
import ChangeLinkId from '../components/forms/change-link-id/index.jsx';
import { getCustomer } from '../redux/actions/customerAction.js';
import { getAuditor } from '../redux/actions/auditorAction.js';

const EditProfile = () => {
  const role = useSelector(s => s.user.user.current_role);
  const [newLinkId, setNewLinkId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (role === 'auditor') {
      dispatch(getCustomer());
    } else {
      dispatch(getAuditor());
    }
  }, [role]);

  return (
    <Layout>
      <CustomCard sx={editWrapper}>
        <EditProfileForm role={role} newLinkId={newLinkId} />
        <ChangeLinkId setNewLinkId={setNewLinkId} />
        <ChangePasswordFormik />
      </CustomCard>
    </Layout>
  );
};

export default EditProfile;

const editWrapper = theme => ({
  padding: '41px 68px 70px',
  [theme.breakpoints.down('sm')]: {
    padding: '41px 48px 50px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '31px 28px 40px',
  },
});

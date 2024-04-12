import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import EditProfileForm from '../components/forms/edit-profile-form/edit-profile-form.jsx';
import ChangePasswordFormik from '../components/forms/change-password-formik/index.jsx';
import ChangeLinkId from '../components/forms/change-link-id/index.jsx';
import { getCustomer } from '../redux/actions/customerAction.js';
import { getAuditor } from '../redux/actions/auditorAction.js';
import Headings from '../router/Headings.jsx';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';

const EditProfile = () => {
  const dispatch = useDispatch();

  const role = useSelector(s => s.user.user.current_role);
  const { auditor } = useSelector(s => s.auditor);
  const { customer } = useSelector(s => s.customer);

  const [newLinkId, setNewLinkId] = useState(null);
  const [showChangeLinkId, setShowChangeLinkId] = useState(false);

  useEffect(() => {
    if (
      (role === AUDITOR && auditor?.user_id) ||
      (role === CUSTOMER && customer?.user_id)
    ) {
      setShowChangeLinkId(true);
    }
  }, [auditor, customer]);

  useEffect(() => {
    if (role === 'auditor') {
      dispatch(getCustomer());
    } else {
      dispatch(getAuditor());
    }
  }, [role]);

  return (
    <Layout>
      <Headings title="Edit Profile" noIndex={true} />

      <CustomCard sx={editWrapper}>
        <EditProfileForm role={role} newLinkId={newLinkId} />
        <Box sx={{ mt: '30px' }}>
          {showChangeLinkId && <ChangeLinkId setNewLinkId={setNewLinkId} />}
          <ChangePasswordFormik />
        </Box>
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

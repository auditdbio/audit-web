import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import Headings from '../router/Headings.jsx';
import CreateEditOrganizationForm from '../components/forms/create-edit-organization-form/CreateEditOrganizationForm.jsx';
import { useParams } from 'react-router-dom/dist';
import {
  clearOrganization,
  getOrganizationById,
} from '../redux/actions/organizationAction.js';
import ChangeLinkId from '../components/forms/change-link-id/index.jsx';
import NotFound from './Not-Found.jsx';
import { Box } from '@mui/material';
import Loader from '../components/Loader.jsx';

const CreateEditOrganization = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = useSelector(s => s.user.user.current_role);
  const organization = useSelector(s => s.organization.organization);
  const notFound = useSelector(s => s.organization.notFound);
  const [newLinkId, setNewLinkId] = useState(null);
  const [showChangeLinkId, setShowChangeLinkId] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getOrganizationById(id));
    }
    return () => {
      // if (id) {
      dispatch(clearOrganization());
      // }
    };
  }, [id]);

  if (!notFound) {
    return (
      <Layout>
        <Headings
          title={id ? 'Edit Organization' : 'Create Organization'}
          noIndex={true}
        />

        <CustomCard sx={editWrapper}>
          <CreateEditOrganizationForm
            role={role}
            needLoad={!!id}
            newLinkId={newLinkId}
            organization={organization}
          />
          {organization.id && (
            <ChangeLinkId org={organization} setNewLinkId={setNewLinkId} />
          )}
        </CustomCard>
      </Layout>
    );
  } else {
    return <NotFound />;
  }
};

export default CreateEditOrganization;

const editWrapper = theme => ({
  padding: '41px 68px 70px',
  [theme.breakpoints.down('sm')]: {
    padding: '41px 48px 50px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '31px 28px 40px',
  },
});
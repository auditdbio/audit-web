import React, { useMemo, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Typography,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import theme from '../styles/themes.js';
import { useNavigate, useParams, Link } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import { ASSET_URL } from '../services/urls.js';
import Headings from '../router/Headings.jsx';
import Layout from '../styles/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import InfoCard from '../components/custom/info-card.jsx';

const MyOrganization = () => {
  const role = useSelector(s => s.user.user.current_role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchXxs = useMediaQuery(theme.breakpoints.down(590));
  const own = useSelector(s => s.organization.own);
  const organizations = useSelector(s => s.organization.includeMe);

  const {
    customer,
    error: customerError,
    success: customerSuccess,
  } = useSelector(s => s.customer);
  const {
    auditor,
    error: auditorError,
    success: auditorSuccess,
  } = useSelector(s => s.auditor);
  const { user, error } = useSelector(s => s.user);

  if (!organizations.length && !own.length) {
    return (
      <Layout>
        <Headings title="Organization" />
        <CustomCard
          sx={[
            wrapper,
            { height: '100%', justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Loader />
        </CustomCard>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <CustomCard sx={wrapper}>
          <Box role={role} sx={{ position: 'relative' }}>
            <Button
              sx={{
                top: '15px',
                left: '10px',
                position: 'absolute',
                minWidth: 'unset',
              }}
              onClick={() => navigate(`/${user.current_role[0]}/${user.id}`)}
            >
              <ArrowBackIcon
                color={role === CUSTOMER ? 'primary' : 'secondary'}
              />
            </Button>
            <Box sx={innerWrapper}>
              <Box sx={contentWrapper}>
                {!!own.length && (
                  <Box sx={{ width: '100%' }}>
                    <Typography variant={'h4'}>My organizations</Typography>
                    <Box
                      sx={{
                        gap: '25px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '100%',
                        mt: '25px',
                      }}
                    >
                      {own?.map(org => {
                        return (
                          <Link to={`/o/${org.link_id}`} key={org.id}>
                            <Tooltip title={org.name} placement="top" arrow>
                              <Box sx={organizationSx}>
                                <Avatar
                                  src={
                                    org.avatar
                                      ? `${ASSET_URL}/${org.avatar}`
                                      : ''
                                  }
                                  sx={avatarSx}
                                />
                                <Typography sx={{ mt: '10px' }}>
                                  {org.name}
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Link>
                        );
                      })}
                    </Box>
                  </Box>
                )}
                {!!organizations.length && (
                  <Box sx={{ width: '100%' }}>
                    <Typography variant={'h4'}>Organizations</Typography>
                    <Box
                      sx={{
                        gap: '25px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '100%',
                        mt: '25px',
                      }}
                    >
                      {organizations?.map(org => {
                        return (
                          <Link to={`/o/${org.link_id}`} key={org.id}>
                            <Tooltip title={org.name} placement="top" arrow>
                              <Box sx={organizationSx}>
                                <Avatar
                                  src={
                                    org.avatar
                                      ? `${ASSET_URL}/${org.avatar}`
                                      : ''
                                  }
                                  sx={avatarSx}
                                />
                                <Typography sx={{ mt: '10px' }}>
                                  {org.name}
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Link>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </CustomCard>
      </Layout>
    );
  }
};

export default MyOrganization;

const wrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1300px',
  width: '100%',
  '& ul': {
    fontSize: '16px',
    marginBottom: '28px',
    '& li': {
      marginLeft: '15px',
      marginTop: '7px',
    },
  },
});

const innerWrapper = theme => ({
  width: '100%',
  minHeight: '520px',
  display: 'flex',
  flexDirection: 'column',
  padding: '60px 40px 40px',
  gap: '30px',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '20px',
    paddingTop: '55px',

    '& h4': {
      fontSize: '25px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
    gap: '25px',
    '& h4': {
      fontSize: '20px',
    },
    '& .mobile-tag-wrapper': {
      maxWidth: '380px',
    },
  },
});

const avatarSx = theme => ({
  height: '100px',
  width: '100px',
  padding: '5px',
  border: `1px solid ${theme.palette.primary.main}`,
  [theme.breakpoints.down('sm')]: {
    width: '80px',
    height: '80px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '50px',
    height: '50px',
  },
});

const organizationSx = theme => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    '& p': {
      fontSize: '14px',
    },
  },
});

const contentWrapper = theme => ({
  display: 'flex',
  gap: '30px',
  flexDirection: 'column',
  alignItems: 'center',
  '& a': {
    textDecoration: 'none',
    color: 'black',
  },
});

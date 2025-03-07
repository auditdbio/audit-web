import React, { useMemo, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Typography,
  useMediaQuery,
  Tooltip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import theme from '../styles/themes.js';
import { useNavigate, useParams, Link } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import Layout from '../styles/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import OrganizationCard from '../components/OrganizationCard.jsx';
import Badge from '@mui/material/Badge';
import { CLEAR_NOT_FOUND_ERROR } from '../redux/actions/types.js';

const MyOrganization = () => {
  const role = useSelector(s => s.user.user.current_role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchXxs = useMediaQuery(theme.breakpoints.down(590));
  const own = useSelector(s => s.organization.own);
  const organizations = useSelector(s => s.organization.includeMe);
  const invites = useSelector(s => s.organization.invites);
  const loading = useSelector(s => s.organization.loading);
  const errorRequest = useSelector(s => s.organization.errorRequest);
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

  useEffect(() => {
    return () => {
      if (errorRequest) {
        dispatch({type: CLEAR_NOT_FOUND_ERROR});
      }
    }
  }, [errorRequest]);

  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Button
          sx={{
            top: '10px',
            left: '0px',
            position: 'absolute',
            minWidth: 'unset',
          }}
          onClick={() => navigate(`/${user.current_role[0]}/${user.id}`)}
        >
          <ArrowBackIcon color={role === CUSTOMER ? 'primary' : 'secondary'} />
        </Button>
        <Box sx={innerWrapper}>
          <Box sx={contentWrapper}>
            {!organizations.length && !own.length && !errorRequest ? (
              <Box>
                <Loader />
              </Box>
            ) : (
              <>
                {!!invites.length && (
                  <Box sx={{ width: '100%' }}>
                    <Typography variant={'h4'}>Invites</Typography>
                    <Grid
                      sx={gridSx}
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      {invites?.map(org => {
                        return (
                          <Grid sx={gridItemSx} item>
                            <Badge
                              badgeContent={'Invite'}
                              color={
                                role === CUSTOMER ? 'primary' : 'secondary'
                              }
                              sx={{
                                '& .MuiBadge-badge': {
                                  top: '20px',
                                  right: '34px',
                                },
                              }}
                            >
                              <OrganizationCard org={org} />
                            </Badge>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
                {!!own.length && (
                  <Box sx={{ width: '100%' }}>
                    <Typography variant={'h4'}>My organizations</Typography>
                    <Grid
                      sx={gridSx}
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      {own?.map(org => {
                        return (
                          <Grid sx={gridItemSx} item>
                            <OrganizationCard org={org} />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
                {!!organizations.length && (
                  <Box sx={{ width: '100%' }}>
                    <Typography variant={'h4'}>Organizations</Typography>
                    <Grid
                      sx={gridSx}
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      {organizations?.map(org => {
                        return (
                          <Grid sx={gridItemSx} key={org.id} item>
                            <OrganizationCard org={org} />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
              </>
            )}
          </Box>
          <Button
            onClick={() => navigate('/create-organization')}
            variant={'contained'}
            color={role === CUSTOMER ? 'primary' : 'secondary'}
            sx={buttonSx}
          >
            Create organization
          </Button>
        </Box>
      </CustomCard>
    </Layout>
  );
  // }
};

export default MyOrganization;

const buttonSx = theme => ({
  margin: '0 auto',
  display: 'block',
  color: theme.palette.background.default,
  textTransform: 'capitalize',
  fontWeight: 600,
  fontSize: '18px',
  // padding: '9px 50px',
  width: '234px',
  borderRadius: '10px',
  [theme.breakpoints.down('xs')]: {
    padding: '9px 10px',
  },
});

const gridSx = theme => ({
  mt: '5px!important',
  marginLeft: '-16px',
  [theme.breakpoints.down('xs')]: {
    marginLeft: '-8px',
  },
});

const gridItemSx = theme => ({
  width: '20%',
  '& .MuiBadge-root': {
    width: '100%',
  },
  '& .org-card': {
    width: '100%',
  },
  [theme.breakpoints.down('md')]: {
    width: '25%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '33.33%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '50%',
    paddingTop: '15px',
    paddingLeft: '15px',
  },
});

const wrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
  '& ul': {
    fontSize: '16px',
    marginBottom: '28px',
    '& li': {
      marginLeft: '15px',
      marginTop: '7px',
    },
  },
  padding: '25px 30px 60px',
  [theme.breakpoints.down('md')]: {
    padding: '20px 24px 20px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '30px 10px 20px',
    '& h3': {
      fontSize: '20px',
    },
  },
  [theme.breakpoints.down(780)]: {
    borderRadius: '0!important',
  },
});

const innerWrapper = theme => ({
  width: '100%',
  minHeight: '520px',
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  justifyContent: 'space-between',
  '& h4': {
    textAlign: 'center',
  },
  [theme.breakpoints.down('sm')]: {},
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

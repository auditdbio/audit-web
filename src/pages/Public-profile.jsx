import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import Loader from '../components/Loader.jsx';
import { Box } from '@mui/system';
import { ASSET_URL } from '../services/urls.js';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import MobileTagsList from '../components/MobileTagsList/index.jsx';
import TagsList from '../components/tagsList.jsx';
import theme from '../styles/themes.js';
import { getCurrentAuditor } from '../redux/actions/auditorAction.js';
import { getCurrentCustomer } from '../redux/actions/customerAction.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import {
  changeRolePublicCustomer,
  changeRolePublicCustomerNoRedirect,
} from '../redux/actions/userAction.js';
import { getCustomerProjects } from '../redux/actions/projectAction.js';
import ProjectCardList from '../components/Project-card-list.jsx';
import AuditCard from '../components/Audit-card.jsx';
import { getUserAudits } from '../redux/actions/auditAction.js';

const PublicProfile = ({ currentRole, ownerId }) => {
  const { role, id } = useParams();
  const navigate = useNavigate();
  const customer = useSelector(s => s.customer.currentCustomer);
  const auditor = useSelector(s => s.auditor.currentAuditor);
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));
  const userProjects = useSelector(s => s.project.myProjects);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const customerReducer = useSelector(state => state.customer.customer);
  const myProjects = useSelector(state => state.project.myProjects);
  const user = useSelector(state => state.user.user);
  const customerProjects = useSelector(s => s.project.customerProjects);
  const userAudits = useSelector(s => s.audits.userAudits);
  const [showMore, setShowMore] = useState(false);
  const [showMoreAudits, setShowMoreAudits] = useState(false);
  const handleError = () => {
    setErrorMessage(null);
    setMessage('Switched to customer role');
    const delayedFunc = setTimeout(() => {
      if (userProjects.length) {
        navigate(`/my-projects/${auditor.user_id}`);
      } else {
        setMessage(null);
        setErrorMessage('No active projects');
      }
    }, 1000);
    return () => clearTimeout(delayedFunc);
  };

  const handleInvite = () => {
    if (user.current_role === CUSTOMER && isAuth() && myProjects.length) {
      navigate(`/my-projects/${auditor.user_id}`);
    } else if (
      user.current_role !== CUSTOMER &&
      isAuth() &&
      !customerReducer?.first_name
    ) {
      dispatch(changeRolePublicCustomer(CUSTOMER, user.id, customerReducer));
      handleError();
    } else if (
      user.current_role !== CUSTOMER &&
      isAuth() &&
      customerReducer?.first_name
    ) {
      dispatch(
        changeRolePublicCustomerNoRedirect(CUSTOMER, user.id, customerReducer),
      );
      handleError();
    } else if (
      user.current_role === CUSTOMER &&
      isAuth() &&
      !myProjects.length
    ) {
      setErrorMessage('No active projects');
    } else {
      navigate('/sign-in');
    }
  };

  useEffect(() => {
    if ((currentRole || role).toLowerCase() === AUDITOR) {
      dispatch(getUserAudits(id || ownerId, currentRole || role));
      if (!ownerId) {
        dispatch(getCurrentAuditor(id));
      }
    } else {
      dispatch(getCustomerProjects(id || ownerId));
      dispatch(getUserAudits(id || ownerId, currentRole || role));
      if (!ownerId) {
        dispatch(getCurrentCustomer(id));
      }
    }
  }, [id, role, currentRole, ownerId]);

  const data = useMemo(() => {
    if ((currentRole || role).toLowerCase() === AUDITOR) {
      return auditor;
    } else {
      return customer;
    }
  }, [role, customer, auditor, currentRole]);

  if (!data && !customerProjects && !userAudits && !ownerId) {
    return (
      <Box sx={mainWrapper(theme, ownerId)}>
        <Box
          sx={[
            wrapper(
              theme,
              (currentRole || role).toLowerCase() === AUDITOR
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
            ),
            {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Loader role={role || currentRole} />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box sx={mainWrapper(theme, ownerId)}>
        {!ownerId && (
          <Box
            sx={wrapper(
              theme,
              (currentRole || role).toLowerCase() === AUDITOR
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
            )}
          >
            <Box sx={contentWrapper}>
              <CustomSnackbar
                autoHideDuration={3000}
                open={!!message || !!errorMessage}
                onClose={() => {
                  setErrorMessage(null);
                  setMessage(null);
                }}
                severity={!errorMessage ? 'success' : 'error'}
                text={message || errorMessage}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={data?.avatar && `${ASSET_URL}/${data?.avatar}`}
                  sx={avatarStyle}
                  alt="User photo"
                />
              </Box>
              <Box sx={{ [theme.breakpoints.down(560)]: { width: '100%' } }}>
                <Box sx={infoStyle}>
                  <Box sx={infoInnerStyle}>
                    <Box sx={infoWrapper}>
                      <span>First Name</span>
                      <Typography noWrap={true}>{data?.first_name}</Typography>
                    </Box>
                    <Box sx={infoWrapper}>
                      <span>Last name</span>
                      <Typography noWrap={true}>{data?.last_name}</Typography>
                    </Box>
                    {(currentRole || role) === AUDITOR && (
                      <Box sx={infoWrapper}>
                        <span>Price range:</span>
                        {data?.price_range?.from && data?.price_range?.to && (
                          <Typography>
                            ${data?.price_range?.from} - {data?.price_range?.to}{' '}
                            per line
                          </Typography>
                        )}
                      </Box>
                    )}
                    {(currentRole || role) !== AUDITOR && (
                      <Box sx={infoWrapper}>
                        <span>Company</span>
                        <Typography noWrap={true}>{data?.company}</Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={infoInnerStyle}>
                    <Box sx={infoWrapper}>
                      <span>E-mail</span>
                      <Typography noWrap={true}>
                        {data?.contacts?.public_contacts
                          ? data?.contacts?.email
                          : 'Hidden'}
                      </Typography>
                    </Box>
                    <Box sx={infoWrapper}>
                      <span>Telegram</span>
                      <Typography noWrap={true}>
                        {data?.contacts?.public_contacts
                          ? data?.contacts?.telegram
                          : 'Hidden'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {!matchSm && (
                  <Box sx={aboutWrapper}>
                    <Box sx={infoWrapper}>
                      <Typography
                        sx={{
                          wordBreak: 'break-word',
                          maxWidth: 'unset!important',
                        }}
                      >
                        <span className={'about-title'}>About</span>
                        {data?.about}
                      </Typography>
                    </Box>
                    <TagsList data={data?.tags} fullView={true} />
                  </Box>
                )}
              </Box>
            </Box>
            {matchSm && (
              <Box sx={aboutWrapper}>
                <Box sx={[infoWrapper, { flexDirection: 'column' }]}>
                  <span
                    className={'about-title'}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    About
                  </span>
                  <Typography
                    sx={{
                      wordBreak: 'break-word',
                      maxWidth: 'unset!important',
                    }}
                  >
                    {data?.about}
                  </Typography>
                </Box>
                <MobileTagsList data={data?.tags} />
              </Box>
            )}
            {/*{matchXs && <MobileTagsList data={data.tags} />}*/}
            {(currentRole || role).toLowerCase() === AUDITOR && (
              <Button
                variant={'contained'}
                sx={[submitAuditor, buttonSx]}
                onClick={handleInvite}
                {...addTestsLabel('invite-button')}
              >
                Invite to project
              </Button>
            )}
          </Box>
        )}

        {isAuth() && (
          <Grid container sx={gridWrapper(ownerId)} spacing={0}>
            {(currentRole || role).toLowerCase() === CUSTOMER && (
              <Grid
                item
                sm={6}
                sx={matchSm ? { marginBottom: '60px', width: '100%' } : {}}
              >
                <Box
                  sx={[
                    projectsWrapper,
                    !matchSm ? { borderRightColor: '#F90' } : {},
                  ]}
                >
                  <Box sx={headWrapper}>Projects</Box>
                  <ProjectCardList
                    projects={
                      showMore
                        ? customerProjects
                        : customerProjects?.slice(0, 8)
                    }
                    isPublic={true}
                  />
                  {customerProjects?.length > 8 && (
                    <Button
                      sx={moreBtnSx}
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore ? 'Hide' : 'View more'}
                    </Button>
                  )}
                </Box>
              </Grid>
            )}
            <Grid
              item
              sx={{ width: '100%' }}
              sm={(currentRole || role).toLowerCase() === CUSTOMER ? 6 : 12}
            >
              <Box
                sx={[
                  projectsWrapper(
                    theme,
                    (currentRole || role).toLowerCase() === AUDITOR,
                  ),
                  !matchSm && (currentRole || role).toLowerCase() !== AUDITOR
                    ? { borderLeftColor: '#F90' }
                    : {},
                ]}
              >
                <Box sx={headWrapper}>Audits</Box>
                <Grid container spacing={2}>
                  {(showMoreAudits ? userAudits : userAudits?.slice(0, 8))?.map(
                    audit => (
                      <Grid key={audit.id} item>
                        <AuditCard
                          audit={audit}
                          isOwner={ownerId}
                          isPrivate={true}
                        />
                      </Grid>
                    ),
                  )}
                </Grid>
                {userAudits?.length > 8 && (
                  <Button
                    sx={moreBtnSx}
                    onClick={() => setShowMoreAudits(!showMoreAudits)}
                  >
                    {showMore ? 'Hide' : 'View more'}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  }
};

export default PublicProfile;

const moreBtnSx = theme => ({
  display: 'block',
  marginRight: 0,
  marginLeft: 'auto',
  marginBottom: '-20px',
  marginTop: '20px',
  textTransform: 'unset',
});

const gridWrapper = ownerId => ({
  marginTop: ownerId ? '60px' : '98px',
});

const projectsWrapper = (theme, isAuditor) => ({
  backgroundColor: '#fbfaf6',
  border: '1px solid #B2B3B3',
  padding: '48px',
  position: 'relative',
  height: '100%',
  '& .MuiGrid-item': {
    width: isAuditor ? '25%' : '50%',
  },
  '& .project-wrapper': {
    borderRadius: '15px',
    backgroundColor: '#fff',
    '& button': {
      marginTop: '15px',
    },
  },
  '& .audit-wrapper': {
    gap: '11px',
  },
  '& .date-style': {
    fontSize: '10px!important',
    padding: '5px',
  },
  '& .name-style': {
    height: '27px',
    '-webkit-line-clamp': 1,
  },
  [theme.breakpoints.down('md')]: {
    padding: '28px',
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiGrid-item': {
      width: '50%',
    },
  },
  [theme.breakpoints.down('xs')]: {
    padding: '15px',
    '& .project-wrapper': {
      flexDirection: 'column',
      gap: '10px',
    },
    '& .project-inner': {
      alignItems: 'center',
    },
    '& .date-style': {
      fontSize: '8px!important',
      padding: '5px 2px',
    },
  },
});

const headWrapper = theme => ({
  borderRadius: '10.619px 10.619px 0px 0px',
  borderTop: '1px solid #B9B9B9',
  borderRight: '1px solid #B9B9B9',
  borderLeft: '1px solid #B9B9B9',
  background: 'linear-gradient(180deg, #FFF 0%, #E5E5E5 100%)',
  fontSize: '19px',
  fontWeight: 600,
  padding: '10px',
  textAlign: 'center',
  position: 'absolute',
  left: '-1px',
  right: '-1px',
  top: '-44px',
});

const mainWrapper = (theme, ownerId) => ({
  backgroundColor: ownerId ? 'transparent' : '#fff',
  width: '1300px',
  padding: ownerId ? 0 : '75px 120px',
  [theme.breakpoints.down('lg')]: {
    width: '1200px',
    padding: ownerId ? 0 : '50px 80px',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: 0,
    backgroundColor: 'transparent',
  },
});

const wrapper = (theme, color) => ({
  width: '100%',
  minHeight: '520px',
  display: 'flex',
  flexDirection: 'column',
  padding: '70px 40px',
  gap: '50px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  border: `5px solid ${color}`,
  justifyContent: 'space-between',
  boxShadow:
    '0px 1.976611852645874px 1.5812894105911255px 0px rgba(0, 0, 0, 0.02),' +
    ' 0px 4.750072956085205px 3.800058364868164px 0px rgba(0, 0, 0, 0.03), ' +
    '0px 8.943965911865234px 7.155172824859619px 0px rgba(0, 0, 0, 0.04), ' +
    '0px 15.954506874084473px 12.763605117797852px 0px rgba(0, 0, 0, 0.04), ' +
    '0px 29.84115219116211px 23.872920989990234px 0px rgba(0, 0, 0, 0.05), ' +
    '0px 71.42857360839844px 57.142860412597656px 0px rgba(0, 0, 0, 0.07)',
  [theme.breakpoints.down('lg')]: {
    padding: '60px 40px 40px',
  },
  [theme.breakpoints.down('md')]: {
    gap: '50px',
    minHeight: '450px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    justifyContent: 'flex-start',
    padding: '20px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
    alignItems: 'center',
    gap: '25px',
    '& .mobile-tag-wrapper': {
      maxWidth: '380px',
    },
  },
});
const aboutWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  '& .tagsWrapper': {
    width: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
});

const infoInnerStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const infoStyle = theme => ({
  display: 'flex',
  margin: '0 0 16px',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '20px',
  '& .tagsWrapper': {
    width: '100%',
  },
  [theme.breakpoints.down('md')]: {
    gap: '10px',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '16px',
    margin: 0,
    '& .tagsWrapper': {
      width: '520px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    gap: '16px',
    margin: 0,
    alignItems: 'flex-start',
    '& .tagsWrapper': {
      width: '520px',
    },
  },
});

const avatarStyle = theme => ({
  width: '205px',
  height: '205px',
  [theme.breakpoints.down('xs')]: {
    width: '150px',
    height: '150px',
  },
});

const contentWrapper = theme => ({
  display: 'flex',
  gap: '40px',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: '1200px',
  [theme.breakpoints.down('md')]: {
    gap: '50px',
  },
  [theme.breakpoints.down('sm')]: {
    alignItems: 'center',
    maxWidth: 'unset',
    justifyContent: 'flex-start',
    margin: 0,
    gap: '30px',
    width: '100%',
  },
  [theme.breakpoints.down(560)]: {
    flexDirection: 'column',
    gap: '20px',
  },
});

const buttonSx = theme => ({
  margin: '0 auto',
  display: 'block',
  color: theme.palette.background.default,
  textTransform: 'capitalize',
  fontWeight: 600,
  fontSize: '18px',
  padding: '9px 50px',
  borderRadius: '10px',
  [theme.breakpoints.down('xs')]: {
    padding: '9px 20px',
    fontSize: '12px',
  },
});

const submitAuditor = theme => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: '#450e5d',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  fontWeight: 500,
  color: '#434242',
  '& .about-title': {
    marginRight: '58px',
  },
  '& p': {
    fontSize: 'inherit',
    maxWidth: '250px',
  },
  '& span': {
    width: '85px',
    marginRight: '20px',
    color: '#B2B3B3',
  },
  fontSize: '15px',
  [theme.breakpoints.down('md')]: {
    '& span': {
      width: '90px',
      marginRight: '20px',
    },
    '& p': {
      maxWidth: '190px',
    },
    '& .about-title': {
      marginRight: '64px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .about-title': {
      marginRight: 'unset',
    },
    '& p': {
      maxWidth: '240px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
    '& span': {
      width: '80px',
      marginRight: '12px',
    },
    '& p': {
      maxWidth: '180px',
    },
  },
  [theme.breakpoints.down(450)]: {
    '& .about-title': {
      marginRight: '52px',
    },
  },
});

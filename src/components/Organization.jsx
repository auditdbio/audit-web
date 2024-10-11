import React, { useMemo, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Typography,
  Link,
  useMediaQuery,
  Tooltip,
  ListItemText,
  List,
  ListItem,
  Checkbox,
  ListItemAvatar,
  Chip,
  Modal,
  FormControlLabel,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import theme from '../styles/themes.js';
import { useNavigate, useParams } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader.jsx';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import TagsList from './tagsList';
import { ASSET_URL } from '../services/urls.js';
import MobileTagsList from './MobileTagsList/index.jsx';
import { addTestsLabel, capitalize, isAuth } from '../lib/helper.js';
import ShareProfileButton from './custom/ShareProfileButton.jsx';
import IdentitySetting from './IdentitySetting/IdentitySetting.jsx';
import LinkedinIcon from './icons/LinkedinIcon.jsx';
import XTwitterLogo from './icons/XTwitter-logo.jsx';
import { clearUserMessages } from '../redux/actions/userAction.js';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import Headings from '../router/Headings.jsx';
import ListItemButton from '@mui/material/ListItemButton';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from './custom/Card.jsx';
import {
  acceptInvites,
  clearOrganization,
  deleteInvites,
  deleteUserFromOrganization,
  getOrganizationById,
} from '../redux/actions/organizationAction.js';
import InfoCard from './custom/info-card.jsx';
import AuditorSearchModal from './AuditorSearchModal.jsx';
import ConfirmModal from './modal/ConfirmModal.jsx';
import EditIcon from '@mui/icons-material/Edit';
import UserLIstItem from './UserListItem/UserLIstItem.jsx';

const Organization = ({ linkId }) => {
  const role = useSelector(s => s.user.user.current_role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchXxs = useMediaQuery(theme.breakpoints.down(590));
  const organization = useSelector(s => s.organization.organization);
  const invites = useSelector(s => s.organization.invites);
  const [showAddUser, setShowAddUser] = useState(false);
  const [openConfirm, setIsOpenConfirm] = useState(false);

  const {
    customer,
    error: customerError,
    successMessage: successMessage,
  } = useSelector(s => s.organization);
  const {
    auditor,
    error: auditorError,
    success: auditorSuccess,
  } = useSelector(s => s.auditor);
  const { user, error } = useSelector(s => s.user);

  useEffect(() => {
    dispatch(getOrganizationById(linkId));
    return () => {
      dispatch(clearOrganization());
    };
  }, [linkId]);

  const handleEdit = () => {
    navigate(`/edit-organization/${linkId}`);
  };

  const handleAddUser = () => {
    setShowAddUser(!showAddUser);
  };

  const inviteMe = useMemo(() => {
    return !!invites.find(el => el.id === organization.id);
  }, [organization.id, invites]);

  const isMyOrg = useMemo(() => {
    return !!(
      isAuth() &&
      organization?.id &&
      organization?.owner.user_id === user.id
    );
  }, [organization]);
  if (!organization.id) {
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
              onClick={() => navigate('/my-organizations')}
            >
              <ArrowBackIcon
                color={role === CUSTOMER ? 'primary' : 'secondary'}
              />
            </Button>
            <AuditorSearchModal
              open={showAddUser}
              editMode={true}
              invite={true}
              handleClose={() => {
                setShowAddUser(false);
              }}
              setError={() => console.log('error')}
            />
            <Box sx={innerWrapper}>
              {/*<Headings*/}
              {/*  title={user?.name || 'Profile'}*/}
              {/*  image={data.avatar}*/}
              {/*  description={`${data.first_name} ${data.last_name} | ${data.about}`}*/}
              {/*/>*/}

              <CustomSnackbar
                autoHideDuration={5000}
                open={
                  !!error ||
                  !!customerError ||
                  !!auditorError ||
                  !!successMessage ||
                  !!auditorSuccess
                }
                text={
                  error ||
                  customerError ||
                  auditorError ||
                  successMessage ||
                  auditorSuccess
                }
                severity={
                  error || customerError || auditorError ? 'error' : 'success'
                }
                onClose={() => dispatch(clearUserMessages())}
              />

              <Box sx={contentWrapper}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  <Avatar
                    src={
                      organization.avatar &&
                      `${ASSET_URL}/${organization.avatar}`
                    }
                    sx={[
                      avatarStyle,
                      !organization.avatar
                        ? {
                            backgroundColor:
                              role === CUSTOMER
                                ? theme.palette.primary.main
                                : theme.palette.secondary.main,
                          }
                        : {},
                    ]}
                    alt="User photo"
                  >
                    {organization.name}
                  </Avatar>
                </Box>
                <Box sx={infoStyle}>
                  <Box sx={infoInnerStyle}>
                    <Box sx={infoWrapper}>
                      <span>Name</span>
                      <Typography noWrap={true}>{organization.name}</Typography>
                    </Box>
                    <Box sx={infoWrapper}>
                      <span>Telegram</span>
                      <Typography noWrap={true}>
                        {organization.contacts?.telegram}
                      </Typography>
                    </Box>
                    <Box sx={infoWrapper}>
                      <span>E-mail</span>
                      <Typography noWrap={true}>
                        {organization.contacts?.email}
                      </Typography>
                    </Box>
                    <Box sx={infoWrapper}>
                      <span>Type</span>
                      <Typography noWrap={true}>
                        {organization.organization_type}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={userListSx}>
                    <Box>
                      <List
                        dense
                        sx={{
                          padding: 'unset',
                          width: '100%',
                          // maxWidth: 360,
                          // bgcolor: 'background.paper',
                        }}
                      >
                        {organization.members.map(value => {
                          const labelId = `checkbox-list-secondary-label-${value}`;
                          return (
                            <UserLIstItem
                              value={value}
                              labelId={labelId}
                              organization={organization}
                            />
                          );
                        })}
                      </List>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/*{!matchXs && (*/}
              {/*  <TagsList data={organization.tags} fullView={true} />*/}
              {/*)}*/}
              {/*{matchXs && <MobileTagsList data={organization.tags} />}*/}
              {/*<Box*/}
              {/*  sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}*/}
              {/*>*/}
              {/*  {user.linked_accounts?.map(account => {*/}
              {/*    if (account.name.toLowerCase() === 'linkedin') {*/}
              {/*      return (*/}
              {/*        <Box*/}
              {/*          key={account.id}*/}
              {/*          sx={{*/}
              {/*            display: 'flex',*/}
              {/*            alignItems: 'center',*/}
              {/*            gap: '7px',*/}
              {/*          }}*/}
              {/*        >*/}
              {/*          <Tooltip title={account.url} placement="top">*/}
              {/*            <Link href={account.url} target={'_blank'}>*/}
              {/*              <LinkedinIcon />*/}
              {/*            </Link>*/}
              {/*          </Tooltip>*/}
              {/*        </Box>*/}
              {/*      );*/}
              {/*    } else if (account.name.toLowerCase() === 'github') {*/}
              {/*      return (*/}
              {/*        <Box*/}
              {/*          key={account.id}*/}
              {/*          sx={{*/}
              {/*            display: 'flex',*/}
              {/*            alignItems: 'center',*/}
              {/*            gap: '7px',*/}
              {/*          }}*/}
              {/*        >*/}
              {/*          <Tooltip title={account.url} placement="top">*/}
              {/*            <Link*/}
              {/*              href={account.url}*/}
              {/*              sx={{ color: 'initial' }}*/}
              {/*              target={'_blank'}*/}
              {/*            >*/}
              {/*              <GitHubIcon*/}
              {/*                sx={{*/}
              {/*                  width: '50px',*/}
              {/*                  height: '50px',*/}
              {/*                  padding: '4px',*/}
              {/*                }}*/}
              {/*              />*/}
              {/*            </Link>*/}
              {/*          </Tooltip>*/}
              {/*        </Box>*/}
              {/*      );*/}
              {/*    } else {*/}
              {/*      return (*/}
              {/*        <Box*/}
              {/*          key={account.id}*/}
              {/*          sx={{*/}
              {/*            display: 'flex',*/}
              {/*            alignItems: 'center',*/}
              {/*            gap: '7px',*/}
              {/*          }}*/}
              {/*        >*/}
              {/*          <Tooltip title={account.url} placement="top">*/}
              {/*            <Link*/}
              {/*              href={account.url}*/}
              {/*              sx={{ color: 'initial' }}*/}
              {/*              target={'_blank'}*/}
              {/*            >*/}
              {/*              <XTwitterLogo width={'38px'} height={'38px'} />*/}
              {/*            </Link>*/}
              {/*          </Tooltip>*/}
              {/*        </Box>*/}
              {/*      );*/}
              {/*    }*/}
              {/*  })}*/}
              {/*</Box>*/}
              {isAuth() && isMyOrg && (
                <Box sx={buttonsWrapper}>
                  <Button
                    sx={[buttonSx, role === 'auditor' ? submitAuditor : {}]}
                    variant={'contained'}
                    onClick={handleAddUser}
                    {...addTestsLabel('user_edit-button')}
                  >
                    Add user
                  </Button>
                  <Button
                    sx={[buttonSx, role === 'auditor' ? submitAuditor : {}]}
                    variant={'contained'}
                    onClick={handleEdit}
                    {...addTestsLabel('user_edit-button')}
                  >
                    Edit
                  </Button>
                  {/*<IdentitySetting />*/}
                </Box>
              )}
              {inviteMe && !isMyOrg && (
                <Box sx={buttonsWrapper}>
                  <Button
                    sx={[buttonSx, role === 'auditor' ? submitAuditor : {}]}
                    variant={'contained'}
                    onClick={() => dispatch(acceptInvites(organization.id))}
                    {...addTestsLabel('user_edit-button')}
                  >
                    Accept
                  </Button>
                  <Button
                    sx={[buttonSx, role === 'auditor' ? submitAuditor : {}]}
                    variant={'contained'}
                    onClick={() => setIsOpenConfirm(true)}
                    {...addTestsLabel('user_edit-button')}
                  >
                    Decline
                  </Button>
                </Box>
              )}
              <ConfirmModal
                handleAgree={() => {
                  dispatch(deleteInvites(organization.id, user.id));
                  setIsOpenConfirm(false);
                }}
                handleDisagree={() => setIsOpenConfirm(false)}
                isOpen={openConfirm}
              />
            </Box>
          </Box>
        </CustomCard>
      </Layout>
    );
  }
};

export default Organization;

const buttonsWrapper = theme => ({
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  '& button': {
    margin: 'unset',
  },
  [theme.breakpoints.down(630)]: {
    flexDirection: 'column',
  },
});

const wrapper = theme => ({
  display: 'flex',
  borderColor: 'grey',
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

const aboutWrapper = theme => ({
  width: '100%',
  '& span': {
    marginRight: '50px',
    maxWidth: '125px',
    width: '100%',
  },
  [theme.breakpoints.down('md')]: {
    '& span': {
      maxWidth: '90px',
      marginRight: '20px',
    },
  },
  [theme.breakpoints.down(450)]: {
    '& span': {
      maxWidth: '70px',
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

const infoInnerStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  paddingTop: '10px',
});

const userListSx = theme => ({
  width: '100%',
});

const infoStyle = theme => ({
  display: 'flex',
  margin: '0 0 50px',
  flexDirection: 'row',
  // flexWrap: 'wrap',
  width: '100%',
  gap: '40px',
  rowGap: '15px',
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
  gap: '70px',
  // justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    gap: '50px',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
  },
});

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

const submitAuditor = theme => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: '#450e5d',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500,
  color: '#434242',
  '& p': {
    fontSize: 'inherit',
    maxWidth: '250px',
  },
  '& span': {
    width: '125px',
    marginRight: '50px',
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
  },
  [theme.breakpoints.down('sm')]: {
    '& p': {
      maxWidth: '240px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
  [theme.breakpoints.down(450)]: {
    '& span': {
      width: '70px',
      marginRight: '20px',
    },
    '& p': {
      maxWidth: '180px',
    },
  },
});

const accountLink = {
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  color: 'black',
  textDecoration: 'none',
};

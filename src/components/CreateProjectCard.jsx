import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import theme, { radiusOfComponents } from '../styles/themes.js';
import { useNavigate } from 'react-router-dom/dist';
import TagsArray from './tagsArray/index.jsx';
import { Form, Formik } from 'formik';
import SimpleField from './forms/fields/simple-field.jsx';
import { ProjectLinksList } from './custom/ProjectLinksList.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AuditorSearchModal from './AuditorSearchModal.jsx';
import TagsField from './forms/tags-field/tags-field.jsx';
import {
  changeStatusProject,
  clearProjectMessage,
  closeProject,
  createProject,
  createProjectNoRedirect,
  editProject,
  editProjectNoRedirect,
  getProjects,
} from '../redux/actions/projectAction.js';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  clearMessage,
  getAuditsRequest,
} from '../redux/actions/auditAction.js';
import { AuditRequestsArray } from './custom/AuditRequestsArray.jsx';
import MarkdownEditor from './markdown/Markdown-editor.jsx';
import SalarySlider from './forms/salary-slider/salary-slider.jsx';
import CloseProjectModal from './CloseProjectModal.jsx';
import { AUDITOR, DONE } from '../redux/actions/types.js';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../lib/helper.js';
import { history } from '../services/history.js';
import PriceCalculation from './PriceCalculation.jsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import GithubSelection from './GithubSelection/GithubSelection.jsx';
import { getFilterData } from '../redux/actions/configAction.js';
import {
  clearCommit,
  clearRepoOwner,
  getCommitData,
  getMyGithub,
  getRepoOwner,
  getSha,
} from '../redux/actions/githubAction.js';

const GoBack = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Button
      sx={backButtonSx}
      onClick={() => navigate(-1)}
      aria-label="Ga back"
      {...addTestsLabel('go-back-button')}
    >
      <ArrowBackIcon />
    </Button>
  );
};

const CreateProjectCard = ({ projectInfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getSearchParam] = useSearchParams();
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const customerReducer = useSelector(state => state.customer);
  const auditReducer = useSelector(state => state.audits);
  const [auditRequests, setAuditRequests] = useState([]);
  const [error, setError] = useState(null);
  const projectMessage = useSelector(state => state.project.message);
  const [isPublished, setIsPublished] = useState(
    projectInfo?.publish_options?.publish || false,
  );
  const [isClosed, setIsClosed] = useState(
    projectInfo?.status === DONE || false,
  );
  const { successMessage, errorMessage } = useSelector(s => s.audits);
  const [closeConfirmIsOpen, setCloseConfirmIsOpen] = useState(false);
  const [state, setState] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);

  useEffect(() => {
    dispatch(getAuditsRequest('customer'));
  }, []);
  const githubData = useSelector(s =>
    s.user?.user?.linked_accounts?.find(
      el => el?.name?.toLowerCase() === 'github',
    ),
  );

  useEffect(() => {
    if (githubData?.id && githubData?.scope?.includes('repo')) {
      dispatch(getMyGithub());
    }
  }, [githubData?.scope?.includes('repo'), githubData?.id]);

  useEffect(() => {
    if (auditReducer.auditRequests && projectInfo) {
      setAuditRequests(
        auditReducer.auditRequests &&
          auditReducer.auditRequests.filter(
            request => request.project_id === projectInfo.id,
          ),
      );
    }
  }, [auditReducer.auditRequests]);

  useEffect(() => {
    dispatch(getFilterData());
    return () => {
      dispatch(clearRepoOwner());
      dispatch(clearCommit());
    };
  }, []);

  let editMode = !!projectInfo;

  const validationSchema = Yup.object().shape({
    tags: Yup.array().min(1, 'Please enter at least one tag'),
    scope: Yup.array().min(1, 'Please enter at least one link'),
    name: Yup.string().required('Name field is required'),
    description: Yup.string().required('Description field is required'),
  });

  const initialValues = {
    id: projectInfo ? projectInfo.id : '',
    publish_options: {
      publish: projectInfo ? projectInfo?.publish_options?.publish : false,
      ready_to_wait: projectInfo
        ? projectInfo?.publish_options?.ready_to_wait
        : true,
    },
    publish_contacts: true,
    name: projectInfo ? projectInfo.name : '',
    scope: projectInfo ? projectInfo.scope : [],
    description: projectInfo ? projectInfo.description : '',
    tags: projectInfo ? projectInfo.tags : [],
    status: projectInfo?.status === DONE ? DONE : '',
    price: projectInfo ? projectInfo.price : 0,
    creator_contacts: customerReducer?.customer?.contacts,
  };
  const [openInvite, setOpenInvite] = useState(false);

  const handleInviteModal = onSubmit => {
    setState(true);
    onSubmit();

    setOpenInvite(true);
  };

  const handleCloseInviteModal = () => {
    setOpenInvite(false);
  };

  const handlePublish = (values, handleSubmit) => {
    setIsPublished(!isPublished);
    const newValue = {
      ...values,
      publish_options: { ...values.publish_options, publish: !isPublished },
      status: isClosed ? DONE : '',
    };
    if (values.id && projectInfo.id) {
      setChangeStatus(true);
      setState(true);
      handleSubmit(newValue);
    } else {
      handleSubmit(values);
    }
  };

  useEffect(() => {
    if (initialValues?.id && initialValues.scope.length) {
      const getRepoUrl = initialValues.scope[0];
      function getShaFromGitHubUrl(url) {
        const regex = /\/blob\/([0-9a-f]{40})\//;
        const match = url.match(regex);
        return match ? match[1] : null;
      }

      function parseGitHubUrl(gitHubUrl) {
        const urlParts = gitHubUrl.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];

        return `${owner}/${repo}`;
      }

      const githubRepo = parseGitHubUrl(getRepoUrl);
      const sha = getShaFromGitHubUrl(getRepoUrl);
      dispatch(getSha(sha));
      dispatch(getRepoOwner(githubRepo));
    }
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        const newValue = { ...values, price: parseInt(values.price) };
        setIsDirty(false);
        if (editMode && projectInfo.id) {
          if (!state) {
            dispatch(
              editProject({
                ...newValue,
                id: projectInfo.id,
                status: projectInfo?.status === DONE ? DONE : '',
              }),
            );
          } else {
            if (!changeStatus) {
              dispatch(
                editProjectNoRedirect({ ...newValue, id: projectInfo.id }),
              );
            } else {
              dispatch(
                changeStatusProject({ ...newValue, id: projectInfo.id }),
              );
            }
          }
        } else {
          if (!state) {
            dispatch(createProject(newValue));
          } else {
            dispatch(createProjectNoRedirect(newValue));
          }
        }
      }}
    >
      {({
        handleSubmit,
        values,
        setFieldValue,
        setFieldTouched,
        dirty,
        touched,
        errors,
      }) => {
        useEffect(() => {
          setIsDirty(dirty);
        }, [dirty]);

        useEffect(() => {
          const unblock = history.block(({ location }) => {
            if (!isDirty) {
              unblock();
              return navigate(location);
            }

            const confirmed = window.confirm(
              'Do you want to save changes before leaving the page?',
            );

            if (confirmed) {
              handleSubmit(values);
              unblock();
              return navigate(location);
            } else {
              unblock();
              return navigate(location);
            }
          });

          if (!isDirty) {
            unblock();
          }

          return () => {
            unblock();
          };
        }, [history, isDirty]);
        return (
          <Box sx={mainBox}>
            <GoBack />

            <CustomSnackbar
              autoHideDuration={3000}
              open={!!error || projectMessage}
              onClose={() => {
                setError(null);
                dispatch(clearProjectMessage());
              }}
              severity={!projectMessage ? 'error' : 'success'}
              text={error || projectMessage}
            />

            <AuditorSearchModal
              open={openInvite}
              editMode={editMode}
              handleClose={handleCloseInviteModal}
              handleSubmit={handleSubmit}
              setState={setState}
              setError={setError}
            />
            <CustomSnackbar
              autoHideDuration={5000}
              open={!!errorMessage || !!successMessage}
              severity={errorMessage ? 'error' : 'success'}
              text={errorMessage || successMessage}
              onClose={() => dispatch(clearMessage())}
            />

            {/*<CloseProjectModal*/}
            {/*  isOpen={closeConfirmIsOpen}*/}
            {/*  setIsOpen={setCloseConfirmIsOpen}*/}
            {/*  handleSubmit={handleSubmit}*/}
            {/*  values={values}*/}
            {/*  setIsClosed={setIsClosed}*/}
            {/*  projectInfo={projectInfo}*/}
            {/*/>*/}

            <Box sx={wrapper}>
              <Form onSubmit={handleSubmit}>
                <Box sx={formCard}>
                  <Box sx={formAllFields}>
                    <Box sx={formWrapper}>
                      <Box sx={fieldWrapper}>
                        <SimpleField
                          size={matchMd ? 'small' : 'medium'}
                          name="name"
                          label="Name"
                          emptyPH
                        />
                        <TagsField
                          size={matchMd ? 'small' : 'medium'}
                          name="tags"
                          label="Tags"
                          setFieldTouched={setFieldTouched}
                        />
                        <TagsArray name="tags" />
                      </Box>
                      <Box sx={fieldWrapper}>
                        <Box sx={linkFieldWrapper}>
                          <TagsField
                            size={matchMd ? 'small' : 'medium'}
                            name="scope"
                            label="Project links"
                            setFieldTouched={setFieldTouched}
                          />
                          <GithubSelection project={projectInfo} />
                        </Box>
                        <ProjectLinksList name="scope" />
                        <Box>
                          <Box sx={priceLabelSx}>Price per line of code</Box>
                          <SalarySlider name="price" />
                        </Box>
                        {!matchMd && (
                          <PriceCalculation
                            price={values.price}
                            scope={values.scope}
                          />
                        )}
                      </Box>
                    </Box>
                    {matchMd && (
                      <PriceCalculation
                        price={values.price}
                        scope={values.scope}
                        sx={{ '& .head': { justifyContent: 'center' } }}
                      />
                    )}

                    {/*<Box>*/}
                    {/*  <AuditRequestsArray requests={auditRequests ?? []} />*/}
                    {/*</Box>*/}
                  </Box>
                  <Box
                    className="description-box"
                    sx={descriptionFieldWrapper(
                      touched.description && errors.description,
                    )}
                  >
                    <MarkdownEditor
                      name="description"
                      setFieldTouched={setFieldTouched}
                      fastSave
                      mdProps={{
                        view: { menu: true, md: true, html: !matchXs },
                      }}
                    />
                    {touched.description && errors.description && (
                      <Typography
                        sx={{
                          color: `${theme.palette.error.main}!important`,
                          fontSize: '14px',
                        }}
                      >
                        {errors.description}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={buttonGroup}>
                    <Button
                      variant="contained"
                      sx={inviteButton}
                      onClick={() => {
                        handleInviteModal(handleSubmit);
                      }}
                      {...addTestsLabel('invite-button')}
                    >
                      Invite auditor
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        sx={[publishButton, { width: '100%' }]}
                        type="button"
                        color={'secondary'}
                        onClick={() => {
                          if (
                            values.name &&
                            values.tags.length > 0 &&
                            values.scope.length > 0 &&
                            values.description
                          ) {
                            handlePublish(values, handleSubmit);
                            setFieldValue(
                              'publish_options.publish',
                              !isPublished,
                            );
                          } else {
                            setError('Please fill all required fields');
                          }
                        }}
                        {...addTestsLabel('hide-publish-button')}
                      >
                        {isPublished ? (
                          <VisibilityIcon fontSize={'small'} />
                        ) : (
                          <VisibilityOffIcon fontSize={'small'} />
                        )}
                        project
                      </Button>
                      <Button
                        color={'secondary'}
                        sx={{
                          minWidth: '15px',
                          marginLeft: '7px',
                          paddingY: '3px',
                          marginRight: '-45px',
                        }}
                      >
                        <Tooltip
                          title="Projects are hidden by default, you can change the visibility."
                          arrow={true}
                          placement="top"
                        >
                          <QuestionMarkIcon fontSize={'small'} />
                        </Tooltip>
                      </Button>
                    </Box>
                    {/*<Button*/}
                    {/*  variant={'contained'}*/}
                    {/*  sx={publishButton}*/}
                    {/*  disabled={*/}
                    {/*    isClosed || !projectInfo || !!getSearchParam.get('copy')*/}
                    {/*  }*/}
                    {/*  onClick={() => setCloseConfirmIsOpen(true)}*/}
                    {/*  {...addTestsLabel('close-project-button')}*/}
                    {/*>*/}
                    {/*  {isClosed ? 'Project closed' : 'Close the project'}*/}
                    {/*</Button>*/}
                    {/*<Button sx={menuButtonSx}>*/}
                    {/*  <MenuRoundedIcon sx={menuButtonIconSx} />*/}
                    {/*</Button>*/}
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    // sx={submitButton}
                    sx={[inviteButton]}
                    {...addTestsLabel(`${editMode ? 'save' : 'create'}-button`)}
                  >
                    {editMode ? 'Save changes' : 'Create'}
                  </Button>
                </Box>
              </Form>
            </Box>
          </Box>
        );
      }}
    </Formik>
  );
};
export default CreateProjectCard;

const linkFieldWrapper = theme => ({
  display: 'flex',
  gap: '7px',
  alignItems: 'center',
  '& .field-wrapper': {
    width: '100%',
  },
  [theme.breakpoints.down(500)]: {
    flexDirection: 'column',
    gap: '10px',
    '& .field-wrapper': {
      width: '100%',
    },
  },
});

const mainBox = theme => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '40px',
  [theme.breakpoints.down('xs')]: {
    paddingTop: '30x',
  },
});

const backButtonSx = theme => ({
  position: 'absolute',
  left: '30px',
  top: '40px',
  [theme.breakpoints.down('sm')]: {
    top: '5px',
    left: 0,
  },
});

const wrapper = theme => ({
  padding: '30px 90px 70px',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    padding: '30px 20px',
  },
  [theme.breakpoints.down('xs')]: {
    '& form': {
      width: '100%',
    },
    width: '100%',
    alignItems: 'center',
  },
});

const buttonGroup = {
  // width: "100%",
  width: '220px',
  display: 'flex',
  alignSelf: 'center',
  gap: '20px',
  flexDirection: 'column',
};

const inviteButton = {
  backgroundColor: theme.palette.primary.main,
  textTransform: 'none',
  boxShadow: '0',
  maxHeight: '30px',
  padding: '8px 42px',
  whiteSpace: 'nowrap',
  color: '#FCFAF6',
  fontWeight: '600',
  borderRadius: '4px',
  width: '220px',
  margin: '0 auto',
  // width: '100%',
  fontSize: '14px',
  // paddingY: "11px",
  ':hover': {
    boxShadow: '0',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '3px 15px',
    fontSize: '10px',
  },
};

const publishButton = {
  // backgroundColor: theme.palette.secondary.main,
  textTransform: 'none',
  boxShadow: '0',
  maxHeight: '30px',
  padding: '8px 42px',
  // whiteSpace: 'nowrap',
  // color: '#FCFAF6',
  fontWeight: '600',
  borderRadius: '4px',
  // maxWidth: '180px',
  // margin: '0 auto',
  fontSize: '14px',
  '& svg': {
    marginRight: '7px',
  },
  // paddingY: "11px",
  // ':hover': {
  //   boxShadow: '0',
  // },
  [theme.breakpoints.down('sm')]: {
    padding: '3px 15px',
    fontSize: '10px',
  },
};

const formCard = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '20px',
};

const formWrapper = theme => ({
  display: 'flex',
  height: '100%',
  width: '100%',

  justifyContent: 'space-between',
  // gap: "175px",
  [theme.breakpoints.down('xs')]: {
    gap: '16px',
    flexDirection: 'column',
  },
});

const submitButton = theme => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0',
  padding: '11px 0',
  color: '#FCFAF6',
  fontWeight: 600,
  lineHeight: 1.2,
  textTransform: 'unset',
  borderRadius: radiusOfComponents,
  width: '402px',
  margin: '0 auto',
  fontSize: '16px',
  paddingY: '11px',
  ':hover': {
    boxShadow: '0',
  },
  [theme.breakpoints.down('sm')]: {
    width: '225px',
    padding: '13px 0',
    fontSize: '14px',
  },
});

const fieldWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  // justifyContent: "space-between",
  // maxWidth: "450px",
  width: '48%',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    '& .MuiInputBase-root': {
      height: '44px',
      '& input': {
        paddingY: '7px',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
    '& .password-wrapper, .field-wrapper': {
      gap: '16px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
});
const descriptionFieldWrapper = error => ({
  width: '100%',
  border: error ? '1px solid red' : '1px solid transparent',
});

const formAllFields = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const priceLabelSx = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#B3B3B3',
};

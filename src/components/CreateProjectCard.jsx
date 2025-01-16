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
  Switch,
  Collapse,
} from '@mui/material';
import theme, { radiusOfComponents } from '../styles/themes.js';
import { useNavigate } from 'react-router-dom/dist';
import TagsArray from './tagsArray/index.jsx';
import { Form, Formik } from 'formik';
import SimpleField from './forms/fields/simple-field.jsx';
import { ProjectLinksList } from './custom/ProjectLinksList.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
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
import SaveIcon from '@mui/icons-material/Save';
import MarkdownEditor from './markdown/Markdown-editor.jsx';
import SalarySlider from './forms/salary-slider/salary-slider.jsx';
import CloseProjectModal from './CloseProjectModal.jsx';
import { AUDITOR, CLEAR_PROJECT, DONE } from '../redux/actions/types.js';
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
import TotalPrice from './forms/TotalPrice/TotalPrice.jsx';
import { PROJECT_PARENT_ENTITY } from '../services/file_constants.js';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined.js';

const GoBack = ({ role, path }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Button
      sx={backButtonSx}
      onClick={() => navigate(path)}
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
  const [clear, setClear] = useState(false);
  const projectMessage = useSelector(state => state.project.message);
  const [isPublished, setIsPublished] = useState(
    projectInfo?.publish_options?.publish || false,
  );
  const [copy, setCopy] = useState(false);
  const project = useSelector(s => s.project?.currentProject);
  const [isClosed, setIsClosed] = useState(
    projectInfo?.status === DONE || false,
  );
  const { successMessage, errorMessage } = useSelector(s => s.audits);
  const [showFull, setShowFull] = useState(false);
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

  let editMode = !!projectInfo || !!project?.id;

  const validationSchema = Yup.object().shape({
    tags: Yup.array().min(1, 'Please enter at least one tag'),
    scope: Yup.array().min(1, 'Please enter at least one link'),
    name: Yup.string().required('Name field is required'),
    description: Yup.string().required('Description field is required'),
  });

  const initialValues = {
    id: projectInfo ? projectInfo?.id || project?.id : '',
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
    total_cost: projectInfo ? projectInfo.total_cost : 0,
    creator_contacts: customerReducer?.customer?.contacts,
  };
  const [openInvite, setOpenInvite] = useState(false);

  const handleInviteModal = onSubmit => {
    setState(true);
    setCopy(getSearchParam.get('copy'));
    onSubmit();

    setOpenInvite(true);
  };

  const handleCloseInviteModal = () => {
    setClear(true);
    setOpenInvite(false);
  };

  const handlePublish = (values, handleSubmit) => {
    setIsPublished(!isPublished);
    const newValue = {
      ...values,
      publish_options: { ...values.publish_options, publish: !isPublished },
      status: isClosed ? DONE : '',
    };
    const projectData = projectInfo || project;
    if ((values.id && projectData.id) || projectData?.id) {
      setChangeStatus(true);
      setState(true);
      setCopy(getSearchParam.get('copy'));
      handleSubmit({ id: projectData?.id, ...newValue });
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
    return () => {
      dispatch({ type: CLEAR_PROJECT });
    };
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        const newValue = {
          ...values,
          [!values.total_cost ? 'price' : 'total_cost']: parseInt(
            !values.total_cost ? values.price : values.total_cost,
          ),
        };

        if (!values.total_cost) {
          delete newValue.total_cost;
        } else {
          delete newValue.price;
        }
        setIsDirty(false);

        if (
          editMode &&
          (projectInfo?.id ?? project?.id) &&
          !getSearchParam.get('copy')
        ) {
          if (!state) {
            dispatch(
              editProject({
                ...newValue,
                id: projectInfo.id || project?.id,
                status: projectInfo?.status === DONE ? DONE : '',
              }),
            );
          } else {
            if (!changeStatus) {
              dispatch(
                editProjectNoRedirect({
                  ...newValue,
                  id: projectInfo?.id || project?.id,
                }),
              );
            } else {
              dispatch(
                changeStatusProject({
                  ...newValue,
                  id: projectInfo?.id || project?.id,
                }),
              );
            }
            setChangeStatus(false);
          }
        } else {
          if ((!state || project?.id) && !copy) {
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
            <GoBack path={projectInfo?.id ? '/profile/projects' : -1} />

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
              projectInfo={project}
            />
            <CustomSnackbar
              autoHideDuration={5000}
              open={!!errorMessage || !!successMessage}
              severity={errorMessage ? 'error' : 'success'}
              text={!!errorMessage || !!successMessage}
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
                          <TotalPrice />
                        </Box>
                        {!matchMd && (
                          <PriceCalculation
                            price={values.price}
                            scope={values.scope}
                            totalPrice={values.total_cost}
                          />
                        )}
                      </Box>
                    </Box>
                    {matchMd && (
                      <PriceCalculation
                        price={values.price}
                        scope={values.scope}
                        totalPrice={values.total_cost}
                        sx={{ '& .head': { justifyContent: 'center' } }}
                      />
                    )}

                    {/*<Box>*/}
                    {/*  <AuditRequestsArray requests={auditRequests ?? []} />*/}
                    {/*</Box>*/}
                  </Box>
                  <Collapse
                    in={true}
                    collapsedSize={showFull ? undefined : 150}
                  >
                    <Box
                      className="description-box"
                      sx={descriptionFieldWrapper(
                        touched.description && errors.description,
                        showFull,
                      )}
                    >
                      <MarkdownEditor
                        name="description"
                        setFieldTouched={setFieldTouched}
                        fastSave
                        mdProps={{
                          view: { menu: true, md: true, html: !matchXs },
                        }}
                        parentEntity={
                          projectInfo?.id
                            ? {
                                id: projectInfo.id,
                                source: PROJECT_PARENT_ENTITY,
                              }
                            : {}
                        }
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
                  </Collapse>
                  <Button
                    sx={[readAllButton(theme, showFull)]}
                    variant={'outlined'}
                    onClick={() => setShowFull(!showFull)}
                  >
                    {showFull ? 'Hide' : 'Show'}
                    <ExpandLessOutlinedIcon
                      sx={[
                        showFull ? {} : { transform: 'rotate(180deg)' },
                        {
                          transition: '0.2s',
                          // marginRight: '0',
                          // marginLeft: 'auto',
                          width: '20px',
                          height: '20px',
                        },
                      ]}
                    />
                  </Button>
                  <Box sx={buttonGroup}>
                    <Tooltip
                      title={'Invite auditor'}
                      arrow={true}
                      placement="top"
                    >
                      <Button
                        variant="contained"
                        sx={[buttonSx]}
                        onClick={() => {
                          handleInviteModal(handleSubmit);
                        }}
                        {...addTestsLabel('invite-button')}
                      >
                        <PersonAddAlt1Icon />
                        {/*Invite auditor*/}
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title={editMode ? 'Save changes' : 'Create project'}
                      arrow={true}
                      placement="top"
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        sx={[buttonSx]}
                        {...addTestsLabel(
                          `${editMode ? 'save' : 'create'}-button`,
                        )}
                      >
                        {editMode ? <SaveIcon /> : <CreateNewFolderIcon />}
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title="Projects are hidden by default, you can change the visibility."
                      arrow={true}
                      placement="top"
                    >
                      <Button
                        variant="outlined"
                        sx={[buttonSx]}
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
                      </Button>
                    </Tooltip>
                  </Box>
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
    // flexDirection: 'column',
    '& .github-wrapper': {
      width: 'unset',
    },
    gap: '10px',
    '& .field-wrapper': {
      // width: '100%',
    },
  },
});

const mainBox = theme => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  '& .editor-container': {
    borderBottom: 'unset!important',
  },
});

const backButtonSx = theme => ({
  position: 'absolute',
  left: '-5px',
  top: '5px',
  [theme.breakpoints.down('sm')]: {
    top: '0px',
    left: 0,
    minWidth: 'unset',
  },
});

const wrapper = theme => ({
  padding: '50px 30px 60px',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('xs')]: {
    '& form': {
      width: '100%',
    },
    width: '100%',
    alignItems: 'center',
    padding: '50px 10px',
  },
});

const buttonSx = theme => ({
  padding: '8.5px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  width: '50px!important',
  minWidth: '50px',
  borderRadius: '10px',
  height: '44px',
});

const readAllButton = (theme, showFull) => ({
  p: '3px',
  paddingX: '8px',
  minWidth: 'unset',
  textTransform: 'unset',
  boxShadow: 'unset',
  fontWeight: 600,
  borderRadius: '8px',
  marginTop: !showFull ? '-22px' : 0,
  width: '280px',
  marginX: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  // maxWidth: '300px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
  },
});

const buttonGroup = {
  // width: "100%",
  // width: '220px',
  display: 'flex',
  alignSelf: 'center',
  gap: '20px',
};

const inviteButton = {
  backgroundColor: theme.palette.primary.main,
  textTransform: 'none',
  boxShadow: '0',
  maxHeight: '36px',
  padding: '8px 42px',
  whiteSpace: 'nowrap',
  color: '#FCFAF6',
  fontWeight: '600',
  borderRadius: '4px',
  width: '180px',
  margin: '0 auto',
  height: '36px',
  // width: '100%',
  fontSize: '16px',
  // paddingY: "11px",
  ':hover': {
    boxShadow: '0',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '3px 15px',
  },
};

const publishButton = {
  // backgroundColor: theme.palette.secondary.main,
  textTransform: 'none',
  boxShadow: '0',
  maxHeight: '36px',
  width: '180px',
  // padding: '8px 42px',
  // whiteSpace: 'nowrap',
  // color: '#FCFAF6',
  height: '36px',
  fontWeight: '600',
  borderRadius: '4px',
  // maxWidth: '180px',
  // margin: '0 auto',
  fontSize: '16px',
  '& svg': {
    marginRight: '7px',
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
  gap: '16px',
  // justifyContent: 'space-between',
  // gap: "175px",
  [theme.breakpoints.down('xs')]: {
    // gap: '16px',
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
  width: '50%',
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
const descriptionFieldWrapper = (error, showFull) => ({
  width: '100%',
  maxHeight: showFull ? 'none' : 150,
  overflow: 'hidden',
  transition: 'max-height 0.3s ease',
  border: error ? '1px solid red' : '1px solid transparent',
  '& .rc-md-editor': {
    height: '100%!important',
    minHeight: '300px',
  },
});

const formAllFields = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

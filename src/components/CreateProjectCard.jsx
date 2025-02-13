import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  Tooltip,
  Collapse,
} from '@mui/material';
import theme from '../styles/themes.js';
import { useNavigate } from 'react-router-dom/dist';
import TagsArray from './tagsArray/index.jsx';
import { Form, Formik } from 'formik';
import SimpleField from './forms/fields/simple-field.jsx';
import { ProjectLinksList } from './custom/ProjectLinksList.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AuditorSearchModal from './AuditorSearchModal.jsx';
import TagsField from './forms/tags-field/tags-field.jsx';
import {
  changeStatusProject,
  clearProjectMessage,
  createProject,
  createProjectNoRedirect,
  editProject,
  editProjectNoRedirect,
} from '../redux/actions/projectAction.js';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useSearchParams } from 'react-router-dom/dist';
import {
  clearMessage,
  getAuditsRequest,
} from '../redux/actions/auditAction.js';
import SaveIcon from '@mui/icons-material/Save';
import MarkdownEditor from './markdown/Markdown-editor.jsx';
import { CLEAR_PROJECT, DONE } from '../redux/actions/types.js';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../lib/helper.js';
import { history } from '../services/history.js';
import PriceCalculation from './PriceCalculation.jsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { getFilterData } from '../redux/actions/configAction.js';
import {
  clearCommit,
  clearRepoOwner,
  getMyGithub,
  getRepoOwner,
  getSha,
} from '../redux/actions/githubAction.js';
import TotalPrice from './forms/TotalPrice/TotalPrice.jsx';
import { PROJECT_PARENT_ENTITY } from '../services/file_constants.js';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined.js';
import { SCOPE_GIT_BLOCK, SCOPE_LINKS } from '../services/constants.js';
import ScopeSelection from './ScopeSelection.jsx';

const GoBack = ({ path }) => {
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

  const customerReducer = useSelector(s => s.customer);
  const { successMessage, errorMessage } = useSelector(s => s.audits);
  const projectMessage = useSelector(s => s.project.message);
  const project = useSelector(s => s.project?.currentProject);
  const githubData = useSelector(s =>
    s.user?.user?.linked_accounts?.find(
      el => el?.name?.toLowerCase() === 'github',
    ),
  );

  const [isPublished, setIsPublished] = useState(
    projectInfo?.publish_options?.publish || false,
  );
  const [isClosed, setIsClosed] = useState(
    projectInfo?.status === DONE || false,
  );
  const [error, setError] = useState(null);
  const [copy, setCopy] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [state, setState] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [clear, setClear] = useState(false);

  useEffect(() => {
    dispatch(getAuditsRequest('customer'));
  }, []);

  useEffect(() => {
    if (githubData?.id && githubData?.scope?.includes('repo')) {
      dispatch(getMyGithub());
    }
  }, [githubData?.scope?.includes('repo'), githubData?.id]);

  useEffect(() => {
    dispatch(getFilterData());
    return () => {
      dispatch(clearRepoOwner());
      dispatch(clearCommit());
    };
  }, []);

  let editMode = !!projectInfo || !!project?.id;

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
    description: projectInfo ? projectInfo.description : '',
    tags: projectInfo ? projectInfo.tags : [],
    status: projectInfo?.status === DONE ? DONE : '',
    price: projectInfo ? projectInfo.price : 0,
    total_cost: projectInfo ? projectInfo.total_cost : 0,
    creator_contacts: customerReducer?.customer?.contacts,

    // scope: {
    //   type: projectInfo?.scope?.type || SCOPE_GIT_BLOCK,
    //   content: projectInfo?.scope?.content || {
    //     repository: {
    //       clone_url: null,
    //       display_url: null,
    //     },
    //     commit: null,
    //     files: [],
    //   },
    // },
    // TODO: replace to git block
    scope: {
      type: projectInfo?.scope?.type || SCOPE_LINKS,
      content: projectInfo?.scope?.content || [],
    },
  };

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

  const handleSubmit = values => {
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
  };

  useEffect(() => {
    if (initialValues?.id && initialValues.scope) {
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

      if (
        initialValues.scope.type === SCOPE_LINKS &&
        initialValues.scope.content.length
      ) {
        const getRepoUrl = initialValues.scope.content[0];
        const githubRepo = parseGitHubUrl(getRepoUrl);
        const sha = getShaFromGitHubUrl(getRepoUrl);
        dispatch(getSha(sha));
        dispatch(getRepoOwner(githubRepo));
      } else if (initialValues.scope.type === SCOPE_GIT_BLOCK) {
        const clone_url = initialValues.scope.content.repository.clone_url;
        const sha = initialValues.scope.content.commit;
        if (clone_url && sha) {
          const githubRepo = parseGitHubUrl(clone_url);
          dispatch(getSha(sha));
          dispatch(getRepoOwner(githubRepo));
        }
      }
    }
    return () => {
      dispatch({ type: CLEAR_PROJECT });
    };
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
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
              open={!!error || !!projectMessage}
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

            {/* TODO: Delete this??? */}
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
                        {!!values?.tags?.length && <TagsArray name="tags" />}
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
                      <Box sx={[fieldWrapper, { gap: '7px' }]}>
                        <ScopeSelection
                          projectId={values.id}
                          scope={values.scope}
                          project={projectInfo}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                        />
                        {(!!values?.scope?.content?.files?.length ||
                          !!values?.scope?.content?.length) && (
                          <ProjectLinksList name="scope" />
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
                        sx={buttonSx}
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
                        sx={buttonSx}
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
                        sx={buttonSx}
                        type="button"
                        color="secondary"
                        onClick={() => {
                          let scope_length =
                            values.scope.type === SCOPE_GIT_BLOCK
                              ? values.scope.content.files?.length
                              : values.scope.content?.length;

                          if (
                            values.name &&
                            values.tags.length > 0 &&
                            scope_length > 0 &&
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

const validationSchema = Yup.object().shape({
  tags: Yup.array().min(1, 'Please enter at least one tag'),
  name: Yup.string().required('Name field is required'),
  description: Yup.string().required('Description field is required'),
  scope: Yup.object()
    .shape({
      type: Yup.string().required('Type is required'),
      content: Yup.mixed().required('Content is required'),
    })
    .test('valid-scope', 'Please enter at least one link', value => {
      if (!value || !value.type || !value.content) {
        return false;
      }
      if (value.type === SCOPE_LINKS) {
        return Array.isArray(value.content) && value.content.length > 0;
      } else if (value.type === SCOPE_GIT_BLOCK) {
        return (
          value.content.files &&
          Array.isArray(value.content.files) &&
          value.content.files.length > 0
        );
      }
      return false;
    }),
});

const mainBox = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  '& .editor-container': {
    borderBottom: 'unset!important',
  },
};

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

const buttonSx = {
  padding: '8.5px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  width: '50px!important',
  minWidth: '50px',
  borderRadius: '10px',
  height: '44px',
};

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
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
  },
});

const buttonGroup = {
  display: 'flex',
  alignSelf: 'center',
  gap: '20px',
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
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
  },
});

const fieldWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
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

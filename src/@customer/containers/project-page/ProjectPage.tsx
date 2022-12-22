import {
  Typography,
  Grid,
  InputLabel,
  InputBase,
  Box,
  Alert,
  Button,
  TextField,
  Input,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@bem-react/classname'

import './ProjectPage.scss'
import {
  selectCustomerIdForProject,
  selectIsNewProject,
  selectLoadingProject,
  selectProcessingProject,
  selectProject,
  selectProjectErrorMessage,
  selectProjectSuccessMessage,
} from '@customer/state/customer.selectors'
import { Project } from 'shared/models/project'
import { onlySpaces } from 'shared/helpers/dataValodation'
import { customerActions } from '@customer/state/customer.reducer'

const componentId = 'ProjectPage'
const bem = cn(componentId)
const initialProjectData: Project = {
  _id: undefined,
  name: '',
  description: '',
  tags: '',
  status: 'hidden',
  gitUrl: '',
  gitFolders: {},
  customerId: '',
}

export const ProjectPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const customerIdForProject = useSelector(selectCustomerIdForProject)
  const successMessage = useSelector(selectProjectSuccessMessage)
  const isNewProject = useSelector(selectIsNewProject)
  const errorMessage = useSelector(selectProjectErrorMessage)
  const processing = useSelector(selectProcessingProject)
  const project = useSelector(selectProject)
  const loading = useSelector(selectLoadingProject)

  const [projectData, setProjectData] = useState<Project>(initialProjectData)

  const [errors, setErrors] = useState({
    _id: undefined,
    name: false,
    description: false,
    tags: false,
    gitUrl: false,
    gitFolders: false,
    noErrors: true,
    errorMessage: '',
  })

  const submit = (projectData: any) =>
    projectData._id
      ? dispatch(customerActions.updateProject(projectData))
      : dispatch(customerActions.createProject(projectData))

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
    trim = true,
  ): void => {
    setProjectData((state) => ({
      ...state,
      [field]: trim ? event.target.value.trim() : event.target.value,
    }))

    setErrors((prevState) => ({
      ...prevState,
      [field]: false,
    }))
  }

  const seeMyProjects = () => {
    navigate('/customer-page', { state: { tab: 1 } })
  }

  // Choose create or update project
  useEffect(() => {
    if (isNewProject) {
      initialProjectData.customerId = customerIdForProject
    } else {
      dispatch(customerActions.loadProject(customerIdForProject))
    }
  }, [isNewProject, customerIdForProject])

  // Check for errors in form
  useEffect(() => {
    if (
      !onlySpaces(projectData.name) &&
      projectData.name.length > 0 &&
      !onlySpaces(projectData.description) &&
      projectData.description.length > 0 &&
      !onlySpaces(projectData.gitUrl) &&
      projectData.gitUrl.length > 0 &&
      !onlySpaces(projectData.tags) &&
      projectData.tags.length > 0
    ) {
      setErrors((state) => ({ ...state, noErrors: true }))
    } else {
      setErrors((state) => ({ ...state, noErrors: false }))
    }

    setErrors((state) => ({ ...state, errorMessage: '' }))
  }, [projectData.name, projectData.description, projectData.gitUrl, projectData.tags])

  // Handle project loaded from server
  useEffect(() => {
    if (project) {
      setProjectData(project)
    } else {
      setProjectData(initialProjectData)
    }
  }, [project])

  // Handle server error
  useEffect(() => {
    if (errorMessage) {
      setErrors((state) => ({
        ...state,
        noErrors: false,
        errorMessage,
      }))
    }
  }, [errorMessage])

  return (
    <motion.div
      className="motion-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box className={bem()}>
        <Typography variant="h5" className={bem('Title')}>
          Project
        </Typography>

        {loading ? (
          'Loading...'
        ) : (
          <form className={bem('Form')} autoComplete="off" onSubmit={submitForm}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <InputLabel htmlFor="name-input" className={bem('InputLabel')}>
                  Name
                </InputLabel>

                <InputBase
                  id="name-input"
                  value={projectData.name}
                  data-testid={bem('ProjectName')}
                  className={bem('Input', { error: errors.name })}
                  error={errors.name}
                  onChange={(e) =>
                    handleFieldChange(
                      e as React.ChangeEvent<HTMLInputElement>,
                      'name',
                      false,
                    )
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="git-url-input" className={bem('InputLabel')}>
                  Project link
                </InputLabel>

                <InputBase
                  id="git-url-input"
                  value={projectData.gitUrl}
                  data-testid={bem('ProjectGitUrl')}
                  className={bem('Input', { error: errors.gitUrl })}
                  error={errors.gitUrl}
                  onChange={(e) =>
                    handleFieldChange(e as React.ChangeEvent<HTMLInputElement>, 'gitUrl')
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="description-input" className={bem('InputLabel')}>
                  Description
                </InputLabel>

                <TextField
                  multiline
                  rows={10}
                  id="description-input"
                  variant="outlined"
                  value={projectData.description}
                  data-testid={bem('ProjectDescription')}
                  className={bem('Input', { error: errors.description })}
                  error={errors.description}
                  onChange={(e) =>
                    handleFieldChange(
                      e as React.ChangeEvent<HTMLInputElement>,
                      'description',
                      false,
                    )
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="tags-input" className={bem('InputLabel')}>
                  Tags
                </InputLabel>

                <InputBase
                  id="tags-input"
                  value={projectData.tags}
                  data-testid={bem('ProjectTags')}
                  className={bem('Input', { error: errors.tags })}
                  error={errors.tags}
                  onChange={(e) =>
                    handleFieldChange(e as React.ChangeEvent<HTMLInputElement>, 'tags')
                  }
                />
              </Grid>

              <Grid item xs={12} display="flex">
                <Button
                  className={bem('Button', { disabled: !errors.noErrors || processing })}
                  data-testid={bem('Button')}
                  type="submit"
                  variant="contained"
                  disabled={!errors.noErrors || processing}
                  sx={{ mt: 4 }}
                  onClick={() => submit(projectData)}
                >
                  {projectData._id ? 'Save' : 'Create'}
                </Button>
              </Grid>
            </Grid>

            {errors.errorMessage ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert className={bem('Alert', { error: true })} severity="error">
                  {errors.errorMessage}
                </Alert>
              </motion.div>
            ) : null}

            {successMessage ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert className={bem('Alert', { success: true })} severity="success">
                  {successMessage + ', '}
                  <Link
                    className={bem('AlertLink')}
                    to={`/customer-page`}
                    state={{ tab: '2' }}
                  >
                    see my projects
                  </Link>
                </Alert>
              </motion.div>
            ) : null}
          </form>
        )}
      </Box>
    </motion.div>
  )
}

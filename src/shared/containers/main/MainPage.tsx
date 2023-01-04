import { alpha, Box, Grid, InputBase, styled } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { cn } from '@bem-react/classname'

import './MainPage.scss'
import {
  selectAuditors,
  selectAuditorsError,
  selectAuditorsLoading,
  selectProjects,
  selectProjectsError,
  selectProjectsLoading,
} from 'shared/state/shared.selectors'
import { Welcome } from 'shared/components/welcome/Welcome'
import { selectUser } from 'user/state/user.selectors'
import { AccountType } from 'shared/models/user'
import { ProjectCard } from '@customer/components/project-card/ProjectCard'
import { AuditorCard } from '@auditor/components/auditor-card/AuditorCard'
import { doAfterDelay } from 'shared/helpers/do-after-delay'
import { sharedActions } from 'shared/state/shared.reducer'

const componentId = 'MainPage'
const bem = cn(componentId)

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '16ch',
      '&:focus': {
        width: '24ch',
      },
    },
  },
}))

export const MainPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const auditors = useSelector(selectAuditors)
  const loadingAuditors = useSelector(selectAuditorsLoading)
  const loadingAuditorsError = useSelector(selectAuditorsError)
  const projects = useSelector(selectProjects)
  const loadingProjects = useSelector(selectProjectsLoading)
  const loadingProjectsError = useSelector(selectProjectsError)
  const doNothing = () => {}
  let delayTimer: any

  const selectAccountTypeHandler = (type: AccountType) => {
    dispatch(sharedActions.setUserPreferences(type))
    navigate('/sign-up')
  }

  const onAuditorsSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    doAfterDelay(() => {
      dispatch(sharedActions.loadAuditors(event.target.value))
    }, 100)

  const onProjectsSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    doAfterDelay(() => {
      dispatch(sharedActions.loadProjects(event.target.value))
    }, 100)

  useEffect(() => {
    dispatch(sharedActions.loadAuditors(''))
    dispatch(sharedActions.loadProjects(''))
  }, [dispatch])

  return (
    <div className={bem()}>
      {user ? null : <Welcome onSelect={selectAccountTypeHandler} />}

      <Grid container spacing={6} className={bem('Content')}>
        <Grid item xs={12} sm={6} className={bem('Cards')} data-testid={bem('Auditors')}>
          <Box className={bem('CardsHeader')}>
            <span className={bem('Title')}>Audits</span>

            <Search className={bem('Search')}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={onAuditorsSearchChange}
                placeholder="Search by tag…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          <Grid container spacing={2}>
            {/* {loadingAuditors ? 'Loading...' : null} */}
            {loadingAuditorsError ? loadingAuditorsError : null}
            {auditors.map((auditor) => (
              <Grid item xs={12} sm={6} key={auditor._id}>
                <AuditorCard auditor={auditor}></AuditorCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} className={bem('Cards')} data-testid={bem('Projects')}>
          <Box className={bem('CardsHeader')}>
            <span className={bem('Title')}>Projects</span>

            <Search className={bem('Search')}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={onProjectsSearchChange}
                placeholder="Search by tag…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          <Grid container spacing={2}>
            {/* {loadingProjects ? 'Loading...' : null} */}
            {loadingProjectsError ? loadingProjectsError : null}
            {projects.map((project) => (
              <Grid item xs={12} sm={6} key={project._id}>
                <ProjectCard project={project}></ProjectCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

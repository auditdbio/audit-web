import { alpha, Box, Grid, InputBase, styled, Typography } from '@mui/material'
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
  selectProjectsLoading,
} from 'shared/state/shared.selectors'
import { Welcome } from 'shared/components/welcome/Welcome'
import { selectUser } from 'user/state/user.selectors'
import { AccountType } from 'shared/models/user'
import { ProjectCard } from '@customer/components/project-card/ProjectCard'
import { sharedActions } from 'shared/state/shared.reducer'
import { AuditorCard } from '@auditor/components/auditor-card/AuditorCard'

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
      width: '12ch',
      '&:focus': {
        width: '20ch',
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
  const loadingProjectsError = useSelector(selectProjects)
  const doNothing = () => {}

  const selectAccountTypeHandler = (type: AccountType) => {
    dispatch(sharedActions.setUserPreferences(type))
    navigate('/sign-up')
  }

  useEffect(() => {
    dispatch(sharedActions.loadAuditors())
    dispatch(sharedActions.loadProjects())
  }, [dispatch])

  return (
    <div className={bem()}>
      {user ? null : <Welcome onSelect={selectAccountTypeHandler} />}

      <Grid container className={bem('Content')}>
        <Grid item xs={12} sm={6} className={bem('Cards')} data-testid={bem('Auditors')}>
          <Box className={bem('CardsHeader')}>
            <Typography variant="h6" gutterBottom component="div">
              Audits
            </Typography>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          <Grid container spacing={2}>
            {loadingAuditors ? 'Loading...' : null}
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
            <Typography variant="h6" gutterBottom component="div">
              Projects
            </Typography>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          <Grid container spacing={2}>
            {loadingProjects ? 'Loading...' : null}
            {/* {loadingProjectsError ? loadingProjectsError : null} */}
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

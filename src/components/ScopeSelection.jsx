import React, { useEffect, useState } from 'react';
import { Box, Button, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { SCOPE_GIT_BLOCK, SCOPE_LINKS } from '../services/constants.js';
import AddLinkIcon from '@mui/icons-material/AddLink.js';
import TagsField from './forms/tags-field/tags-field.jsx';
import GitHubIcon from '@mui/icons-material/GitHub.js';
import theme from '../styles/themes.js';
import GithubSelection from './GithubSelection/GithubSelection.jsx';
import LinkIcon from '@mui/icons-material/Link';
import GithubBranchIcon from './icons/GithubBranchIcon.jsx';
import { useDispatch, useSelector } from 'react-redux';

const ScopeSelection = ({
  scope,
  project,
  setFieldValue,
  setFieldTouched,
  onBlur,
  sx = {},
}) => {
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [isGithubSelectionOpen, setIsGithubSelectionOpen] = useState(false);
  const [typeScope, setTypeScope] = useState(scope.type || SCOPE_LINKS);
  const { sha, repoOwner } = useSelector(state => state.github);
  const [clear, setClear] = useState(false);

  const handleChangeScopeType = (type, setFieldValue) => {
    if (type === SCOPE_LINKS) {
      setFieldValue('scope', {
        type,
        content: [],
      });
      setClear(false);
    } else if (type === SCOPE_GIT_BLOCK) {
      setClear('clear');
      setFieldValue('scope', {
        type,
        content: {
          repository: {
            clone_url: null,
            display_url: null,
          },
          commit: null,
          files: [],
        },
      });
    }
  };

  return (
    <Box>
      {/*temporarily disabled*/}
      {/*TODO: uncomment this*/}

      {/*{scope.type === SCOPE_GIT_BLOCK ? (*/}
      {/*  <Box sx={[linkFieldWrapper, { height: '44px' }, sx]}>*/}
      {/*    <Button*/}
      {/*      variant="contained"*/}
      {/*      sx={{ flex: 1, height: '100%' }}*/}
      {/*      onClick={() => setIsGithubSelectionOpen(true)}*/}
      {/*    >*/}
      {/*      Add scope from GitHub*/}
      {/*    </Button>*/}
      {/*    <Tooltip*/}
      {/*      title={*/}
      {/*        scope?.content?.files?.length*/}
      {/*          ? 'Adding manually is not available if there are links added using GitHub'*/}
      {/*          : 'Add links manually'*/}
      {/*      }*/}
      {/*      arrow={true}*/}
      {/*      placement="top"*/}
      {/*    >*/}
      {/*      <Box sx={{ height: '100%' }}>*/}
      {/*        <Button*/}
      {/*          variant="contained"*/}
      {/*          sx={{*/}
      {/*            width: '50px',*/}
      {/*            minWidth: 'unset',*/}
      {/*            height: '100%',*/}
      {/*          }}*/}
      {/*          color="secondary"*/}
      {/*          onClick={() =>*/}
      {/*            handleChangeScopeType(SCOPE_LINKS, setFieldValue)*/}
      {/*          }*/}
      {/*          disabled={!!scope?.content?.files?.length}*/}
      {/*        >*/}
      {/*          <AddLinkIcon />*/}
      {/*        </Button>*/}
      {/*      </Box>*/}
      {/*    </Tooltip>*/}
      {/*  </Box>*/}
      {/*) : (*/}
      <Box sx={selectionToolSx}>
        <Typography>Add links to the project</Typography>
        <Box sx={{ display: 'flex' }}>
          <Button
            onClick={() => {
              if (typeScope === SCOPE_GIT_BLOCK) {
                handleChangeScopeType(SCOPE_LINKS, setFieldValue);
                setTypeScope(SCOPE_LINKS);
              }
            }}
            sx={[
              githubBtnSx,
              {
                borderRadius: '10px 0 0 10px',
              },
            ]}
            variant={typeScope === SCOPE_LINKS ? 'contained' : 'outlined'}
          >
            <LinkIcon />
          </Button>
          <Tooltip
            title={
              scope?.content?.length
                ? 'Selection via GitHub is not available if there are links added manually'
                : 'Use GitHub to choose scope'
            }
            arrow={true}
            placement="top"
          >
            <span>
              <Button
                onClick={() => {
                  if (typeScope === SCOPE_LINKS) {
                    if (typeScope === SCOPE_LINKS) {
                      handleChangeScopeType(SCOPE_GIT_BLOCK, setFieldValue);
                      setTypeScope(SCOPE_GIT_BLOCK);
                    }
                    setIsGithubSelectionOpen(true);
                  }
                }}
                variant={
                  typeScope === SCOPE_GIT_BLOCK ? 'contained' : 'outlined'
                }
                sx={[
                  githubBtnSx,
                  { borderRadius: '0 10px 10px 0', ml: '-1px' },
                ]}
                className="github-btn"
              >
                <GitHubIcon />
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Typography>Select scope from Github</Typography>
      </Box>
      <Box sx={[linkFieldWrapper, sx]}>
        <Box
          sx={{
            width: typeScope === SCOPE_LINKS ? '100%' : '52px',
            display: 'flex',
            alignItems: 'center',
            transition: '0.6s',
            position: 'relative',
            gap: '7px',
          }}
        >
          <Box
            sx={{
              width: '100%',
              opacity: typeScope === SCOPE_LINKS ? '1' : '0',
              transition: '0.6s',
            }}
          >
            <TagsField
              size={matchSm ? 'small' : 'medium'}
              name="scope"
              label="Project links"
              setFieldTouched={setFieldTouched}
              onBlur={onBlur}
              disabled={!!scope?.content?.files?.length}
            />
          </Box>
          {/*{typeScope !== SCOPE_LINKS && (*/}
          {/*  <Button*/}
          {/*    onClick={() => {*/}
          {/*      handleChangeScopeType(SCOPE_LINKS, setFieldValue);*/}
          {/*      setTypeScope(SCOPE_LINKS);*/}
          {/*    }}*/}
          {/*    sx={[*/}
          {/*      githubBtnSx,*/}
          {/*      {*/}
          {/*        position: typeScope !== SCOPE_LINKS ? 'absolute' : 'initial',*/}
          {/*        right: 0,*/}
          {/*        zIndex: 2,*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*    variant={'contained'}*/}
          {/*  >*/}
          {/*    <LinkIcon />*/}
          {/*  </Button>*/}
          {/*)}*/}
        </Box>
        <Box
          sx={{
            minHeight: '46px',
            width: typeScope !== SCOPE_LINKS ? '100%' : '0',
          }}
        >
          {typeScope === SCOPE_GIT_BLOCK && (
            <Box sx={{ display: 'flex', gap: '7px' }}>
              <Typography
                variant={'h6'}
                sx={{ width: '100%', textAlign: 'center' }}
              >
                Github selection
              </Typography>
              <Tooltip
                title={
                  scope?.content?.length
                    ? 'Selection via GitHub is not available if there are links added manually'
                    : 'Use GitHub to choose scope'
                }
                arrow={true}
                placement="top"
              >
                <span>
                  <Button
                    onClick={() => {
                      // handleChangeScopeType(SCOPE_GIT_BLOCK, setFieldValue);
                      setIsGithubSelectionOpen(true);
                    }}
                    variant="contained"
                    sx={githubBtnSx}
                    className="github-btn"
                    disabled={!!scope?.content?.length}
                  >
                    <GitHubIcon />
                    {/*<GithubBranchIcon />*/}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ mt: '10px' }}>
        {typeScope === SCOPE_LINKS ? (
          <Typography
            variant={'body2'}
            sx={{ color: 'text.secondary', fontSize: '16px' }}
          >
            Add links to the project
          </Typography>
        ) : (
          <Box>
            {!scope?.content?.files?.length ? (
              <Typography
                variant="body2"
                sx={{
                  color: '#1f1f1f',
                  fontSize: '16px',
                }}
              >
                {' '}
                Select scope from GitHub
              </Typography>
            ) : (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1f1f1f',
                    fontSize: '16px',
                  }}
                >
                  Repository:{' '}
                  <span style={{ fontWeight: 500, color: '#000' }}>
                    {repoOwner}
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1f1f1f',
                    fontSize: '16px',
                  }}
                >
                  Commit:{' '}
                  <span style={{ fontWeight: 500, color: '#000' }}>{sha}</span>
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>
      {/*)}*/}
      <GithubSelection
        project={project}
        clearRepo={clear}
        isOpen={isGithubSelectionOpen}
        setIsOpen={setIsGithubSelectionOpen}
      />
    </Box>
  );
};

export default ScopeSelection;

const linkFieldWrapper = theme => ({
  display: 'flex',
  gap: '7px',
  alignItems: 'center',
  '& .field-wrapper': {
    width: '100%',
  },
  [theme.breakpoints.down('md')]: {
    '& label': { top: '-5px!important' },
  },
  [theme.breakpoints.down('sm')]: {
    '& label': { top: '0px!important' },
  },
  [theme.breakpoints.down(500)]: {
    gap: '10px',
  },
});

const selectionToolSx = theme => ({
  display: 'flex',
  alignItems: 'center',
  mb: '21px',
  gap: '10px',
  justifyContent: 'center',
  '& p': {
    fontSize: '18px',
  },
  [theme.breakpoints.down('md')]: {
    '& p': {
      fontSize: '16px',
      textAlign: 'center',
    },
  },
  [theme.breakpoints.down(1120)]: {
    '& p': {
      fontSize: '14px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    marginBottom: '17px',
  },
});

const githubBtnSx = theme => ({
  padding: '12px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  width: '50px!important',
  minWidth: '50px',
  borderRadius: '10px',
  height: '44px',
  boxShadow: 'unset',
  [theme.breakpoints.down('md')]: {
    padding: '10px 0',
  },
});

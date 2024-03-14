import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom/dist';
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  useMediaQuery,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PublicProjectCard from './PublicProjectCard';
import theme from '../../../styles/themes';
import { getAllProjects } from '../../../redux/actions/projectAction.js';
import { clearMessage } from '../../../redux/actions/auditAction.js';
import { gridItemStylePublic } from './AuditorSection.jsx';
import { addTestsLabel } from '../../../lib/helper.js';
import { Link } from 'react-router-dom';

const ProjectSection = () => {
  const dispatch = useDispatch();
  const matchSm = useMediaQuery(theme.breakpoints.down('xs'));
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const [projectFound, setProjectFound] = useState(true);

  const projectReducer = useSelector(state => state.project.projects);

  useEffect(() => {
    if (searchInput) {
      dispatch(getAllProjects(searchInput, 4));
    } else {
      dispatch(getAllProjects('', 4));
    }
  }, [searchInput]);

  useEffect(() => {
    return () => dispatch(clearMessage());
  }, []);

  useEffect(() => {
    if (projectReducer && projectReducer.length !== 0) {
      setProjectFound(true);
    } else {
      setProjectFound(false);
    }
  }, [projectReducer]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={headerWrapper}>
        <Typography variant="h1" sx={titleSx}>
          <Link style={{ color: '#fff' }} to={'/projects'}>
            Projects
          </Link>
        </Typography>
        <Box sx={searchWrapper}>
          <InputBase
            sx={inputSx}
            inputProps={{
              'aria-label': 'search google maps',
              style: {
                color: 'white',
                lineHeight: '26px',
                padding: '0',
              },
              ...addTestsLabel('homepage_projects-search-input'),
            }}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                navigate(`/projects?search=${searchInput}`);
              }
            }}
          />
          <IconButton
            type="button"
            sx={{ p: '10px', color: 'white' }}
            aria-label="search"
            disableRipple
            onClick={() => navigate(`/projects?search=${searchInput}`)}
            {...addTestsLabel('homepage_projects-search-button')}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ height: '2rem' }} />
      {!projectFound && (
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 500, marginBottom: '20px' }}
          >
            No projects found
          </Typography>
        </Box>
      )}
      <Grid
        container
        rowSpacing={matchSm ? 2 : 4}
        columnSpacing={matchSm ? 2 : 4}
      >
        {projectReducer &&
          projectReducer.slice(0, matchSm ? 4 : 3).map(project => (
            <Grid key={project.id} item sx={gridItemStylePublic}>
              <PublicProjectCard project={project} />
            </Grid>
          ))}
      </Grid>

      {/*<Box*/}
      {/*  sx={{*/}
      {/*    display: 'flex',*/}
      {/*    justifyContent: 'end',*/}
      {/*    alignItems: 'center',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Typography variant="body2">view more...</Typography>*/}
      {/*</Box>*/}
    </Box>
  );
};

const titleSx = theme => ({
  fontWeight: 500,
  position: 'relative',
  '&:hover::after': {
    opacity: 1,
    transform: 'scaleX(1)',
  },
  '&::after': {
    content: '" "',
    position: 'absolute',
    left: 0,
    bottom: '-2px',
    width: '100%',
    height: '2px',
    opacity: 0,
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    transform: 'scaleX(0)',
    backgroundColor: '#fff',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '28px',
  },
});

const headerWrapper = {
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  gap: '2rem',
};

const searchWrapper = {
  display: 'flex',
  alignItems: 'center',
  border: '2px white solid',
  borderRadius: '15px',
  padding: '0',
  maxHeight: '42px',
  width: '60%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
};

const inputSx = {
  ml: 1,
  flex: 1,
  white: 'color',
  padding: '0',
};

export default ProjectSection;

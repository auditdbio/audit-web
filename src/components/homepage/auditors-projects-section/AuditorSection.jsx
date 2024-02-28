import AuditorCard from './AuditorCard';
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  useMediaQuery,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import theme from '../../../styles/themes';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuditors } from '../../../redux/actions/auditorAction.js';
import { useNavigate } from 'react-router-dom/dist';
import { addTestsLabel } from '../../../lib/helper.js';
import { Link } from 'react-router-dom';

const AuditorSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchSm = useMediaQuery(theme.breakpoints.down('xs'));

  const [searchInput, setSearchInput] = useState('');

  const [auditorFound, setAuditorFound] = useState(true);

  const auditorReducer = useSelector(state => state.auditor);

  useEffect(() => {
    if (searchInput) {
      dispatch(getAuditors(searchInput, 4));
    } else {
      dispatch(getAuditors('', 4));
    }
  }, [searchInput]);

  useEffect(() => {
    if (auditorReducer.auditors && auditorReducer.auditors.length != 0) {
      setAuditorFound(true);
    } else {
      setAuditorFound(false);
    }
  }, [auditorReducer]);

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Box sx={headerWrapper}>
        <Typography variant="h1" sx={titleSx}>
          <Link style={{ color: '#fff' }} to={'/auditors'}>
            Auditors
          </Link>
        </Typography>
        <Box sx={searchWrapper}>
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              white: 'color',
              padding: '0',
            }}
            inputProps={{
              'aria-label': 'search google maps',
              style: {
                color: 'white',
                lineHeight: '26px',
                padding: '0',
              },
              ...addTestsLabel('homepage_auditors-search-input'),
            }}
            value={searchInput}
            onChange={e => {
              setSearchInput(e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                navigate(`/auditors?search=${searchInput}`);
              }
            }}
          />
          <IconButton
            type="button"
            sx={{ p: '10px', color: 'white' }}
            aria-label="search"
            disableRipple
            onClick={() => {
              navigate(`/auditors?search=${searchInput}`);
            }}
            {...addTestsLabel('homepage_auditors-search-button')}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ height: '2rem' }} />
      {!auditorFound && (
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 500, marginBottom: '20px' }}
          >
            No auditors found
          </Typography>
        </Box>
      )}
      <Grid
        container
        rowSpacing={matchSm ? 2 : 4}
        columnSpacing={matchSm ? 2 : 4}
        // justifyContent="space-between"
      >
        {auditorReducer.auditors &&
          auditorReducer?.auditors?.slice(0, matchSm ? 4 : 3)?.map(auditor => (
            <Grid key={auditor.user_id} item sx={gridItemStylePublic}>
              <AuditorCard auditor={auditor} />
            </Grid>
          ))}
      </Grid>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
        }}
      >
        {/*<Typography variant="body2">view more...</Typography>*/}
      </Box>
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

export const gridItemStylePublic = theme => ({
  width: '33.330%',
  [theme.breakpoints.down('xs')]: {
    width: '50%',
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
export default AuditorSection;

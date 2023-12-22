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
import AuditorCard from './AuditorCard';
import theme from '../../../styles/themes';
import { getAuditors } from '../../../redux/actions/auditorAction.js';
import { addTestsLabel } from '../../../lib/helper.js';
import { sliceCards } from './AuditorsProjectsSection.jsx';

const AuditorSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));

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

  useEffect(() => {}, [auditorReducer]);

  useEffect(() => {
    if (auditorReducer.auditors && auditorReducer.auditors.length != 0) {
      setAuditorFound(true);
    } else {
      setAuditorFound(false);
    }
  }, [auditorReducer]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={headerWrapper}>
        <Typography variant="h1" sx={{ fontWeight: 500 }}>
          Auditors
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
              ...addTestsLabel('homepage_auditors-search-input'),
            }}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
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
            onClick={() => navigate(`/auditors?search=${searchInput}`)}
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
      <Grid container spacing={{ zero: 1, xs: 2, lg: 4 }}>
        {auditorReducer.auditors &&
          auditorReducer?.auditors
            ?.slice(...sliceCards(matchSm, matchXs))
            ?.map(auditor => (
              <Grid key={auditor.user_id} item zero={6} xs={4} sm={3}>
                <AuditorCard auditor={auditor} />
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

export default AuditorSection;

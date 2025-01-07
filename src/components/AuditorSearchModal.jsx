import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import theme from '../styles/themes.js';
import { Box } from '@mui/system';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Slider, Typography } from '@mui/material';
import AuditorSearchListBox from './custom/AuditorSearchListBox.jsx';
import IconButton from '@mui/material/IconButton';
import { ArrowBack } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAuditors } from '../redux/actions/auditorAction.js';
import { createRequest } from '../redux/actions/auditAction.js';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom/dist';
import { Field, Formik, Form } from 'formik';
import SalarySlider from './forms/salary-slider/salary-slider.jsx';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import PriceCalculation from './PriceCalculation.jsx';
import TotalPrice from './forms/TotalPrice/TotalPrice.jsx';
import { CLEAR_SEARCHED_AUDITOR } from '../redux/actions/types.js';
import ListBoxItem from './ListBoxItem.jsx';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_URL } from '../services/urls.js';
import _ from 'lodash';

export default function AuditorSearchModal({
  open,
  handleClose,
  handleSubmit,
  setState,
  setError,
  projectInfo,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { auditors: auditorReducer, searchTotalAuditors } = useSelector(
    state => state.auditor,
  );
  const projectReducer = useSelector(state => state.project);
  const customerReducer = useSelector(state => state.customer);
  const [selectedAuditor, setSelectedAuditor] = useState({});
  const [mode, setMode] = useState('search');
  const listInnerRef = useRef();
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [auditors, setAuditors] = useState([]);
  const [lastList, setLastList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const scrollTimeout = useRef(null);

  const handleOptionChange = option => {
    setSelectedAuditor(option);
    setMode('offer');
  };

  const handleSearch = async () => {
    await setState(true);
    handleSubmit();
    localStorage.setItem('prev-path', '/edit-project/' + projectInfo.id);
    await navigate(
      `/auditors?search=${query}&projectIdToInvite=${id || projectInfo.id}`,
    );
  };

  useEffect(() => {
    const fetchAuditors = async () => {
      try {
        setIsLoading(true);
        setPage(1);
        setLastList(false);
        const token = Cookies.get('token');

        if (listInnerRef.current) {
          setScrollPosition(listInnerRef.current.scrollTop);
        }

        const response = await axios.get(
          `${API_URL}/search?query=${query}&sort_by=rating&tags=&sort_order=-1&page=1&per_page=15&kind=auditor badge`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setAuditors(response.data.result);
      } catch (error) {
        console.error('Error fetching auditors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchAuditors();
    }
  }, [query]);

  useEffect(() => {
    if (!isLoading && listInnerRef.current && scrollPosition > 0) {
      requestAnimationFrame(() => {
        listInnerRef.current.scrollTop = scrollPosition;
      });
    }
  }, [isLoading, auditors]);

  useEffect(() => {
    const fetchMoreAuditors = async () => {
      if (isLoading || lastList) return;

      try {
        setIsLoading(true);
        const token = Cookies.get('token');
        const response = await axios.get(
          `${API_URL}/search?query=${query}&sort_by=rating&tags=&sort_order=-1&page=${page}&per_page=15&kind=auditor badge`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.result.length === 0) {
          setLastList(true);
          return;
        }

        setAuditors(prev => {
          const newAuditors = response.data.result;
          const uniqueAuditors = [...prev];

          newAuditors.forEach(newAuditor => {
            if (
              !uniqueAuditors.some(
                existing => existing.user_id === newAuditor.user_id,
              )
            ) {
              uniqueAuditors.push(newAuditor);
            }
          });

          return uniqueAuditors;
        });
      } catch (error) {
        console.error('Error fetching more auditors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (page > 1) {
      fetchMoreAuditors();
    }
  }, [page, query, lastList]);

  const handleScroll = useCallback(
    _.throttle(e => {
      if (!isLoading && !lastList) {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight * 1.2) {
          setPage(prev => prev + 1);
        }
      }
    }, 300),
    [isLoading, lastList, page],
  );

  const handleSearchInput = e => {
    const value = e.target.value;
    setSearchValue(value);

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      setPage(1);
      setLastList(false);
      setQuery(value);
    }, 300);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setPage(1);
        setQuery('');
        setSearchValue('');
        setAuditors([]);
        setMode('search');
        handleClose();
      }}
    >
      {mode === 'search' && (
        <DialogContent sx={modalWindow}>
          <Box sx={fieldButtonContainer}>
            <Box sx={{ position: 'relative', width: '100%' }}>
              <TextField
                value={searchValue}
                onChange={handleSearchInput}
                variant="outlined"
                sx={searchField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={searchIcon} />
                    </InputAdornment>
                  ),
                }}
              />
              {searchValue && auditors.length > 0 && (
                <Box ref={listInnerRef} sx={userListSx} onScroll={handleScroll}>
                  {auditors.map((option, index) => (
                    <Box
                      key={option.user_id}
                      onClick={() => handleOptionChange(option)}
                      sx={{
                        padding: '8px',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    >
                      <AuditorSearchListBox
                        auditor={option}
                        handleSelectOption={() => handleOptionChange(option)}
                      />
                    </Box>
                  ))}
                  {isLoading && (
                    <Box sx={{ textAlign: 'center', padding: '8px' }}>
                      Loading...
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <Button
              sx={findButton}
              onClick={handleSearch}
              {...addTestsLabel('auditor-find-button')}
            >
              Find
            </Button>
          </Box>
        </DialogContent>
      )}
      {mode === 'offer' && (
        <DialogContent sx={offerDialogStyle}>
          <Formik
            initialValues={{
              auditor_contacts: selectedAuditor.contacts ?? {},
              auditor_id: selectedAuditor.user_id,
              customer_contacts: customerReducer.customer
                ? customerReducer.customer.contacts
                : {},
              customer_id: customerReducer.customer.user_id,
              description: projectReducer?.recentProject?.description,
              opener: 'Customer',
              price: 0,
              price_range: {
                from: 0,
                to: 0,
              },
              total_cost: 0,
              project_id: projectReducer?.recentProject?.id,
              scope: projectReducer?.recentProject?.scope,
              time: {
                from: new Date(),
                to: new Date(),
              },
            }}
            validationSchema={MakeOfferSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={async values => {
              await handleSubmit();
              const newValue = {
                ...values,
                total_cost: parseInt(values.total_cost),
                price: parseInt(values.price),
                price_range: {
                  from: parseInt(values.price),
                  to: parseInt(values.price),
                },
              };
              if (projectReducer.recentProject) {
                if (values.auditor_id !== values.customer_id) {
                  dispatch(createRequest(newValue));
                } else {
                  setError('You cannot create an audit request with yourself');
                }
                setMode('search');
                setInputValue('');
                dispatch({ type: CLEAR_SEARCHED_AUDITOR });
                handleClose();
              }
            }}
          >
            {({ handleSubmit, setFieldValue, values }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <Box
                    sx={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box>
                      <IconButton
                        onClick={() => {
                          setMode('search');
                        }}
                        {...addTestsLabel('go-back-button')}
                      >
                        <ArrowBack style={{ color: 'orange' }} />
                      </IconButton>
                    </Box>

                    <Box sx={{ paddingX: '15px' }}>
                      <Typography
                        style={{
                          ...rateLabel(),
                          color: 'black',
                          marginBottom: '10px',
                          fontSize: '13px',
                        }}
                      >
                        Add some information
                      </Typography>
                      <Typography style={rateLabel()}>
                        Choose audit timeline
                      </Typography>
                      <Box sx={dateWrapper}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Field
                            component={DatePicker}
                            name={'time.from'}
                            sx={dateStyle}
                            value={dayjs(values.time?.from)}
                            inputFormat="DD.MM.YYYY"
                            onChange={e => setFieldValue('time.from', e)}
                            disablePast
                            minDate={dayjs()}
                          />
                          <Typography variant={'caption'}>-</Typography>
                          <Field
                            component={DatePicker}
                            name={'time.to'}
                            value={dayjs(values.time?.to)}
                            sx={dateStyle}
                            inputFormat="DD.MM.YYYY"
                            onChange={e => setFieldValue('time.to', e)}
                            disablePast
                            minDate={dayjs(values.time?.from)}
                          />
                        </LocalizationProvider>
                      </Box>
                      <TotalPrice />
                      <Box sx={{ justifyContent: 'center', display: 'flex' }}>
                        <Button
                          sx={sendButton}
                          type={'submit'}
                          {...addTestsLabel('send-button')}
                        >
                          Send
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </DialogContent>
      )}
    </Dialog>
  );
}

const CustomPaper = props => {
  return <Paper className={'sss'} {...props} sx={customDropdown} />;
};

const MakeOfferSchema = Yup.object().shape({
  // price: Yup.number(),
  price_range: Yup.object(),
  project_id: Yup.string(),
  time_frame: Yup.string(),
  time: Yup.object().shape({
    from: Yup.date(),
    to: Yup.date().required().min(Yup.ref('from')),
  }),
});

const userListSx = theme => ({
  position: 'fixed',
  top: 'auto',
  left: 'auto',
  transform: 'translateY(4px)',
  width: '490px',
  maxHeight: '300px',
  overflowY: 'auto',
  backgroundColor: 'white',
  zIndex: 9999,
  border: '1px solid #ddd',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    width: '360px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '278px',
  },
  [theme.breakpoints.down(450)]: {
    width: '200px',
  },
});

const modalWindow = {
  backgroundColor: theme.palette.primary.main,
  width: '700px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    height: '100%',
    width: '500px',
  },
  [theme.breakpoints.down('xs')]: {
    height: '100%',
    width: '400px',
  },
  [theme.breakpoints.down(450)]: {
    height: '100%',
    width: '280px',
  },
};

const offerDialogStyle = {
  backgroundColor: 'white',
  padding: '10px',
  width: '700px',
  '& form': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    paddingBottom: '30px',
    height: '100%',
    width: '100%',
  },
};

const fieldButtonContainer = {
  display: 'flex',
  gap: '10px',
  width: '100%',
};
const searchIcon = {
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
  },
};

const searchField = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.default,
    padding: '0px',
    height: '45px',
    borderRadius: '4px',
    paddingLeft: '8px',
    fontSize: '14px !important',
    [theme.breakpoints.down('sm')]: {
      height: '30px',
      fontSize: '11px',
    },
  },
};
const customDropdown = {
  '& .MuiAutocomplete-listbox': {
    padding: '0',
    overscrollBehavior: 'none',
    scrollBehavior: 'smooth',
  },
  border: '1px solid #434242',
  borderRadius: '0px',
  boxShadow: '0',
  padding: 0,
};
const findButton = {
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.background.default,
  fontWeight: 600,
  borderRadius: '4px',
  padding: '12px 63px',
  height: '45px',
  textTransform: 'none',
  [theme.breakpoints.down('sm')]: {
    height: '30px',
    fontSize: '11px',
    padding: '6px 31px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '6px 18px',
  },
};
const sendButton = {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.default,
  borderRadius: '4px',
  padding: '12px 63px',
  height: '45px',
  width: '50%',
  textTransform: 'none',
  [theme.breakpoints.down('sm')]: {
    height: '30px',
    fontSize: '11px',
    padding: '6px 31px',
  },
  ':hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.default,
  },
};
const rateLabel = theme => ({
  fontSize: '11px',
  color: '#B2B3B3',
  fontWeight: 500,
});

const sliderSx = theme => ({
  height: '9px',
  '& .MuiSlider-track, .MuiSlider-rail': {
    backgroundColor: '#B9B9B9',
    border: 'none',
  },
});

const infoWrapper = theme => ({
  border: '1.42857px solid #E5E5E5',
  width: '100px',
  padding: '15px 0',
  textAlign: 'center',
});
const dateWrapper = {
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5rem',
  alignItems: 'center',
  width: '100%',
  marginTop: '5px',
  marginBottom: '30px',
  [theme.breakpoints.down('sm')]: {
    gap: '5px',
    '& span': {
      fontSize: '8px',
    },
  },
};
const dateStyle = {
  width: '150px',
  height: '40px',
  '& .MuiPickersDay-day': {
    fontSize: '0.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
  },
};

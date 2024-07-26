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
import { useEffect, useState } from 'react';
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  Paper,
  Slider,
  Typography,
} from '@mui/material';
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
import { addTestsLabel } from '../lib/helper.js';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import PriceCalculation from './PriceCalculation.jsx';
import { ASSET_URL } from '../services/urls.js';
import TotalPrice from './forms/TotalPrice/TotalPrice.jsx';

export default function AuditorSearchModal({
  open,
  handleClose,
  handleSubmit,
  setState,
  setError,
  invite,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const auditorReducer = useSelector(state => state.auditor.auditors);
  const projectReducer = useSelector(state => state.project);
  const customerReducer = useSelector(state => state.customer);
  const [selectedAuditor, setSelectedAuditor] = useState({});
  const organization = useSelector(s => s.organization.organization);

  const [openDrop, setOpenDrop] = useState(false);
  const [mode, setMode] = useState('search');

  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(getAuditors(query, 15));
  }, [query]);

  const handleInputChange = event => {
    setQuery(event.target.value);
  };

  const handleOptionChange = option => {
    setSelectedAuditor(option);
    if (invite) {
      setMode('invite');
    } else {
      setMode('offer');
    }
  };

  const handleInviteUser = () => {
    console.log({ ...selectedAuditor });
  };

  const handleSearch = async () => {
    await setState(true);
    handleSubmit();
    await navigate(`/auditors?search=${query}&projectIdToInvite=${id}`);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {mode === 'search' && (
        <DialogContent sx={modalWindow}>
          <Box sx={fieldButtonContainer}>
            {auditorReducer && (
              <Autocomplete
                open={openDrop}
                onOpen={() => {
                  if (inputValue) {
                    setOpenDrop(true);
                  }
                }}
                openOnFocus={true}
                onClose={() => setOpenDrop(false)}
                inputValue={inputValue}
                onInputChange={(e, value, reason) => {
                  setInputValue(value);
                  if (!value) {
                    setOpenDrop(false);
                  }
                }}
                freeSolo
                onChange={handleOptionChange}
                options={auditorReducer}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                filterOptions={options => options}
                getOptionLabel={option => option.user_id}
                renderOption={(props, option) => (
                  <AuditorSearchListBox
                    {...props}
                    auditor={option}
                    handleSelectOption={() => handleOptionChange(option)}
                  />
                )}
                PaperComponent={CustomPaper}
                renderInput={params => (
                  <TextField
                    variant="outlined"
                    onChange={handleInputChange}
                    {...params}
                    id="name"
                    sx={searchField}
                    type="text"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <SearchIcon sx={searchIcon} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
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
                            minDate={new Date()}
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
      {mode === 'invite' && (
        <DialogContent sx={offerDialogStyle}>
          <Box sx={{ p: '15px' }}>
            <Typography variant={'h4'} sx={{ fontWeight: 500 }}>
              Current organization
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                marginY: '15px',
              }}
            >
              <Avatar src={`${ASSET_URL}/${organization.avatar}`} />
              <Typography variant={'h5'}>{organization.name}</Typography>
            </Box>
            <Typography variant={'h5'} sx={{ fontWeight: 500 }}>
              Rules for the selected user in the organization
            </Typography>
            <Box
              sx={{
                mt: '10px',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              <FormControlLabel
                value="Representative"
                control={<Checkbox />}
                label="Representative"
                labelPlacement="top"
              />
              <FormControlLabel
                value="Editor"
                control={<Checkbox />}
                label="Editor"
                labelPlacement="top"
              />
            </Box>
            <Button
              variant={'contained'}
              sx={{
                textTransform: 'unset',
                display: 'block',
                marginX: 'auto',
                marginTop: '20px',
              }}
              onClick={handleInviteUser}
            >
              Invite
            </Button>
          </Box>
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

const modalWindow = {
  backgroundColor: theme.palette.primary.main,
  width: '700px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    height: '100%',
    width: '100%',
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
};
const searchIcon = {
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
  },
};

const searchField = {
  '& .MuiAutocomplete-listbox': {
    border: 'none',
  },
  '& .MuiAutocomplete-input': {
    fontSize: '14px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '11px',
    },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.default,
    padding: '0px',
    height: '45px',
    borderRadius: '4px',
    paddingLeft: '8px',
    fontSize: '14px !important',
    width: '465px',
    [theme.breakpoints.down('sm')]: {
      width: '120px',
      height: '30px',
      fontSize: '11px',
    },
  },
};
const customDropdown = {
  '& .MuiAutocomplete-listbox': {
    padding: '0',
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

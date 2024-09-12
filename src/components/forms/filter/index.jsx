import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Radio,
  Typography,
} from '@mui/material';
import { ArrowBack, SearchOutlined } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import TagsField from '../tags-field/tags-field.jsx';
import TagsArray from '../../tagsArray/index.jsx';
import theme from '../../../styles/themes.js';
import { SliderRange } from '../salary-slider/slider-range.jsx';
import { PROJECTS } from '../../../redux/actions/types.js';
import { addTestsLabel } from '../../../lib/helper.js';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const Filter = ({ target, submit, initial }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [upToDown, setUpToDown] = useState(initial.sort);
  const mainColor = target === PROJECTS ? 'secondary' : 'primary';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Formik
      initialValues={initial}
      enableReinitialize
      onSubmit={values => {
        submit(values);
        setIsOpen(false);
      }}
    >
      {({ handleSubmit, values, setFieldValue, getFieldMeta }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Box>
              <Box sx={headerWrapper}>
                <Field
                  component={TextField}
                  name="search"
                  disabled={false}
                  size="small"
                  label="Search"
                  inputProps={{ ...addTestsLabel('search-input') }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          type="submit"
                          color="disabled"
                          aria-label="Search"
                          {...addTestsLabel('search-button')}
                        >
                          <SearchOutlined />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  sx={filterButton}
                  onClick={() => setIsOpen(!isOpen)}
                  {...addTestsLabel('filters-button')}
                >
                  All filters
                </Button>
              </Box>

              {isOpen && (
                <Box sx={modalBg}>
                  <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                    <Box sx={modalWrapper(theme, mainColor)}>
                      <Button
                        sx={backButtonSx}
                        onClick={handleClose}
                        {...addTestsLabel('filter_go-back-button')}
                      >
                        <ArrowBack color={mainColor} />
                      </Button>
                      <Box>
                        <TagsField name="tags" label="Tags" size="small" />
                        <TagsArray name="tags" />
                      </Box>
                      <Field
                        name="price"
                        value={values.price}
                        label="Price per line of code"
                        component={SliderRange}
                        sx={priceSlider(target)}
                        min={0}
                        max={200}
                        onChange={(e, newValue) => {
                          const value = Array.isArray(newValue)
                            ? newValue
                            : [newValue, newValue];
                          setFieldValue('price.from', value[0]);
                          setFieldValue('price.to', value[1]);
                        }}
                      />
                      <Box>
                        <Typography>Time frame</Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                          }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Field
                              component={DatePicker}
                              name="dateFrom"
                              defaultValue={new Date()}
                              value={dayjs(values.dateFrom)}
                              sx={dateStyle}
                              inputFormat="DD.MM.YYYY"
                              onChange={e => {
                                const value = new Date(e);
                                setFieldValue('dateFrom', value.toString());
                              }}
                              disablePast
                            />
                            <Typography
                              variant="caption"
                              sx={{ fontSize: '16px' }}
                            >
                              -
                            </Typography>
                            <Field
                              component={DatePicker}
                              name="dateTo"
                              value={dayjs(values.dateTo)}
                              sx={dateStyle}
                              onChange={e => {
                                const value = new Date(e);
                                setFieldValue('dateTo', value.toString());
                              }}
                              disablePast
                              inputFormat="DD.MM.YYYY"
                            />
                          </LocalizationProvider>
                        </Box>
                      </Box>
                      <Box sx={sortWrapper}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={e =>
                                  setFieldValue('readyToWait', e.target.checked)
                                }
                                color={mainColor}
                                inputProps={{
                                  ...addTestsLabel('ready-to-wait-button'),
                                }}
                              />
                            }
                            label="Ready to wait"
                          />
                        </FormGroup>
                      </Box>
                      {target === 'auditor' && (
                        <Box sx={sortWrapper}>
                          <Typography>Sort by</Typography>
                          <FormGroup>
                            <Button
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                minWidth: 'unset',
                                padding: 'unset',
                                width: '125px',
                                textTransform: 'unset',
                                '& label': {
                                  marginRight: 'unset',
                                },
                              }}
                              onClick={e => {
                                if (values.sort_by === 'price') {
                                  if (values.sort === '1') {
                                    setFieldValue('sort', '-1');
                                    setUpToDown('-1');
                                  } else {
                                    setFieldValue('sort', '1');
                                    setUpToDown('1');
                                  }
                                } else {
                                  setFieldValue('sort_by', 'price');
                                }
                              }}
                            >
                              <FormControlLabel
                                name="sort_by"
                                control={
                                  <Radio
                                    onChange={e =>
                                      setFieldValue('sort_by', e.target.value)
                                    }
                                    value="price"
                                    sx={{
                                      color: 'orange',
                                      '&.Mui-checked': {
                                        color: 'orange',
                                      },
                                    }}
                                    checked={values.sort_by === 'price'}
                                    inputProps={{
                                      ...addTestsLabel('price'),
                                    }}
                                  />
                                }
                                color={mainColor}
                                label={''}
                              />
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Typography sx={{ color: '#000!important' }}>
                                  Price
                                </Typography>
                                {upToDown === '1' ? (
                                  <ArrowUpwardIcon
                                    sx={{
                                      // fontSize: 'small',
                                      color: 'black',
                                      width: '19px',
                                      height: '19px',
                                    }}
                                  />
                                ) : (
                                  <ArrowDownwardIcon
                                    sx={{
                                      // fontSize: 'small',
                                      color: 'black',
                                      width: '19px',
                                      height: '19px',
                                    }}
                                  />
                                )}
                              </Box>
                            </Button>
                            <Button
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                minWidth: 'unset',
                                padding: 'unset',
                                width: '125px',
                                textTransform: 'unset',
                                '& label': {
                                  marginRight: 'unset',
                                },
                              }}
                              onClick={e => {
                                if (values.sort_by === 'rating') {
                                  if (values.sort === '1') {
                                    setFieldValue('sort', '-1');
                                    setUpToDown('-1');
                                  } else {
                                    setFieldValue('sort', '1');
                                    setUpToDown('1');
                                  }
                                } else {
                                  setFieldValue('sort_by', 'rating');
                                }
                              }}
                            >
                              <FormControlLabel
                                name="sort_by"
                                control={
                                  <Radio
                                    onChange={e =>
                                      setFieldValue('sort_by', e.target.value)
                                    }
                                    value="rating"
                                    sx={{
                                      color: 'orange',
                                      '&.Mui-checked': {
                                        color: 'orange',
                                      },
                                    }}
                                    checked={values.sort_by === 'rating'}
                                    inputProps={{
                                      ...addTestsLabel('rating'),
                                    }}
                                  />
                                }
                                color={mainColor}
                                label={''}
                              />
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Typography sx={{ color: '#000!important' }}>
                                  Rating
                                </Typography>
                                {upToDown === '1' ? (
                                  <ArrowUpwardIcon
                                    sx={{
                                      // fontSize: 'small',
                                      color: 'black',
                                      width: '19px',
                                      height: '19px',
                                    }}
                                  />
                                ) : (
                                  <ArrowDownwardIcon
                                    sx={{
                                      // fontSize: 'small',
                                      color: 'black',
                                      width: '19px',
                                      height: '19px',
                                    }}
                                  />
                                )}
                              </Box>
                            </Button>
                          </FormGroup>
                        </Box>
                      )}
                      <Button
                        color={mainColor}
                        type="submit"
                        variant="contained"
                        sx={submitButton}
                        {...addTestsLabel('find-button')}
                      >
                        Find
                      </Button>
                    </Box>
                  </ClickAwayListener>
                </Box>
              )}
              {/*</Modal>*/}
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Filter;

const modalBg = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: '1000',
};

const modalWrapper = theme => ({
  top: '50%',
  zIndex: '1000',
  position: 'absolute',
  backgroundColor: '#FCFAF6',
  left: '50%',
  width: '700px',
  overflow: 'auto',
  height: '90%',
  maxHeight: '620px',
  transform: 'translate(-50%, -50%)',
  padding: '40px 70px 20px',
  border: '1.42857px solid #D9D9D9',
  boxShadow:
    '0px 71.4286px 57.1429px rgba(0, 0, 0, 0.07), ' +
    '0px 29.8412px 23.8729px rgba(0, 0, 0, 0.0503198), ' +
    '0px 15.9545px 12.7636px rgba(0, 0, 0, 0.0417275), ' +
    '0px 8.94397px 7.15517px rgba(0, 0, 0, 0.035), ' +
    '0px 4.75007px 3.80006px rgba(0, 0, 0, 0.0282725), ' +
    '0px 1.97661px 1.58129px rgba(0, 0, 0, 0.0196802)',
  borderRadius: '10.7143px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  '& p': {
    fontWeight: '500',
    fontSize: '14px',
    color: '#B2B3B3',
    marginBottom: 0,
  },
  '& .field-wrapper': {
    gap: 0,
  },
  [theme.breakpoints.down('md')]: {
    width: '500px',
    padding: '40px 70px 20px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '350px',
    padding: '40px 30px 20px',
    '& p': {
      fontSize: '12px',
    },
    '& .salary-slider': {
      alignItems: 'center',
      '& .MuiSlider-thumb': {
        width: '13px',
        height: '13px',
      },
      gap: '18px',
      '& .MuiBox-root': {
        fontSize: '12px',
        width: '80px',
        paddingY: '5px',
      },
    },
    '& .field-wrapper': {
      '& .MuiInputBase-root': {
        '& svg': {
          width: '15px',
        },
      },
    },
  },
});

const backButtonSx = theme => ({
  position: 'absolute',
  top: '10px',
  left: '10px',
  width: '40px',
  minWidth: 'unset',
  [theme.breakpoints.down('xs')]: {
    top: '5px',
    left: '5px',
    '& svg': {
      width: '16px',
    },
  },
});

const priceSlider = target => ({
  color:
    target === PROJECTS
      ? theme.palette.secondary.main
      : theme.palette.primary.main,
});

const sortWrapper = theme => ({
  '& span': {
    color: '#434242',
    fontSize: '14px',
  },
  [theme.breakpoints.down('xs')]: {
    '& span': {
      fontSize: '12px',
    },
  },
});

const submitButton = theme => ({
  textTransform: 'unset',
  fontSize: '14px',
  width: '438px',
  padding: '11px 0',
  margin: '5px auto 0',
  fontWeight: 600,
  [theme.breakpoints.down('md')]: {
    width: '310px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '250px',
    fontSize: '12px',
  },
});

const headerWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  gap: '22px',
  [theme.breakpoints.down('xs')]: {
    gap: '14px',
  },
});

const dateStyle = {
  width: '180px',
  '& .MuiPickersDay-day': {
    fontSize: '16px!important',
    [theme.breakpoints.down('md')]: {
      fontSize: '12px!important',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px!important',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '16px!important',
    [theme.breakpoints.down('md')]: {
      fontSize: '12px!important',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px!important',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '16px!important',
    [theme.breakpoints.down('md')]: {
      fontSize: '12px!important',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px!important',
    },
  },
  [theme.breakpoints.down('sm')]: {
    width: '130px',
  },
};

const filterButton = theme => ({
  fontSize: '12px',
  lineHeight: 1.2,
  padding: '14px 0',
  width: '160px',
  fontWeight: 600,
  textTransform: 'unset',
  [theme.breakpoints.down('md')]: {
    lineHeight: 1,
  },
  [theme.breakpoints.down('xs')]: {
    width: '110px',
  },
});

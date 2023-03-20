import React, { useState } from "react";
import { Formik, Form } from "formik";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Modal,
  Radio,
  Typography,
} from "@mui/material";
import { Field } from "formik";
import { TextField } from "formik-mui";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TagsField from "../tags-field/tags-field.jsx";
import TagsArray from "../../tagsArray/index.jsx";
import { ArrowBack } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import theme from "../../../styles/themes.js";
import { SliderRange } from "../salary-slider/slider-range.jsx";
import { PROJECTS } from "../../../redux/actions/types.js";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAuditors } from "../../../redux/actions/auditorAction.js";
import { auditorReducer } from "../../../redux/reducers/auditorReducer.js";

const Filter = ({ target }) => {
  const [isOpen, setIsOpen] = useState(false);

  const mainColor = target === PROJECTS ? "secondary" : "primary";
  const dispatch = useDispatch();
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInput = (e, values) => {
    values.search = e.target.value;
    dispatch(getAuditors(e.target.value));
  };

  useEffect(() => {}, [auditorReducer]);

  return (
    <Formik
      initialValues={{
        sort: "",
        search: "",
        tags: [],
        time: {
          begin: "",
          end: "",
        },
        price_range: [0, 200],
      }}
      validationSchema={{}}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={(values) => {
      }}
    >
      {({ handleSubmit, values, setFieldValue, handleChange }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Box>
              <Box sx={headerWrapper}>
                <Field
                  component={TextField}
                  name={"search"}
                  disabled={false}
                  size={"small"}
                  onInput={(e) => handleInput(e, values)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" color="disabled">
                          <SearchOutlinedIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant={"contained"}
                  color={"secondary"}
                  sx={filterButton}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  All filters
                </Button>
              </Box>
              <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
              >
                <Box sx={modalWrapper(theme, mainColor)}>
                  <Button sx={backButtonSx} onClick={handleClose}>
                    <ArrowBack color={mainColor} />
                  </Button>
                  <TagsField
                    name={"tags"}
                    label={"Tags"}
                    placeholder={"Tags"}
                  />
                  <TagsArray name={"tags"} />
                  {/*<SalarySlider max={200} name={"price"} />*/}
                  <Field
                    name="price_range"
                    value={values.price_range}
                    label={"Price per line of code"}
                    component={SliderRange}
                    sx={{
                      color: target === PROJECTS ? "#52176D" : "#FF9900",
                    }}
                    min={0}
                    max={200}
                    onChange={(e) => {
                      handleChange({
                        target: { name: "price_range", value: e.target.value },
                      });
                      // setFieldValue("price_range", value)
                    }}
                  />
                  <Box>
                    <Typography>Time frame</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Field
                          component={DatePicker}
                          name={"time.begin"}
                          value={dayjs(values.time?.begin)}
                          sx={dateStyle}
                          inputFormat="DD.MM.YYYY"
                          onChange={(e) => {
                            const value = new Date(e);
                            setFieldValue("time.begin", value.toString());
                          }}
                          disablePast
                        />
                        <Typography
                          variant={"caption"}
                          sx={{ fontSize: "16px" }}
                        >
                          -
                        </Typography>
                        <Field
                          component={DatePicker}
                          value={dayjs(values.time?.end)}
                          sx={dateStyle}
                          onChange={(e) => {
                            const value = new Date(e);
                            setFieldValue("time.end", value.toString());
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
                        control={<Checkbox color={mainColor} />}
                        label="Ready to wait"
                      />
                    </FormGroup>
                  </Box>
                  <Box sx={sortWrapper}>
                    <Typography>Sort by</Typography>
                    <FormGroup>
                      <FormControlLabel
                        name={"sort"}
                        control={
                          // <Checkbox
                          //     onChange={(e) =>
                          //         setFieldValue("sort", e.target.value)
                          //     }
                          //     value={"low-to-height"}
                          //     color={mainColor}
                          //     checked={values.sort === "low-to-height"}
                          // />
                          <Radio
                            onChange={(e) =>
                              setFieldValue("sort", e.target.value)
                            }
                            value={"low-to-height"}
                            sx={{
                              color: "orange",
                              "&.Mui-checked": {
                                color: "orange",
                              },
                            }}
                            checked={values.sort === "low-to-height"}
                          />
                        }
                        color={mainColor}
                        label="Price: Low to Height"
                      />
                      <FormControlLabel
                        name={"sort"}
                        control={
                          // <Checkbox
                          //   onChange={(e) =>
                          //     setFieldValue("sort", e.target.value)
                          //   }
                          //   value={"height-to-low"}
                          //   color={mainColor}
                          //   checked={values.sort === "height-to-low"}
                          // />
                          <Radio
                            onChange={(e) =>
                              setFieldValue("sort", e.target.value)
                            }
                            value={"height-to-low"}
                            color={mainColor}
                            checked={values.sort === "height-to-low"}
                          />
                        }
                        label="Price: Height to Low "
                      />
                    </FormGroup>
                  </Box>
                  <Button
                    color={mainColor}
                    type={"submit"}
                    variant={"contained"}
                    sx={submitButton}
                  >
                    Find
                  </Button>
                </Box>
              </Modal>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Filter;

const modalWrapper = (theme) => ({
  top: "50%",
  position: "absolute",
  backgroundColor: "#FCFAF6",
  left: "50%",
  width: "700px",
  overflow: "auto",
  height: "90%",
  transform: "translate(-50%, -50%)",
  padding: "70px 110px",
  border: "1.42857px solid #D9D9D9",
  boxShadow:
    "0px 71.4286px 57.1429px rgba(0, 0, 0, 0.07), " +
    "0px 29.8412px 23.8729px rgba(0, 0, 0, 0.0503198), " +
    "0px 15.9545px 12.7636px rgba(0, 0, 0, 0.0417275), " +
    "0px 8.94397px 7.15517px rgba(0, 0, 0, 0.035), " +
    "0px 4.75007px 3.80006px rgba(0, 0, 0, 0.0282725), " +
    "0px 1.97661px 1.58129px rgba(0, 0, 0, 0.0196802)",
  borderRadius: "10.7143px",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
  "& p": {
    fontWeight: "500",
    fontSize: "14px",
    color: "#B2B3B3",
    marginBottom: "34px",
  },
  "& .field-wrapper": {
    gap: 0,
  },
  [theme.breakpoints.down("md")]: {
    width: "500px",
    padding: "60px 80px 20px",
    gap: "20px",
  },
  [theme.breakpoints.down("xs")]: {
    width: "350px",
    padding: "40px 30px 20px",
    gap: "10px",
    "& p": {
      marginBottom: "15px",
      fontSize: "12px",
    },
    "& .salary-slider": {
      alignItems: "center",
      "& .MuiSlider-thumb": {
        width: "13px",
        height: "13px",
      },
      gap: "18px",
      "& .MuiBox-root": {
        fontSize: "12px",
        width: "80px",
        paddingY: "5px",
      },
    },
    "& .field-wrapper": {
      "& .MuiInputBase-root": {
        height: "34px",
        "& svg": {
          width: "15px",
        },
      },
    },
  },
});

const backButtonSx = (theme) => ({
  width: "40px",
  minWidth: "unset",
  marginLeft: "-100px",
  marginTop: "-60px",
  [theme.breakpoints.down("md")]: {
    marginLeft: "-70px",
    marginTop: "-50px",
  },
  [theme.breakpoints.down("xs")]: {
    marginLeft: "-30px",
    marginTop: "-40px",
    "& svg": {
      width: "16px",
    },
  },
});

const sortWrapper = (theme) => ({
  "& span": {
    color: "#434242",
    fontSize: "14px",
  },
  [theme.breakpoints.down("xs")]: {
    "& span": {
      fontSize: "12px",
    },
  },
});

const submitButton = (theme) => ({
  textTransform: "unset",
  fontSize: "18px",
  width: "438px",
  padding: "24px 0",
  margin: "25px auto 0",
  [theme.breakpoints.down("md")]: {
    width: "310px",
    padding: "15px 0",
  },
  [theme.breakpoints.down("xs")]: {
    width: "250px",
    padding: "12px 0",
    fontSize: "14px",
  },
});

const headerWrapper = (theme) => ({
  display: "flex",
  alignItems: "center",
  gap: "22px",
  [theme.breakpoints.down("sm")]: {
    "& .MuiInputBase-root": {
      height: "50px",
    },
  },
  [theme.breakpoints.down("xs")]: {
    gap: "14px",
    "& .MuiInputBase-root": {
      height: "unset",
    },
  },
});

const dateStyle = {
  width: "180px",
  "& .MuiPickersDay-day": {
    fontSize: "16px!important",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px!important",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px!important",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "16px!important",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px!important",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px!important",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "16px!important",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px!important",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px!important",
    },
  },
  [theme.breakpoints.down("sm")]: {
    width: "130px",
  },
};

const filterButton = (theme) => ({
  fontSize: "12px",
  padding: "14px 0",
  width: "160px",
  textTransform: "unset",
  [theme.breakpoints.down("xs")]: {
    padding: "8px",
    width: "110px",
  },
});

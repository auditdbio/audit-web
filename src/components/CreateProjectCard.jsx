import React, { useState } from "react";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import theme, { radiusOfComponents } from "../styles/themes.js";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom/dist";
import TagsArray from "./tagsArray/index.jsx";
import { Form, Formik } from "formik";
import SimpleField from "./forms/fields/simple-field.jsx";
import DescriptionField from "./forms/create-project/DescriptionField.jsx";
import IconField from "./forms/fields/array-field.jsx";
import { Links } from "./custom/Links.jsx";
import { useFormik } from "formik";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const CreateProjectCard = ({ role }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const initialValues = {
    name: "",
    projectLink: "project",
    fileLink: "",
    description: "desc",
    tags: "tag",
  };
  const [links, setLinks] = useState([]);

  const [tags, setTags] = useState([]);

  const handleAddLink = (newLink) => {
    setLinks([...links, newLink]);
  };

  const handleDeleteLink = (targetLink) => {
    setLinks(links.filter((link) => link !== targetLink));
  };

  const handleAddTags = (newTag) => {
    setTags([...tags, newTag]);
  };

  const handleDeleteTags = (targetTag) => {
    setTags(tags.filter((tag) => tag !== targetTag));
  };

  return (
    <Box sx={mainBox}>
      {/*<Button sx={backButtonSx} onClick={() => navigate("/home-customer")}>*/}
      {/*  <ArrowBackIcon />*/}
      {/*</Button>*/}

      <Box sx={buttonGroup}>
        <Button variant={"contained"} sx={inviteButton}>
          Invite auditor
        </Button>
        <Button variant={"contained"} sx={publishButton}>
          Publish project
        </Button>
        <Button sx={menuButtonSx}>
          <MenuRoundedIcon sx={menuButtonIconSx} />
        </Button>
      </Box>

      <Box sx={wrapper}>
        <Formik
          initialValues={initialValues}
          // validationSchema={SigninSchema}
          // validateOnBlur={false}
          // validateOnChange={false}
          onSubmit={(values) => {
            // dispatch(signIn(values))
            console.log(values);
          }}
        >
          {({ handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Box sx={formCard}>
                  <Box sx={formAllFields}>
                    <Box sx={formWrapper}>
                      <Box sx={fieldWrapper}>
                        <SimpleField name={"name"} label={"Name"} />
                        <IconField
                          name={"projectLink"}
                          label={"Project link"}
                          array={links}
                          handleAdd={handleAddLink}
                        />
                        <Links links={links} handleDelete={handleDeleteLink} />
                      </Box>
                      <Box
                        className="description-box"
                        sx={descriptionFieldWrapper}
                      >
                        <DescriptionField
                          name={"description"}
                          label={"Description"}
                        />
                      </Box>
                    </Box>
                    <Box sx={tagsFieldWrapper}>
                      <Box sx={fieldWrapper}>
                        {/*<SimpleField name={"tags"} label={"Tags"} />*/}
                        <IconField
                          name={"projectLink"}
                          label={"Tags"}
                          array={links}
                          handleAdd={handleAddTags}
                        />
                      </Box>
                      <Box sx={tagsArrayWrapper}>
                        <TagsArray
                          tags={tags}
                          handleDelete={handleDeleteTags}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    type={"submit"}
                    variant={"contained"}
                    sx={submitButton}
                  >
                    Create
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
};
export default CreateProjectCard;

const mainBox = (theme) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  paddingTop: "43px",
  [theme.breakpoints.down("xs")]: {
    paddingTop: "30x",
  },
});

const backButtonSx = (theme) => ({
  position: "absolute",
  left: "30px",
  top: "40px",
  [theme.breakpoints.down("sm")]: {
    top: "5px",
  },
});

const menuButtonSx = (theme) => ({
  color: "#222222",
  padding: "0",
  minWidth: "0",
});

const menuButtonIconSx = (theme) => ({
  fontSize: "2rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
});

const wrapper = (theme) => ({
  padding: "70px 90px",
  display: "flex",
  flexDirection: "column",
  gap: "70px",
  [theme.breakpoints.down("md")]: {
    gap: "50px",
  },
  [theme.breakpoints.down("sm")]: {
    gap: "20px",
    padding: "40px 30px",
  },
  [theme.breakpoints.down("xs")]: {
    width: "100%",
    alignItems: "center",
    gap: "25px",
  },
});

const buttonGroup = {
  // width: "100%",
  display: "flex",
  alignSelf: "center",
  gap: "15px",
  [theme.breakpoints.down("sm")]: {
    gap: "10px",
  },
};

const inviteButton = {
  backgroundColor: theme.palette.primary.main,
  textTransform: "none",
  boxShadow: "0",
  maxHeight: "30px",
  padding: "8px 42px",
  whiteSpace: "nowrap",
  color: "#FCFAF6",
  fontWeight: "500",
  borderRadius: "4px",
  maxWidth: "180px",
  margin: "0 auto",
  fontSize: "14px",
  // paddingY: "11px",
  ":hover": {
    boxShadow: "0",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "3px 15px",
    fontSize: "10px",
  },
};

const publishButton = {
  backgroundColor: theme.palette.secondary.main,
  textTransform: "none",
  boxShadow: "0",
  maxHeight: "30px",
  padding: "8px 42px",
  whiteSpace: "nowrap",
  color: "#FCFAF6",
  fontWeight: "500",
  borderRadius: "4px",
  maxWidth: "180px",
  margin: "0 auto",
  fontSize: "14px",
  // paddingY: "11px",
  ":hover": {
    boxShadow: "0",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "3px 15px",
    fontSize: "10px",
  },
};

const formCard = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "75px",
};

const infoInnerStyle = (theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const infoStyle = (theme) => ({
  display: "flex",
  margin: "0 0 50px",
  flexDirection: "row",
  gap: "40px",
  [theme.breakpoints.down("md")]: {
    gap: "10px",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "16px",
    margin: 0,
  },
});

const avatarStyle = (theme) => ({
  width: "205px",
  height: "205px",
  [theme.breakpoints.down("xs")]: {
    width: "150px",
    height: "150px",
  },
});

const contentWrapper = (theme) => ({
  display: "flex",
  gap: "70px",
  [theme.breakpoints.down("md")]: {
    gap: "50px",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "40px",
  },
});

const buttonSx = (theme) => ({
  margin: "0 auto",
  display: "block",
  color: theme.palette.background.default,
  textTransform: "capitalize",
  fontWeight: 600,
  fontSize: "18px",
  padding: "9px 50px",
  width: "214px",
  borderRadius: "10px",
  [theme.breakpoints.down("xs")]: {
    width: "88px",
    padding: "9px 10px",
  },
});

const submitAuditor = (theme) => ({
  backgroundColor: theme.palette.secondary.main,
  "&:hover": {
    backgroundColor: "#450e5d",
  },
});

const infoWrapper = (theme) => ({
  display: "flex",
  fontWeight: 500,
  color: "#434242",
  "& p": {
    fontSize: "inherit",
  },
  "& span": {
    width: "125px",
    marginRight: "50px",
    color: "#B2B3B3",
  },
  fontSize: "15px",
  [theme.breakpoints.down("md")]: {
    "& span": {
      width: "90px",
      marginRight: "20px",
    },
  },
  [theme.breakpoints.down("xs")]: {
    fontSize: "12px",
  },
});

const formWrapper = (theme) => ({
  display: "flex",
  height: "100%",
  width: "100%",

  justifyContent: "space-between",
  // gap: "175px",
  [theme.breakpoints.down("xs")]: {
    gap: "60px",
    flexDirection: "column",
  },
});

const submitButton = (theme) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: "0",
  padding: "11px 140px",
  color: "#FCFAF6",
  fontWeight: 600,
  borderRadius: radiusOfComponents,
  maxWidth: "402px",
  margin: "0 auto",
  fontSize: "16px",
  paddingY: "11px",
  ":hover": {
    boxShadow: "0",
  },
  [theme.breakpoints.down("sm")]: {
    width: "225px",
    padding: "13px 80px",
    fontSize: "14px",
  },
});

const fieldWrapper = (theme) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  // maxWidth: "450px",
  width: "40%",
  gap: "20px",
  [theme.breakpoints.down("md")]: {
    "& .MuiInputBase-root": {
      height: "44px",
      "& input": {
        paddingY: "7px",
      },
    },
  },
  [theme.breakpoints.down("sm")]: {
    gap: "16px",
    "& .password-wrapper, .field-wrapper": {
      gap: "16px",
    },
  },
  [theme.breakpoints.down("xs")]: {
    width: "100%",
  },
});
const descriptionFieldWrapper = (theme) => ({
  display: "flex",

  flexDirection: "column",
  // height: "230px",
  // height: '100%',
  width: "40%",
  // justifyContent: 'center',
  // gap: "20px",
  // [theme.breakpoints.down("md")]: {
  //   "& .MuiInputBase-root": {
  //     height: "44px",
  //     "& input": {
  //       paddingY: "7px",
  //     },
  //   },
  // },
  [theme.breakpoints.down("sm")]: {
    gap: "16px",
    "& .password-wrapper, .field-wrapper": {
      gap: "16px",
    },
  },
  [theme.breakpoints.down("xs")]: {
    width: "100%",
  },
});

const tagsFieldWrapper = (theme) => ({
  display: "flex",
  // flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
  gap: "75px",
  [theme.breakpoints.down("md")]: {
    "& .MuiInputBase-root": {
      height: "44px",
      "& input": {
        paddingY: "7px",
      },
    },
    // flexDirection: "column",
  },
  [theme.breakpoints.down("sm")]: {
    gap: "16px",
    "& .password-wrapper, .field-wrapper": {
      gap: "16px",
    },
    flexDirection: "column",
    alignItems: "start",
  },
});

const formAllFields = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const tagsArrayWrapper = {
  width: "40%",
};

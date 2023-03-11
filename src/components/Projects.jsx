import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, useMediaQuery } from "@mui/material";
import ProjectCard from "./Project-card.jsx";
import theme, { radiusOfComponents } from "../styles/themes.js";

import { useNavigate } from "react-router-dom/dist";
import PublicProjectCard from "./homepage/auditors-projects-section/PublicProjectCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects, getProjects } from "../redux/actions/projectAction.js";
import { AUDITOR, CUSTOMER } from "../redux/actions/types.js";
import Loader from "./Loader.jsx";

const Projects = ({ role }) => {
  const navigate = useNavigate();
  const matchMd = useMediaQuery(theme.breakpoints.down("md"));
  const projects = useSelector((state) => state.audits.audits);
  const myProjects = useSelector((state) => state.project.myProjects);

  const dispatch = useDispatch();
  const matchSm = useMediaQuery(theme.breakpoints.down("xs"));
  const projectReducer = useMemo(() => {
    if (role === AUDITOR) {
      return projects;
    } else {
      return myProjects;
    }
  }, [role, projects, myProjects]);

  useEffect(() => {
    dispatch(getProjects());
  }, []);

  const handleNavigate = () => {
    if (role === CUSTOMER) {
      navigate("/create-project");
    } else {
      navigate("/projects");
    }
  };

  if (!projectReducer) {
    return <Loader role={role} />;
  } else {
    return (
      <Box sx={wrapper}>
        <Box sx={buttonWrapper}>
          <Button
            sx={[buttonSx, role === "auditor" ? buttonAuditorSx : {}]}
            variant={"contained"}
            onClick={handleNavigate}
          >
            {role === "auditor" ? "+ New audit" : "+ New project"}
          </Button>
        </Box>
        <Grid container spacing={2}>
          {projectReducer?.map((project) => (
            <Grid key={project.id} item sx={gridItemStyle}>
              <ProjectCard project={project} type={role} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
};

export default Projects;

const buttonWrapper = (theme) => ({
  display: "flex",
  justifyContent: "center",
  mb: "46px",
  [theme.breakpoints.down("sm")]: {
    mb: "28px",
  },
});

const wrapper = (theme) => ({
  padding: "58px 52px 42px",
  width: "100%",
  alignSelf: "baseline",
  [theme.breakpoints.down("md")]: {
    padding: "45px 40px 33px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "36px 25px 45px",
  },
});

const gridItemStyle = (theme) => ({
  width: "25%",
  [theme.breakpoints.down("sm")]: {
    width: "33.330%",
  },
  [theme.breakpoints.down("xs")]: {
    width: "100%",
  },
});

const buttonSx = (theme) => ({
  padding: "9px 35px",
  borderRadius: "10px",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "30px",
  textTransform: "none",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    width: "161px",
    padding: "11px 25px",
    height: "40px",
  },
});

const buttonAuditorSx = (theme) => ({
  backgroundColor: theme.palette.secondary.main,
  "&:hover": {
    backgroundColor: "#450e5d",
  },
});

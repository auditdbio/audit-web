import React, { useState } from "react";
import Layout from "../styles/Layout.jsx";
import { Box } from "@mui/material";
import Projects from "../components/Projects.jsx";
import Audits from "../components/Audits.jsx";
import CreateProjectCard from "../components/CreateProjectCard.jsx";
import { CustomCard } from "../components/custom/Card.jsx";
import { useLocation } from "react-router-dom";

const EditProject = () => {
  const location = useLocation();
  const { project } = location.state;

  return (
    <Layout>
      <Box sx={wrapper}>
        <CustomCard>
          <CreateProjectCard projectInfo={project} />
        </CustomCard>
      </Box>
    </Layout>
  );
};

export default EditProject;

const tabs = [
  {
    value: "audits",
    label: "Audits",
  },
  {
    value: "projects",
    label: "Projects",
  },
  {
    value: "user-info",
    label: "User info",
  },
];

const wrapper = (theme) => ({
  display: "flex",
  flexDirection: "column",
  maxWidth: "1300px",
  width: "100%",
});

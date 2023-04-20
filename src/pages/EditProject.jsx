import React, { useState } from "react";
import Layout from "../styles/Layout.jsx";
import { Box } from "@mui/material";
import Projects from "../components/Projects.jsx";
import Audits from "../components/Audits.jsx";
import CreateProjectCard from "../components/CreateProjectCard.jsx";
import { CustomCard } from "../components/custom/Card.jsx";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import Loader from "../components/Loader.jsx";

const EditProject = () => {
  const projectId = useParams();
  const project = useSelector((s) => s.project?.myProjects?.find((p) => p.id === projectId.id));

    return (
      <Layout>
        <Box sx={wrapper}>
          { !project ? <Box sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              >
                <Loader/>
              </Box> :
            <CustomCard>
              <CreateProjectCard projectInfo={project} />
            </CustomCard>
          }
        </Box>
      </Layout>
    );
  }

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
  height: '100%'
});

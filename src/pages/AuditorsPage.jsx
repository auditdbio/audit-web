import React, { useEffect } from "react";
import Layout from "../styles/Layout.jsx";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";
import Filter from "../components/forms/filter/index.jsx";
import ProjectListCard from "../components/Project-list-card.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom/dist";
import AuditorListCard from "../components/AuditorListCard.jsx";
import { getAuditors } from "../redux/actions/auditorAction.js";

const AuditorsPage = () => {
  const dispatch = useDispatch();
  const projects = useSelector((s) => s.project.projects);
  const navigate = useNavigate();

  const auditorReducer = useSelector((state) => state.auditor);

  // const projects = useSelector(s => s.project.projects)

  return (
    <Layout>
      <Box sx={wrapper}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={() => navigate(-1)}>
            <ArrowBackIcon color={"secondary"} />
          </Button>
          <Box>
            <Filter />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            paddingY: "70px",
            height: "100%",
            overflow: "scroll",
          }}
        >
          {/*{auditorReducer.auditors?.map((auditor) => (*/}
          {/*  <Box sx={{ width: "50%" }} key={auditor.user_id}>*/}
          {/*    <AuditorListCard auditor={auditor} />*/}
          {/*  </Box>*/}
          {/*))}*/}

          <Box sx={{ width: "50%" }}>
            <AuditorListCard />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default AuditorsPage;

const wrapper = (theme) => ({
  width: "100%",
  padding: "43px 20px 44px 32px",
  backgroundColor: "#FCFAF6",
  border: "1.42857px solid #D9D9D9",
  boxShadow:
    "0px 71.4286px 57.1429px rgba(0, 0, 0, 0.07)," +
    " 0px 29.8412px 23.8729px rgba(0, 0, 0, 0.0503198), " +
    "0px 15.9545px 12.7636px rgba(0, 0, 0, 0.0417275), " +
    "0px 8.94397px 7.15517px rgba(0, 0, 0, 0.035), " +
    "0px 4.75007px 3.80006px rgba(0, 0, 0, 0.0282725), " +
    "0px 1.97661px 1.58129px rgba(0, 0, 0, 0.0196802)",
  borderRadius: "10.7143px",
  height: "1300px",
});

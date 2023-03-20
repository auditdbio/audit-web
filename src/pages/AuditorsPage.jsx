import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate();

  const auditorReducer = useSelector((state) => state.auditor);

  // useEffect(() => {
  //   dispatch(getAuditors(""));
  // }, []);

  return (
    <Layout>
      <Box sx={wrapper}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={() => navigate(-1)}>
            <ArrowBackIcon color={"secondary"} />
          </Button>
          <Box>
            <Filter target={"auditor"} />
          </Box>
        </Box>
        {auditorReducer.auditors?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: "70px",
              // paddingTop: '70px',
              // height: "98%",
              // overflow: "scroll",
              border: "0.5px solid #B2B3B3",
            }}
          >
            {auditorReducer.auditors?.map((auditor) => (
              <Box sx={auditorContainerStyle} key={auditor.user_id}>
                <AuditorListCard auditor={auditor} />
              </Box>
            ))}
          </Box>
        )}
        {auditorReducer.auditors?.length === 0 && (
            <Box
                sx={{
                  paddingTop: '70px',
                  display: "flex",
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
            >
              No results
            </Box>
        )}
      </Box>
    </Layout>
  );
};

export default AuditorsPage;

const wrapper = (theme) => ({
  width: "100%",
  padding: "43px 20px 44px 20px",
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
  // height: "1300px",
  minHeight: "1000px",
});

const auditorContainerStyle = {
  width: {
    zero: "100%",
    sm: "50%",
    md: "50%",
    lg: "50%",
  },
};

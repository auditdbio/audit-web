import React, { useEffect, useState } from "react";
import Layout from "../styles/Layout.jsx";
import { Box, Button, useMediaQuery } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";
import Filter from "../components/forms/filter/index.jsx";
import ProjectListCard from "../components/Project-list-card.jsx";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom/dist";
import AuditorListCard from "../components/AuditorListCard.jsx";
import {getAuditors, searchAuditor} from "../redux/actions/auditorAction.js";
import theme from "../styles/themes.js";
import {searchProjects} from "../redux/actions/projectAction.js";

const AuditorsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(undefined)
  const [projectIdToInvite, setProjectIdToInvite] = useState(() => searchParams.get('projectIdToInvite'))
  const auditorReducer = useSelector((state) => state.auditor.auditors);
  const applyFilter = (filter) => {
    setQuery((query) => {
      const {...data} = (query || {})
      return {
        ...data,

        sort: filter.sort || '',
        search: filter.search || '',
        tags: filter.tags.map((tag) => tag),
        dateFrom: filter.dateFrom || '',
        dateTo: filter.dateTo || '',
        from: filter.price.from || '',
        to: filter.price.to || '',
        readyToWait: filter.readyToWait || '',
      }
    })
    dispatch(searchAuditor(filter))
  }

  const initialFilter = {
    search: searchParams.get('search') || '',
    tags: searchParams.getAll('tags') || [],
    dateFrom: searchParams.get('dateFrom') || new Date(),
    dateTo: searchParams.get('dateTo') || new Date(),
    sort: searchParams.get('sort') || '',
    readyToWait: searchParams.get('readyToWait') || '',
    price: {
      from: searchParams.get('from') || 0,
      to: searchParams.get('to') || 0
    },
  }

  const clearFilter = () => {
    setQuery((query) => {
      const { ...data } = (query || {})
      return {}
    })
  }

  useEffect(() => {
    if (query) {
      setSearchParams({...query})
    }
  }, [query]);

  useEffect(() => {
    dispatch(searchAuditor(initialFilter));
  }, [searchParams.toString()]);

  return (
    <Layout>
      <Box sx={wrapper}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={() => navigate(-1)}>
            <ArrowBackIcon color={"secondary"} />
          </Button>
          <Box>
            <Filter target={"auditor"} submit={applyFilter} initial={initialFilter}/>
          </Box>
        </Box>
        {auditorReducer?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: "70px",
              border: "0.5px solid #B2B3B3",
            }}
          >
            {auditorReducer?.map((auditor) => (
              <Box sx={auditorContainerStyle} key={auditor.user_id}>
                <AuditorListCard auditor={auditor} projectIdToInvite={projectIdToInvite} />
              </Box>
            ))}
            {!matchSm && auditorReducer?.length % 2 === 1 && (
              <Box sx={fakeContainerStyle}/>
            )}
          </Box>
        )}
        {auditorReducer?.length === 0 && (
          <Box
            sx={{
              paddingTop: "70px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
  minHeight: "1000px",
});

const auditorContainerStyle = (theme) => ({
  height: '200px',
  width: {
    zero: "100%",
    sm: "50%",
    md: "50%",
    lg: "50%",
  },
  [theme.breakpoints.down('xs')]: {
    height: '130px'
  }
});

const fakeContainerStyle = {
  width: {
    zero: "100%",
    sm: "50%",
    md: "50%",
    lg: "50%",
  },
  border: "0.5px solid #B2B3B3",
};

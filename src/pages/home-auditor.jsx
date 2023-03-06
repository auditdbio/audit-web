import React, {useEffect, useState} from 'react';
import {Box} from "@mui/material";
import CustomTabs from "../components/custom/CustomTabs.jsx";
import InfoCard from "../components/custom/info-card.jsx";
import UserInfo from "../components/User-info.jsx";
import Projects from "../components/Projects.jsx";
import Layout from "../styles/Layout.jsx";
import AuditRequest from "../components/Audit-request.jsx";
import {getCustomer} from "../redux/actions/customerAction.js";
import {getAuditor} from "../redux/actions/auditorAction.js";
import {useDispatch, useSelector} from "react-redux";

const HomeAuditor = () => {
    const [chooseTab, setChooseTab] = useState(tabs[0].value)
    const dispatch = useDispatch()
    const userRole = useSelector(s => s.auditor.auditor)

    useEffect(() => {
            dispatch(getAuditor())
    },[])
    return (
        <Layout>
            <Box sx={wrapper}>
                <CustomTabs
                    selectedTabSx={selectedTabSx}
                    name={'type'}
                    tabs={tabs}
                    setTab={setChooseTab}
                />
                <InfoCard role={'auditor'}>
                    {chooseTab === 'audit-requests' && <AuditRequest/>}
                    {chooseTab === 'user-info' && <UserInfo role={'auditor'}/>}
                    {chooseTab === 'audits' && <Projects role={'auditor'}/>}
                </InfoCard>
            </Box>
        </Layout>
    );
};

export default HomeAuditor;

const tabs = [
    {
        value: 'audits',
        label: 'Audits',
    },
    {
        value: 'audit-requests',
        label: 'Audit requests'
    },
    {
        value: 'user-info',
        label: 'User info'
    }
]

const wrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1300px',
    width: '100%'
})

const selectedTabSx = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    color: '#FCFAF6!important'
})
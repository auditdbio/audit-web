import React, {useEffect, useState} from 'react';
import Layout from "../styles/Layout.jsx";
import {Box, Tab, Tabs} from "@mui/material";
import CustomTabs from "../components/custom/CustomTabs.jsx";
import InfoCard from "../components/custom/info-card.jsx";
import UserInfo from "../components/User-info.jsx";
import Projects from "../components/Projects.jsx";
import Audits from "../components/Audits.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getCustomer} from "../redux/actions/customerAction.js";
import {getAuditor} from "../redux/actions/auditorAction.js";
import {AUDITOR} from "../redux/actions/types.js";
import AuditRequest from "../components/Audit-request.jsx";
import {useParams} from "react-router-dom";

const ProfilePage = () => {
    const {tab} = useParams()
    const [chooseTab, setChooseTab] = useState(tab)
    const currentRole = useSelector(s => s.user.user.current_role)
    return (
        <Layout>
            <Box sx={wrapper}>
                <CustomTabs
                    selectedTabSx={currentRole === AUDITOR ? auditorTabSx : customerTabSx}
                    name={'type'}
                    choosenTab={chooseTab}
                    tabs={currentRole === AUDITOR ? auditorTabs : customerTabs}
                    setTab={setChooseTab}
                />
                <InfoCard role={currentRole}>
                    {chooseTab === 'audits' && <Audits />}
                    {chooseTab === 'user-info' && <UserInfo role={currentRole} />}
                    {chooseTab === 'projects' && <Projects role={currentRole} />}
                    {chooseTab === 'audit-requests' && <AuditRequest/>}
                </InfoCard>
            </Box>
        </Layout>
    );
};

export default ProfilePage;

const auditorTabs = [
    {
        value: 'projects',
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

const customerTabs = [
    {
        value: 'audits',
        label: 'Audits',
    },
    {
        value: 'projects',
        label: 'Projects'
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
    minHeight: '560px',
    width: '100%'
})

const customerTabSx = (theme) => ({
    backgroundColor: theme.palette.primary.main,
    color: '#FCFAF6!important'
})

const auditorTabSx = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    color: '#FCFAF6!important'
})
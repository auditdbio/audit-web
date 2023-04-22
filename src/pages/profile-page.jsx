import React, {useEffect, useState} from 'react';
import Layout from "../styles/Layout.jsx";
import {Alert, AlertTitle, Box, Snackbar, Stack, Tab, Tabs} from "@mui/material";
import CustomTabs from "../components/custom/CustomTabs.jsx";
import InfoCard from "../components/custom/info-card.jsx";
import UserInfo from "../components/User-info.jsx";
import Projects from "../components/Projects.jsx";
import Audits from "../components/Audits.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getCustomer} from "../redux/actions/customerAction.js";
import {getAuditor} from "../redux/actions/auditorAction.js";
import {AUDITOR, CUSTOMER} from "../redux/actions/types.js";
import AuditRequest from "../components/Audit-request.jsx";
import {useParams} from "react-router-dom";
import {clearUserSuccess} from "../redux/actions/userAction.js";

const ProfilePage = () => {
    const {tab} = useParams()
    const [chooseTab, setChooseTab] = useState(tab)
    const currentRole = useSelector(s => s.user.user.current_role)
    const message = useSelector(s => s.user.success)
    const dispatch = useDispatch()

    useEffect(() => {
        setChooseTab(tab)
    }, [tab, chooseTab])
    return (
        <Layout>
            <Snackbar
                autoHideDuration={3000}
                open={!!message}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                onClose={() => dispatch(clearUserSuccess())}
            >
                <Stack sx={{ width: '100%', flexDirection: 'column', gap: 2 }} spacing={2}>
                    <Alert severity='success'>
                        <AlertTitle>{message}</AlertTitle>
                    </Alert>
                </Stack>
            </Snackbar>
            <Box sx={wrapper}>
                <CustomTabs
                    selectedTabSx={currentRole === AUDITOR ? auditorTabSx : customerTabSx}
                    name={'type'}
                    choosenTab={chooseTab}
                    tabs={currentRole === AUDITOR ? auditorTabs : customerTabs}
                    setTab={setChooseTab}
                />
                <InfoCard role={currentRole}>
                    {(chooseTab === 'audits' && currentRole === CUSTOMER) && <Audits />}
                    {chooseTab === 'user-info' && <UserInfo role={currentRole} />}
                    {chooseTab === 'projects' && <Projects role={currentRole} />}
                    {(chooseTab === 'audits' && currentRole === AUDITOR) && <AuditRequest/>}
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
        value: 'audits',
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
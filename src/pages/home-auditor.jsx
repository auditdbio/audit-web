import React, {useState} from 'react';
import {Box} from "@mui/material";
import CustomTabs from "../components/custom/CustomTabs.jsx";
import InfoCard from "../components/custom/info-card.jsx";
import UserInfo from "../components/User-info.jsx";
import Projects from "../components/Projects.jsx";
import Layout from "../styles/Layout.jsx";

const HomeAuditor = () => {
    const [chooseTab, setChooseTab] = useState(tabs[0].value)
    return (
        <Layout>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CustomTabs
                    selectedTabSx={selectedTabSx}
                    name={'type'}
                    tabs={tabs}
                    setTab={setChooseTab}
                />
                <InfoCard role={'auditor'}>
                    {chooseTab === 'audit requests' && <h2>Audit requests</h2>}
                    {chooseTab === 'user-info' && <UserInfo role={'auditor'} />}
                    {chooseTab === 'audits' && <Projects role={'auditor'} />}
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
        value: 'audit requests',
        label: 'Audit requests'
    },
    {
        value: 'user-info',
        label: 'User info'
    }
]

const selectedTabSx = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    color: '#FCFAF6!important'
})
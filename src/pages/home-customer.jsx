import React, {useState} from 'react';
import Layout from "../styles/Layout.jsx";
import {Box, Tab, Tabs} from "@mui/material";
import CustomTabs from "../components/custom/CustomTabs.jsx";
import InfoCard from "../components/custom/info-card.jsx";
import UserInfo from "../components/User-info.jsx";
import Projects from "../components/Projects.jsx";

const HomeCustomer = () => {
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
                <InfoCard>
                    {chooseTab === 'audits' && <h2>Audits</h2>}
                    {chooseTab === 'user-info' && <UserInfo />}
                    {chooseTab === 'projects' && <Projects />}
                </InfoCard>
            </Box>
        </Layout>
    );
};

export default HomeCustomer;

const tabs = [
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

const selectedTabSx = (theme) => ({
    backgroundColor: theme.palette.primary.main,
    color: '#FCFAF6!important'
})
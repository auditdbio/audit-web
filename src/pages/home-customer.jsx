import React, {useState} from 'react';
import Layout from "../styles/Layout.jsx";
import {Box, Tab, Tabs} from "@mui/material";
import CustomTabs from "../components/custom/CustomTabs.jsx";
import InfoCard from "../components/custom/info-card.jsx";
import UserInfo from "../components/User-info.jsx";
import Projects from "../components/Projects.jsx";
import Audits from "../components/Audits.jsx";

const HomeCustomer = () => {
    const [chooseTab, setChooseTab] = useState(tabs[0].value)

    return (
        <Layout>
            <Box sx={wrapper}>
                <CustomTabs
                    selectedTabSx={selectedTabSx}
                    name={'type'}
                    tabs={tabs}
                    setTab={setChooseTab}
                />
                <InfoCard>
                    {chooseTab === 'audits' && <Audits />}
                    {chooseTab === 'user-info' && <UserInfo />}
                    {chooseTab === 'projects' && <Projects role={'customer'}/>}
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

const wrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
        maxWidth: '1300px',
        width: '100%'
})

const selectedTabSx = (theme) => ({
    backgroundColor: theme.palette.primary.main,
    color: '#FCFAF6!important'
})
import React, {useState} from 'react';
import Layout from "../styles/Layout.jsx";
import {Box, Tab, Tabs} from "@mui/material";
import CustomTabs from "../components/custom/CustomTabs.jsx";
import {CustomCard} from "../components/custom/Card";
import theme from "../styles/themes.js";

const HomeCustomer = () => {


    return (
        <Layout>
            <CustomCard sx={wrapper}>
                <CustomTabs
                    tabs={tabs}
                    selectedTabSx={selectedTabSx}
                />

            </CustomCard>
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
    borderRadius: '0px 0px 15px 15px',
    border: '8px solid orange'
})

const selectedTabSx = (theme) => ({
    backgroundColor: theme.palette.primary.main,
    color: '#FCFAF6!important'
})
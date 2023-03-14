import React from 'react';
import Layout from "../styles/Layout.jsx";
import {Box, Typography} from "@mui/material";
import {CustomCard} from "../components/custom/Card.jsx";

const ForCustomer = () => {
    return (
        <Layout>
            <CustomCard sx={wrapper}>
                <Typography variant={'h3'}>
                    For customers
                </Typography>
                <Typography>
                    When you're about to release your project into the wild, don't overlook the importance of getting an
                    audit. This critical step could mean the difference between success and failure. We also recommend
                    having a code audit for each new update release to ensure your project stays on top.
                </Typography>
                <Typography>
                    A high-quality audit exposes all the weak points in your code and provides expert advice on
                    enhancing it. To ensure the best possible audit experience, here are some pro tips:
                </Typography>
                <ul>
                    <li>Have all your GitHub repository links ready to go for the audit</li>
                    <li>Provide a detailed project description to ensure auditors get your goals and potential risks.
                    </li>
                    <li>Use relevant hashtags for your project on our platform to find an auditor familiar with your
                        project's tech scope.
                    </li>
                    <li>Don't hesitate to hire multiple independent auditors for your project to ensure maximum security
                        and safety for your code.
                    </li>
                </ul>
                <Typography>
                    Following these steps guarantees optimal results from your audits. So, get your project assessed by
                    an auditor today and be confident in your code's reliability.
                </Typography>
            </CustomCard>
        </Layout>
    );
};

export default ForCustomer;

const wrapper = (theme) => ({
    padding: '40px',
    '& h3': {
        fontSize: '28px',
        fontWeight: 600
    },
    '& ul':{
        fontSize: '22px',
        paddingLeft: '30px'
    },
    '& p': {
        fontSize: '22px',
        marginY: '22px',
        '&:nth-of-type(2)':{
            marginBottom: '10px'
        }
    },
    [theme.breakpoints.down('md')]:{
        '& p': {
            fontSize: '18px',
        },
        '& h3': {
            fontSize: '22px',
        },
        '& ul':{
            fontSize: '18px',
        },
    },
    [theme.breakpoints.down('xs')]:{
        '& p': {
            fontSize: '16px',
        },
        // '& h3': {
        //     fontSize: '22px',
        // },
        '& ul':{
            fontSize: '16px',
            paddingLeft: '16px'
        },
    }
})
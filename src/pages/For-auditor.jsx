import React from 'react';
import Layout from "../styles/Layout.jsx";
import {Typography} from "@mui/material";
import {CustomCard} from "../components/custom/Card.jsx";

const ForAuditor = () => {
    return (
        <Layout>
            <CustomCard sx={wrapper}>
                <Typography variant={'h3'}>
                    For auditors
                </Typography>
                <Typography>
                    We're here to help you develop your career as an auditor. Whether you're just starting out or
                    looking to take your career to the next level, we're ready to provide you with the support you need.
                </Typography>
                <Typography>
                    One of the critical features of our platform is the ability to connect you with potential customers.
                    By leveraging our network, you can find new opportunities to grow your business and take on exciting
                    new projects.
                </Typography>
                <Typography>
                    Our platform allows you to connect with potential customers, expanding your business opportunities.
                    In the near future, we'll be launching an audit constructor, a rating system, and other instruments
                    to help you enhance your professional development.
                </Typography>
                <Typography>
                    Success in the audits field depends on staying ahead of the curve. Keep in mind these pro tips:
                </Typography>
                <ul>
                    <li>Stay aware of crypto winter and crypto summer. Make sure to offer different conditions depending
                        on the crypto season and find projects that can provide stability.
                    </li>
                    <li>Look for projects that offer more than just financial gains, but also provide opportunities for
                        you to level up your skills and broaden your knowledge.
                    </li>
                    <li>Keep yourself up-to-date on the latest security trends and findings. This will not only allow
                        you to provide the best service possible to your clients but also establish yourself as a
                        trustworthy expert in the field.
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

export default ForAuditor;

const wrapper = (theme) => ({
    padding: '40px',
    '& h3': {
        fontSize: '28px',
        fontWeight: 600
    },
    '& ul': {
        fontSize: '22px',
        paddingLeft: '30px'
    },
    '& p': {
        fontSize: '22px',
        marginY: '22px',
        '&:nth-of-type(2)': {
            marginBottom: '10px'
        }
    },
    [theme.breakpoints.down('md')]: {
        '& p': {
            fontSize: '18px',
        },
        '& h3': {
            fontSize: '22px',
        },
        '& ul': {
            fontSize: '18px',
        },
    },
    [theme.breakpoints.down('xs')]: {
        '& p': {
            fontSize: '16px',
        },
        // '& h3': {
        //     fontSize: '22px',
        // },
        '& ul': {
            fontSize: '16px',
            paddingLeft: '16px'
        },
    }
})
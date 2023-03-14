import React from 'react';
import Layout from "../styles/Layout.jsx";
import {Typography} from "@mui/material";
import {CustomCard} from "../components/custom/Card.jsx";

const Faq = () => {
    return (
        <Layout>
            <CustomCard sx={wrapper}>
                <Typography variant={'h3'}>
                    F.A.Q
                </Typography>
                {/*<Typography>*/}
                {/*    We're here to help you develop your career as an auditor. Whether you're just starting out or*/}
                {/*    looking to take your career to the next level, we're ready to provide you with the support you need.*/}
                {/*</Typography>*/}
                {/*<Typography>*/}
                {/*    One of the critical features of our platform is the ability to connect you with potential customers.*/}
                {/*    By leveraging our network, you can find new opportunities to grow your business and take on exciting*/}
                {/*    new projects.*/}
                {/*</Typography>*/}
                {/*<Typography>*/}
                {/*    Our platform allows you to connect with potential customers, expanding your business opportunities.*/}
                {/*    In the near future, we'll be launching an audit constructor, a rating system, and other instruments*/}
                {/*    to help you enhance your professional development.*/}
                {/*</Typography>*/}
                {/*<Typography>*/}
                {/*    Success in the audits field depends on staying ahead of the curve. Keep in mind these pro tips:*/}
                {/*</Typography>*/}
                <ol>
                    <li>What is the process for submitting a smart contract for auditing on this platform?</li>
                    <Typography variant={'caption'}>
                        To submit a smart contract for auditing on this platform, you need to include the Github links
                        in your project description on your account.
                    </Typography>
                    <li>How are the results of the audit communicated to the customer, and what information is included
                        in the report?
                    </li>
                    <Typography variant={'caption'}>
                        Just for now auditor and customer could set up price and time frame of audit on our platform.
                        Auditor attaches audit report when the job is done
                    </Typography>
                    <li> What measures are in place to address any disputes or disagreements between the auditor and the
                        customer during the audit process?
                    </li>
                    <Typography variant={'caption'}>
                        To address disputes or disagreements during the audit process, our platform strictly fixes the
                        price and time frame before starting the audit. Additionally, we are developing a smart contract
                        audit constructor to prevent any future disputes.
                    </Typography>
                    <li> What is the purpose of the platform for smart contract auditors and their customers?
                    </li>
                    <Typography variant={'caption'}>
                        The platform's purpose is to provide a more transparent and accessible market for smart contract
                        auditors and their customers. Our platform enables customers to easily find auditors with the
                        necessary technical expertise, and auditors can easily find new customers.
                    </Typography>
                    <li> What types of reports are provided to customers after a smart contract audit is completed?
                    </li>
                    <Typography variant={'caption'}>
                        Currently, auditors attach a report file, usually in PDF format, to the audit on our platform.
                        In the near future, our smart contract audit constructor will be able to generate reports
                        automatically. The report includes details on any vulnerabilities found, recommendations for
                        improvements, and an overall evaluation of the contract's security.
                    </Typography>
                </ol>
                {/*<Typography>*/}
                {/*    Following these steps guarantees optimal results from your audits. So, get your project assessed by*/}
                {/*    an auditor today and be confident in your code's reliability.*/}
                {/*</Typography>*/}
            </CustomCard>
        </Layout>
    );
};

export default Faq;

const wrapper = (theme) => ({
    padding: '40px',
    '& h3': {
        fontSize: '28px',
        fontWeight: 600,
        marginBottom: '18px'
    },
    '& ol': {
        fontSize: '22px',
        paddingLeft: '30px'
    },
    '& span': {
        fontSize: '22px',
        lineHeight: 'unset',
        marginTop: '7px',
        marginBottom: '15px',
        display: 'block'
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
        '& span': {
            fontSize: '18px',
            marginTop: '7px',
            marginBottom: '12px'
        },
        '& h3': {
            fontSize: '22px',
        },
        '& ol': {
            fontSize: '18px',
        },
    },
    [theme.breakpoints.down('xs')]: {
        '& p': {
            fontSize: '16px',
        },
        '& span': {
            fontSize: '16px',
            marginTop: '5px',
        },
        '& ol': {
            fontSize: '16px',
            paddingLeft: '16px'
        },
    }
})
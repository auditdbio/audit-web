import React from 'react';
import Layout from "../styles/Layout.jsx";
import {Box, Typography} from "@mui/material";
import {CustomCard} from "../components/custom/Card.jsx";

const AuditDb = () => {
    return (
        <Layout>
            <CustomCard sx={wrapper}>
                <Box sx={contentWrapper}>
                    <svg width="424" height="148" viewBox="0 0 424 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M200.827 4.20288H406.62C413.689 4.20288 419.474 9.98413 419.474 17.0501V130.684C419.474 137.75 413.689 143.531 406.62 143.531H200.827C193.757 143.531 187.973 137.75 187.973 130.684V17.0501C187.973 9.98413 193.757 4.20288 200.827 4.20288ZM197.365 0H410.302C417.812 0 423.954 6.13914 423.954 13.6456V134.354C423.954 141.861 417.812 148 410.302 148H197.365C189.846 148 183.704 141.861 183.704 134.354C183.704 95.6292 183.704 56.9132 183.704 18.188V13.6456C183.704 6.13914 189.846 0 197.365 0Z" fill="#47115F"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M392.619 117.938L327.213 78.5426L396.833 25.8507L303.618 85.6086L210.347 25.814L279.572 78.2398L208.484 120.801L285.513 82.2041L303.434 93.4087L321.521 81.6994L392.619 117.938Z" fill="#020202"/>
                        <path d="M315.846 35.6438V36.4163L314.219 37.304V36.105L308.821 32.9921L303.423 29.8793L298.025 32.9921H298.036L292.638 36.105V48.568L293.284 48.9369V50.8162L291 49.5019V35.1711L297.217 31.5856L303.423 28L309.64 31.5856L315.846 35.1711V35.6438ZM315.846 48.1414V49.5019L309.64 53.0874L303.423 56.673L301.058 55.3126L302.639 54.3326L303.423 54.7937L308.821 51.6809L314.219 48.568V47.2883L315.846 48.1414Z" fill="#020202"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M293.974 37.4077L313.099 47.5764L294.205 57.872L293.974 37.4077Z" fill="#47115F"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M317.826 48.3027L306.498 42.2845L317.687 36.1855L317.826 48.3027Z" fill="#FE9900"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M168.867 128.729L110.522 123.535L169.638 117.717C173.898 117.295 174.624 129.243 168.867 128.729Z" fill="#FE9900"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M168.766 80.9469L58.465 76.175L168.537 70.0267C174.863 69.6688 174.596 81.1946 168.766 80.9469Z" fill="#FE9900"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M168.335 30.8151L0 25.0063L168.114 18.4175C174.587 18.0963 174.192 31.0903 168.335 30.8151Z" fill="#FE9900"/>
                    </svg>
                </Box>
                <Box sx={contactWrapper}>
                    <Typography variant={'h3'}>
                        We are happy to answer all your question and get any feedback
                    </Typography>
                    <Typography
                        sx={{
                            border: '3px solid #FF9900',
                            borderRadius: '15px',
                            padding: '15px 85px'
                        }}
                    >
                        hello@auditdb.io
                    </Typography>
                </Box>
            </CustomCard>
        </Layout>
    );
};

export default AuditDb;

const contentWrapper = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        '& svg': {
            width: '350px'
        }
    }
})

const contactWrapper = (theme) => ({
    flexDirection: 'column',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    }
})

const wrapper = (theme) => ({
    padding: '40px',
    display: 'flex',
    gap: '25px',
    '& h3': {
        fontSize: '26px',
        fontWeight: 600,
        textAlign: 'center',
        width: '460px'
    },
    '& p': {
        fontSize: '22px',
        marginTop: '48px',
    },
    [theme.breakpoints.down('md')]: {
        minHeight: '500px',
        '& p': {
            fontSize: '18px',
        },
        '& h3': {
            fontSize: '22px',
        },
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& h3': {
            width: 'unset'
        }
    },
    [theme.breakpoints.down('xs')]: {
        '& p': {
            fontSize: '16px',
        },
    }
})
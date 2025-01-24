import React from 'react';
import Layout from '../styles/Layout.jsx';
import { Typography } from '@mui/material';
import { CustomCard } from '../components/custom/Card.jsx';
import Headings from '../router/Headings.jsx';

const Faq = () => {
  return (
    <Layout>
      <Headings title="FAQ" />

      <CustomCard sx={wrapper}>
        <Typography variant="h3">F.A.Q</Typography>
        <ol>
          <li>
            What is the process for submitting a smart contract for auditing on
            this platform?
          </li>
          <Typography variant="caption">
            To submit a smart contract for auditing on this platform, you need
            to include the Github links in your project description on your
            account.
          </Typography>
          <li>
            How are the results of the audit communicated to the customer, and
            what information is included in the report?
          </li>
          <Typography variant="caption">
            Just for now auditor and customer could set up price and time frame
            of audit on our platform. Auditor attaches audit report when the job
            is done
          </Typography>
          <li>
            What measures are in place to address any disputes or disagreements
            between the auditor and the customer during the audit process?
          </li>
          <Typography variant="caption">
            To address disputes or disagreements during the audit process, our
            platform strictly fixes the price and time frame before starting the
            audit. Additionally, we are developing a smart contract audit
            constructor to prevent any future disputes.
          </Typography>
          <li>
            What is the purpose of the platform for smart contract auditors and
            their customers?
          </li>
          <Typography variant="caption">
            The platform's purpose is to provide a more transparent and
            accessible market for smart contract auditors and their customers.
            Our platform enables customers to easily find auditors with the
            necessary technical expertise, and auditors can easily find new
            customers.
          </Typography>
          <li>
            What types of reports are provided to customers after a smart
            contract audit is completed?
          </li>
          <Typography variant="caption">
            Currently, auditors attach a report file, usually in PDF format, to
            the audit on our platform. In the near future, our smart contract
            audit constructor will be able to generate reports automatically.
            The report includes details on any vulnerabilities found,
            recommendations for improvements, and an overall evaluation of the
            contract's security.
          </Typography>
        </ol>
      </CustomCard>
    </Layout>
  );
};

export default Faq;

const wrapper = theme => ({
  padding: '40px',
  '& h3': {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '18px',
  },
  '& ol': {
    fontSize: '16px',
    paddingLeft: '30px',
  },
  '& span': {
    fontSize: '16px',
    lineHeight: 'unset',
    marginTop: '7px',
    marginBottom: '15px',
    display: 'block',
  },
  '& p': {
    fontSize: '16px',
    marginY: '22px',
    '&:nth-of-type(2)': {
      marginBottom: '10px',
    },
  },
  '& li': {
    fontWeight: 500,
  },
  [theme.breakpoints.down('md')]: {
    '& span': {
      marginTop: '7px',
      marginBottom: '12px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    '& p': {
      fontSize: '14px',
    },
    '& span': {
      fontSize: '14px',
      marginTop: '5px',
    },
    '& ol': {
      fontSize: '14px',
      paddingLeft: '16px',
    },
  },
});

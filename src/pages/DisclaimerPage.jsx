import React from 'react';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { Typography, Box } from '@mui/material';
import { CustomButton } from '../components/custom/Button.jsx';
import { useNavigate } from 'react-router-dom';
import Headings from '../router/Headings.jsx';

const DisclaimerPage = () => {
  const navigate = useNavigate();
  const report = JSON.parse(localStorage.getItem('report') || '{}');
  const auditId = report.auditId ? report.auditId : Date.now();

  return (
    <Layout>
      <Headings title="Disclaimer" />

      <CustomCard sx={wrapperSx}>
        <Typography variant={'h5'}>
          <strong>
            You've accessed this page through a QR code included in one of the
            smart contract audit reports created with the instruments on our
            platform. This QR code is a unique feature of AuditDB.io, leading
            you directly to the profile of the auditor who conducted your smart
            contract review. You see this page because this report was created
            by an unregistered platform user. For registered users QR code on
            the report leads directly to auditor profile on auditdb.io
          </strong>
        </Typography>
        <CustomButton
          sx={[gitCoinSx, { color: '#fff' }]}
          onClick={() => {
            console.log(123);
            navigate(`/audit-builder/${auditId}`);
          }}
        >
          Try audit builder
        </CustomButton>
        <Box>
          <Typography sx={{ marginBottom: '10px' }}>
            <strong>Registered Users get the following benefits:</strong>
          </Typography>
          <ul>
            <li>
              Explore Auditor Profiles: Delve into detailed profiles of our
              auditors. Understand their expertise, experience, and past
              projects. This transparency ensures trust and quality in our
              auditing process.
            </li>
            <li>
              Connect Directly: Engage with auditors for follow-up questions or
              future collaborations. Our platform fosters a community of
              professionals dedicated to enhancing blockchain security.
            </li>
            <li>
              Auditors have access to different instruments, helping optimize
              the work on the audit.
            </li>
          </ul>
        </Box>
        <Box>
          <Typography sx={{ marginBottom: '10px' }}>
            <strong>Not Registered Yet? Join Us Today!</strong>
          </Typography>
          <ul>
            <li>
              For Auditors: Become a part of our network of smart contract
              auditors. Benefit from our state-of-the-art tools that assist in
              creating thorough, efficient audits. Expand your reach by
              showcasing your expertise to a global clientele.
            </li>
            <li>
              For Clients: Secure your smart contracts with top-tier audits.
              Gain access to a diverse pool of auditors and continuous support.
              Joining AuditDB.io ensures your projects adhere to the highest
              standards of security and efficiency.
            </li>
          </ul>
        </Box>
        <Box>
          <Typography sx={{ marginBottom: '10px' }}>
            <strong>Ready to Elevate Your Blockchain Security?</strong>
          </Typography>
          <ul>
            <li>
              Sign Up Now: Whether you’re an auditor looking to showcase your
              skills or a client seeking top-notch auditing services, AuditDB.io
              is your go-to platform.
            </li>
          </ul>
        </Box>
        <Typography>
          <strong>Stay decentralized and join auditdb.io</strong>
        </Typography>
      </CustomCard>
    </Layout>
  );
};

export default DisclaimerPage;

const wrapperSx = theme => ({
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  '& ul': {
    padding: '0 15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '20px',
    '& h5': {
      fontSize: '1.2rem',
    },
  },
  [theme.breakpoints.down('xs')]: {
    '& h5': {
      fontSize: '16px',
    },
  },
});

const gitCoinSx = theme => ({
  backgroundColor: '#44944A',
  maxWidth: '260px',
  margin: '0 auto',
  paddingX: 0,
  '&:hover': {
    backgroundColor: '#326e34!important',
  },
  [theme.breakpoints.down(555)]: {
    maxWidth: '100%',
    fontSize: '18px',
  },
});

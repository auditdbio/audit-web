import React from 'react';
import Layout from '../styles/Layout.jsx';
import { Typography } from '@mui/material';
import { CustomCard } from '../components/custom/Card.jsx';
import Headings from '../router/Headings.jsx';

const AboutContent = () => (
  <>
    <Typography variant="h3">AuditDB</Typography>
    <Typography>
      AuditDB is a revolutionary platform that facilitates the seamless
      connection between web3 auditors and clients seeking their services.
      The platform fills a crucial gap in the market, as there was
      previously no comprehensive, user-friendly solution for auditors and
      customers to transparently engage in the audit process.
    </Typography>
    <Typography>
      We recognize the pivotal role of security and reliability in
      blockchain projects, and our mission is to make the audit market more
      transparent and accessible. At AuditDB, you can utilize various search
      options such as hashtag search, price range search, and deadline
      search to locate precisely what you require. Customers can easily send
      one project to different auditors for several independent audits.
    </Typography>
    <Typography>
      Soon we will offer cutting-edge features such as a smart contract audits
      constructor, auditors rating system, and many other functionalities to
      enhance the audit experience. Keep in touch with us as we continue to
      disrupt the audit market.
    </Typography>
    <Typography>
      Check out this&nbsp;
      <a
        href="https://youtu.be/J7L4yAhS6Rw"
        target="_blank"
        rel="noopener noreferrer"
      >
        screencast
      </a>
      &nbsp;to see AuditDB in action!
    </Typography>
  </>
);

// Выносим стили в отдельный объект
const styles = {
  wrapper: theme => ({
    padding: '40px',
    '& h3': {
      fontSize: '20px',
      fontWeight: 600,
    },
    '& ul': {
      fontSize: '16px',
      paddingLeft: '30px',
    },
    '& p': {
      fontSize: '16px',
      marginY: '22px',
      '&:nth-of-type(2)': {
        marginBottom: '10px',
      },
    },
    [theme.breakpoints.down('xs')]: {
      '& p': {
        fontSize: '14px',
      },
      '& ul': {
        fontSize: '14px',
        paddingLeft: '16px',
      },
    },
  })
};

const AuditDb = () => {
  return (
    <Layout>
      <Headings title="About" />
      <CustomCard sx={styles.wrapper}>
        <AboutContent />
      </CustomCard>
    </Layout>
  );
};

export default AuditDb;

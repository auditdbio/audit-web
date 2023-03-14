import React from "react";
import Layout from "../styles/Layout.jsx";
import { Typography } from "@mui/material";
import { CustomCard } from "../components/custom/Card.jsx";

const AuditDb = () => {
  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Typography variant={"h3"}>AuditDB</Typography>
        <Typography>
          AuditDb is a revolutionary platform that facilitates the seamless
          connection between web3 auditors and clients seeking their services.
          The platform fills a crucial gap in the market, as there was
          previously no comprehensive, user-friendly solution for auditors and
          customers to transparently engage in the audit process.
        </Typography>
        <Typography>
          We recognize the pivotal role of security and reliability in
          blockchain projects, and our mission is to make the audit market more
          transparent and accessible. At AuditDb, you can utilize various search
          options such as hashtag search, price range search, and deadline
          search to locate precisely what you require. Customers could easy sent
          one project for different auditers for several independent audits.
        </Typography>
        <Typography>
          Soon we we offer cutting-edge features such as a smart contract audits
          constructor, auditors rating system, and many other functionalities to
          enhance the audit experience. Keep in touch with us as we continue to
          disrupt the audit market.
        </Typography>
        <Typography>
          Check out this{" "}
          <a
            href="https://youtu.be/J7L4yAhS6Rw"
            target="_blank"
            rel="noopener noreferrer"
          >
            screencast
          </a>{" "}
          to see AuditDb in action!
        </Typography>
      </CustomCard>
    </Layout>
  );
};

export default AuditDb;

const wrapper = (theme) => ({
  padding: "40px",
  "& h3": {
    fontSize: "28px",
    fontWeight: 600,
  },
  "& ul": {
    fontSize: "22px",
    paddingLeft: "30px",
  },
  "& p": {
    fontSize: "22px",
    marginY: "22px",
    "&:nth-of-type(2)": {
      marginBottom: "10px",
    },
  },
  "& a": {
    textDecoration: 'underline',
    fontWeight: 'bold',
    color: 'inherit'
  },
  [theme.breakpoints.down("md")]: {
    "& p": {
      fontSize: "18px",
    },
    "& h3": {
      fontSize: "22px",
    },
    "& ul": {
      fontSize: "18px",
    },
  },
  [theme.breakpoints.down("xs")]: {
    "& p": {
      fontSize: "16px",
    },
    // '& h3': {
    //     fontSize: '22px',
    // },
    "& ul": {
      fontSize: "16px",
      paddingLeft: "16px",
    },
  },
});

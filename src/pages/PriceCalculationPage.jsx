import React from 'react';
import Headings from '../router/Headings.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import TagsField from '../components/forms/tags-field/tags-field.jsx';
import GithubSelection from '../components/GithubSelection/GithubSelection.jsx';
import { ProjectLinksList } from '../components/custom/ProjectLinksList.jsx';
import SalarySlider from '../components/forms/salary-slider/salary-slider.jsx';
import PriceCalculation from '../components/PriceCalculation.jsx';
import { Form, Formik } from 'formik';
import theme from '../styles/themes.js';
import { addTestsLabel } from '../lib/helper.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom/dist';

const PriceCalculationPage = () => {
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Layout>
      <Headings title="Price calculation" />

      <CustomCard sx={wrapper}>
        <Box>
          <Button
            sx={backButtonSx}
            onClick={() => navigate(-1)}
            aria-label="Ga back"
            {...addTestsLabel('go-back-button')}
          >
            <ArrowBackIcon />
          </Button>
        </Box>
        <Box sx={contentWrapperSx}>
          <Typography
            variant={'h4'}
            sx={{ marginBottom: '20px', textAlign: 'center' }}
          >
            Price calculation
          </Typography>
          <ul>
            <p style={{ fontWeight: 500 }}>Tool scope description:</p>
            <li>Processing links to retrieve file contents.</li>
            <li>
              Requiring files to be publicly accessible and downloadable without
              authorization.
            </li>
            <li>
              Supporting both github.com and raw.githubusercontent.com URLs.
            </li>
          </ul>
          <Formik
            initialValues={{
              scope: [],
              price: 0,
            }}
            onSubmit={values => {
              console.log(values);
            }}
          >
            {({
              handleSubmit,
              values,
              setFieldValue,
              setFieldTouched,
              dirty,
              touched,
              errors,
            }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <Box sx={fieldWrapper}>
                    <Box sx={blockSx}>
                      <Box sx={linkFieldWrapper}>
                        <TagsField
                          size={matchSm ? 'small' : 'medium'}
                          name="scope"
                          label="Project links"
                          setFieldTouched={setFieldTouched}
                        />
                        <GithubSelection noPrivate={true} />
                      </Box>
                      {!matchSm && <ProjectLinksList name="scope" />}
                    </Box>
                    <Box sx={blockSx}>
                      <Box>
                        <Box sx={priceLabelSx}>Price per line of code</Box>
                        <SalarySlider name="price" />
                      </Box>
                      <PriceCalculation
                        price={values.price}
                        scope={values.scope}
                      />
                      {matchSm && (
                        <Box sx={{ mt: '15px' }}>
                          <ProjectLinksList name="scope" />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </CustomCard>
    </Layout>
  );
};

export default PriceCalculationPage;

const blockSx = theme => ({
  width: '50%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
});

const contentWrapperSx = theme => ({
  padding: '40px',
  paddingTop: '5px',
  '& h4': {
    fontSize: '28px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
    '& h4': {
      fontSize: '22px',
    },
  },
});

const linkFieldWrapper = theme => ({
  display: 'flex',
  gap: '7px',
  alignItems: 'center',
  marginBottom: '15px',
  '& .github-btn': {
    padding: '16px 5px',
  },
  '& .field-wrapper': {
    width: '100%',
  },
  '& .tag-input-field .MuiOutlinedInput-root': {
    height: '57px!important',
  },
  [theme.breakpoints.down('sm')]: {
    '& .tag-input-field .MuiOutlinedInput-root': {
      height: '44px!important',
    },
    '& .github-btn': {
      padding: '10px 5px',
    },
  },
  [theme.breakpoints.down(500)]: {
    flexDirection: 'column',
    gap: '10px',
    '& .field-wrapper': {
      width: '100%',
    },
  },
});

const priceLabelSx = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#B3B3B3',
};

const fieldWrapper = theme => ({
  display: 'flex',
  marginTop: '20px',
  gap: '40px',
  [theme.breakpoints.down('md')]: {
    '& .MuiInputBase-root': {
      height: '44px',
      '& input': {
        paddingY: '7px',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
    flexDirection: 'column',

    '& .password-wrapper, .field-wrapper': {
      gap: '16px',
    },
  },
});

const backButtonSx = theme => ({
  minWidth: '50px',
});

const wrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1300px',
  minHeight: '560px!important',
  width: '100%',
  '& ul': {
    fontSize: '16px',
    marginBottom: '28px',
    '& li': {
      marginLeft: '15px',
      marginTop: '7px',
    },
  },
});

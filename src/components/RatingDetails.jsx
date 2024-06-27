import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Loader from './Loader.jsx';

const RatingDetails = ({ rating, role }) => {
  const ratingDetails = useMemo(() => {
    if (rating) {
      return JSON.parse(rating.rating_details);
    }
    return null;
  }, [rating]);

  if (!rating) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
        }}
      >
        <Loader role={role} />
      </Box>
    );
  }

  return (
    <Box sx={wrapper}>
      <Box sx={{ fontWeight: 500 }}>User rating:</Box>
      <Box sx={infoWrapper}>
        <span>Summary</span>
        <Typography noWrap={true}>
          <b>{rating?.summary}</b> out of 100.
        </Typography>
      </Box>
      {Object.keys(ratingDetails).map(point => (
        <Box sx={infoWrapper} key={point}>
          <span>{point}</span>
          <Typography noWrap={true}>{ratingDetails[point]}.</Typography>
        </Box>
      ))}
      <hr />
      <Box sx={infoWrapper}>
        <span>Total completed audits</span>
        <Typography noWrap={true}>{rating.total_completed_audits}</Typography>
      </Box>
      <Box sx={infoWrapper}>
        <span>Completed last 90 days</span>
        <Typography noWrap={true}>
          {rating.completed_last_ninety_days?.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default RatingDetails;

const wrapper = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const infoWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500,
  color: '#434242',
  '& p': {
    fontSize: 'inherit',
    maxWidth: '250px',
  },
  '& span': {
    width: '230px',
    marginRight: '30px',
    color: '#B2B3B3',
  },
  fontSize: '15px',
  [theme.breakpoints.down('md')]: {
    '& span': {
      width: '90px',
      marginRight: '20px',
    },
    '& p': {
      maxWidth: '190px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& p': {
      maxWidth: '240px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
  [theme.breakpoints.down(450)]: {
    '& span': {
      width: '70px',
      marginRight: '20px',
    },
    '& p': {
      maxWidth: '180px',
    },
  },
});

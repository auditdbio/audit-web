import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import Loader from './Loader.jsx';
import RatingProgressBar from './custom/RatingProgressBar.jsx';

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
      <Box sx={titleSx}>User rating:</Box>
      <Box sx={infoWrapper}>
        <span>Summary</span>
        <RatingProgressBar value={rating?.summary} sx={{ height: '20px' }} />
      </Box>
      <hr />
      <Box>
        {Object.keys(ratingDetails).map(point => (
          <Box sx={infoWrapper} key={point}>
            <span>{point}</span>
            <RatingProgressBar
              value={ratingDetails[point].split('/')[0]}
              maxValue={ratingDetails[point].split('/')[1]}
              sx={{ height: '20px' }}
            />
          </Box>
        ))}

        {/*<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>*/}
        {/*  {Object.keys(ratingDetails).map(point => (*/}
        {/*    <Box*/}
        {/*      key={point}*/}
        {/*      sx={{*/}
        {/*        display: 'flex',*/}
        {/*        flexDirection: 'column',*/}
        {/*        width: '50%',*/}
        {/*        alignItems: 'center',*/}
        {/*        padding: '20px',*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <span style={{ marginBottom: '10px', fontWeight: 500 }}>*/}
        {/*        {point}*/}
        {/*      </span>*/}
        {/*      <CircularProgressBar*/}
        {/*        value={ratingDetails[point].split('/')[0]}*/}
        {/*        maxValue={ratingDetails[point].split('/')[1]}*/}
        {/*      />*/}
        {/*    </Box>*/}
        {/*  ))}*/}
        {/*</Box>*/}
      </Box>
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

const titleSx = theme => ({
  fontWeight: 500,
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500,
  fontSize: '15px',
  color: '#434242',
  width: '100%',
  '& p': { fontSize: 'inherit' },
  '& > span': {
    width: '230px',
    marginRight: '30px',
    color: '#B2B3B3',
  },
  [theme.breakpoints.down('md')]: {
    '& > span': {
      fontSize: '14px',
      marginRight: '20px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > span': { fontSize: '13px' },
  },
  [theme.breakpoints.down('xs')]: {
    '& > span': { fontSize: '12px' },
  },
});

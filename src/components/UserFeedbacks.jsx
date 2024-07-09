import React, { useState } from 'react';
import { Link } from 'react-router-dom/dist';
import {
  Box,
  Button,
  Avatar,
  Typography,
  Rating,
  useMediaQuery,
} from '@mui/material';
import { ASSET_URL } from '../services/urls.js';
import theme from '../styles/themes.js';
import { capitalize } from '../lib/helper.js';

const UserFeedbacks = ({ feedbacks }) => {
  const matchXxs = useMediaQuery(theme.breakpoints.down(500));
  const [isShowFeedbacks, setIsShowFeedbacks] = useState(false);

  return (
    <Box sx={wrapper}>
      {!!feedbacks?.length && (
        <Button
          color="secondary"
          type="button"
          onClick={() => setIsShowFeedbacks(prev => !prev)}
        >
          {isShowFeedbacks ? 'Hide' : 'Show user feedbacks'}
        </Button>
      )}
      <Box sx={feedbacksContainer}>
        {isShowFeedbacks &&
          feedbacks &&
          feedbacks.map(fb => (
            <Box key={fb.id} sx={feedbackWrapper}>
              <Box sx={feedbackSx}>
                <Avatar
                  alt="User photo"
                  sx={avatarStyle}
                  src={
                    fb.from?.avatar ? `${ASSET_URL}/${fb.from.avatar}` : null
                  }
                />

                <Box sx={{ width: '100%' }}>
                  <Box sx={usernameSx}>
                    <Link to={`/${fb.from?.role?.[0]}/${fb.from?.user_id}`}>
                      {fb.from?.username}
                    </Link>
                  </Box>
                  {Object.keys(fb.rating).map(item => (
                    <Box sx={ratingField} key={item}>
                      <Typography component="legend" sx={ratingTitle}>
                        {capitalize(item).replace(/_/g, ' ')}
                      </Typography>
                      <Rating
                        size={matchXxs ? 'small' : 'medium'}
                        name={item}
                        value={fb.rating[item]}
                        readOnly
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default UserFeedbacks;

const wrapper = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const feedbacksContainer = theme => ({
  width: '100%',
  mt: '15px',
  display: 'flex',
  flexWrap: 'wrap',
});

const feedbackWrapper = theme => ({
  width: '33.333%',
  p: '8px',
  [theme.breakpoints.down('md')]: {
    width: '50%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
});

const feedbackSx = theme => ({
  display: 'flex',
  border: `1px solid ${theme.palette.secondary.main}`,
  padding: '10px',
});

const avatarStyle = theme => ({
  width: '60px',
  height: '60px',
  mr: '15px',
  [theme.breakpoints.down('sm')]: {
    width: '50px',
    height: '50px',
    mr: '10px',
  },
  [theme.breakpoints.down('xxs')]: {
    display: 'none',
  },
});

const usernameSx = {
  mb: '15px',
  fontWeight: 500,
  height: '20px',
  display: '-webkit-box',
  color: 'black',
  overflow: 'hidden',
  wordBreak: 'break-word',
  '-webkit-line-clamp': '1',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  '& > a': {
    color: 'black',
  },
};

const ratingField = theme => ({
  display: 'flex',
  width: '1005',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: '5px',
  '& > .MuiRating-root': {
    color: theme.palette.secondary.main,
  },
});

const ratingTitle = {
  fontSize: '12px !important',
};

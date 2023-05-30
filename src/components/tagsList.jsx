import React from 'react';
import { Box, Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear.js';
import Tooltip from '@mui/material/Tooltip';
import theme from '../styles/themes.js';

const TagsList = ({ data, fullView }) => {
  return (
    <Box
      className={'tagsWrapper'}
      sx={
        fullView
          ? {
              display: 'flex',
              width: '500px',
              flexWrap: 'wrap',
              [theme.breakpoints.down('xs')]: {
                width: '290px',
              },
            }
          : tagsList
      }
    >
      {data?.map((tag, idx) => (
        <Tooltip key={idx} title={tag} arrow placement={'top'}>
          <Chip
            sx={chipStyle}
            label={tag}
            variant="outlined"
            deleteIcon={<ClearIcon sx={iconSx} />}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default TagsList;

const tagsList = theme => ({
  display: '-webkit-box',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  overflow: 'hidden',
  maxWidth: '500px',
  marginRight: '-10px',
});

const chipStyle = theme => ({
  border: '2px solid #E5E5E5',
  borderRadius: '5px',
  color: '#434242',
  marginBottom: '10px',
  marginRight: '10px',
  fontWeight: 500,
  height: '24px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '7px',
    border: '1px solid #E5E5E5',
    height: '16px',
  },
});

const iconSx = theme => ({
  width: '15px',
  height: '15px',
  '& path': {
    fill: '#52176D',
  },
});

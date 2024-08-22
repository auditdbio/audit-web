import React from 'react';
import {
  LinearProgress,
  Box,
  Typography,
  useTheme,
  Tooltip,
} from '@mui/material';

const RatingProgressBar = ({ value = 0, maxValue = 100, sx = {}, tooltip }) => {
  return (
    <Box sx={wrapper}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          color="secondary"
          value={(100 / maxValue) * value}
          sx={{ height: '7px', borderRadius: '1px', ...sx }}
        />
      </Box>
      <Tooltip title={tooltip} placement="top">
        <Box sx={textValueSx}>
          <Typography sx={{ textAlign: 'center', flex: 1 }}>
            <span
              style={{
                float: 'left',
                width: '40%',
                textAlign: 'right',
                fontFamily: 'monospace',
              }}
            >
              {value.toFixed(1)}
            </span>
            <span style={{ fontFamily: 'monospace' }}>/</span>
            <span
              style={{
                float: 'right',
                width: '30%',
                textAlign: 'left',
                fontFamily: 'monospace',
              }}
            >
              {maxValue}
            </span>
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default RatingProgressBar;

export const CircularProgressBar = ({ value = 0, maxValue = 100 }) => {
  const theme = useTheme();
  const percentage = (value / maxValue) * 100;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={101} height={101}>
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={theme.palette.grey[300]}
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={theme.palette.secondary.main}
          strokeWidth="10"
          fill="none"
          strokeDasharray="282.743"
          strokeDashoffset={282.743 - (282.743 * percentage) / 100}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2">
          {value} / {maxValue}
        </Typography>
      </Box>
    </Box>
  );
};

const wrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  width: '60%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
});

const textValueSx = theme => ({
  whiteSpace: 'nowrap',
  width: '100px',
  ml: '10px',
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px',
  },
});

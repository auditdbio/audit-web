import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const GithubFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClickAway = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        {isOpen ? (
          <Box sx={filterModalSx}>
            <FormControlLabel
              value="end"
              control={<Checkbox />}
              label="Filter by ."
              labelPlacement="end"
            />
            <FormControlLabel
              value="end"
              control={<Checkbox />}
              label="Filter by Docker"
              labelPlacement="end"
            />
            <FormControlLabel
              value="end"
              control={<Checkbox />}
              label="Filter by Json"
              labelPlacement="end"
            />
          </Box>
        ) : null}
        <Button onClick={() => setIsOpen(!isOpen)}>
          <FilterAltIcon />
        </Button>
      </Box>
    </ClickAwayListener>
  );
};

export default GithubFilter;

const filterModalSx = theme => ({
  position: 'absolute',
  top: '30px',
  width: '220px',
  boxShadow:
    '0px 71.4286px 57.1429px rgba(0, 0, 0, 0.07), 0px 29.8412px 23.8729px rgba(0, 0, 0, 0.0503198), 0px 15.9545px 12.7636px rgba(0, 0, 0, 0.0417275), 0px 8.94397px 7.15517px rgba(0, 0, 0, 0.035), 0px 4.75007px 3.80006px rgba(0, 0, 0, 0.0282725), 0px 1.97661px 1.58129px rgba(0, 0, 0, 0.0196802)',
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '10px',
  gap: '5px',
  backgroundColor: '#FCFAF6',
  borderRadius: '5px',
  border: '1px solid',
  zIndex: 33,
  '& .MuiTypography-root': {
    fontSize: '14px',
  },
  [theme.breakpoints.down('xs')]: {
    gap: '5px',
  },
});

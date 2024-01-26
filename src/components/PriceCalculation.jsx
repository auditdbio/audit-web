import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js';
import ExpandLessIcon from '@mui/icons-material/ExpandLess.js';
import theme from '../styles/themes.js';

// todo delete
// files, blank, comment, code
const data = {
  C: [10, 4680, 6621, 30812],
  'C/C++': [3, 99, 286, 496],
  JavaScript: [3, 99, 286, 496],
  SUM: [13, 4779, 6907, 31308],
};

const PriceCalculation = ({ price = 0, sx = {}, color = 'primary' }) => {
  const [priceCalculation, setPriceCalculation] = useState(null);
  const [isDetailsPrice, setIsDetailsPrice] = useState(false);
  const [isDetailsMore, setIsDetailsMore] = useState(false);

  useEffect(() => {
    const cloc = Object.keys(data).map(lang => {
      return {
        name: lang,
        files: data[lang][0],
        blank: data[lang][1],
        comment: data[lang][2],
        code: data[lang][3],
      };
    });

    setPriceCalculation(cloc);
  }, [data]);

  const handleCheckCost = () => {};

  return (
    <Box sx={sx}>
      <Box sx={head} className="head">
        <Box sx={{ mr: '5px' }}>Price calculation</Box>
        <Tooltip
          title="Price calculation shows preliminary cost using scope and price per line. Blank lines and comments are not taken into account when calculating the cost."
          arrow
          placement="bottom"
          enterDelay={200}
          leaveDelay={100}
        >
          <HelpOutlineIcon fontSize="small" cursor="pointer" />
        </Tooltip>
        <Button
          sx={checkButton}
          color={color}
          variant="contained"
          type="button"
          onClick={handleCheckCost}
          disabled={!price}
        >
          Check
        </Button>
      </Box>

      {priceCalculation && (
        <Box sx={calcResult}>
          <Box sx={calcResultHead}>
            <Box>
              <Box sx={{ mb: '3px' }}>
                Total price:&nbsp;
                {(priceCalculation.find(it => it.name === 'SUM')?.code || 0) *
                  price}
              </Box>
              <Box>
                Total lines of code:&nbsp;
                {priceCalculation.find(it => it.name === 'SUM')?.code || 0}
              </Box>
            </Box>
            <Button
              sx={detailsButton}
              onClick={() => setIsDetailsMore(!isDetailsMore)}
            >
              <span>Details</span>
              {!isDetailsMore ? (
                <ExpandMoreIcon fontSize="small" />
              ) : (
                <ExpandLessIcon fontSize="small" />
              )}
            </Button>
          </Box>

          {isDetailsMore && (
            <Box>
              <Box sx={switchSx(color)}>
                <Switch
                  color={color}
                  size="small"
                  onChange={() => setIsDetailsPrice(prev => !prev)}
                />
                <span>{isDetailsPrice ? 'Price' : 'Code'}</span>
              </Box>
              <TableContainer>
                <Table sx={tableSx} size="small" aria-label="Price table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Language</TableCell>
                      {isDetailsPrice ? (
                        <>
                          <TableCell align="right">Code</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell align="right">Files</TableCell>
                          <TableCell align="right">Code</TableCell>
                          <TableCell align="right">Comment</TableCell>
                          <TableCell align="right">Blank</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {priceCalculation.map(row => (
                      <TableRow
                        key={row.name}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        {isDetailsPrice ? (
                          <>
                            <TableCell align="right">{row.code}</TableCell>
                            <TableCell align="right">
                              {row.code * price}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell align="right">{row.files}</TableCell>
                            <TableCell align="right">{row.code}</TableCell>
                            <TableCell align="right">{row.comment}</TableCell>
                            <TableCell align="right">{row.blank}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PriceCalculation;

const head = theme => ({
  display: 'flex',
  alignItems: 'center',
  color: '#333',
  fontSize: '14px',
  fontWeight: 500,
  mb: '15px',
  [theme.breakpoints.down('xxs')]: {
    fontSize: '12px',
  },
});

const checkButton = theme => ({
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'none',
  maxHeight: '28px',
  maxWidth: '180px',
  padding: '8px 42px',
  ml: '15px',
  boxShadow: '0',
  ':hover': { boxShadow: '0' },
  [theme.breakpoints.down('xxs')]: {
    fontSize: '12px',
    padding: '5px 30px',
    fontWeight: '500',
  },
});

const calcResult = theme => ({
  border: '1px solid #e0e0e0',
  borderRadius: '5px',
  width: '100%',
  padding: '15px',
  color: '#333',
  fontSize: '14px',
  fontWeight: 500,
  [theme.breakpoints.down('xs')]: {
    padding: '5px',
    fontSize: '12px',
  },
});

const calcResultHead = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const detailsButton = theme => ({
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  color: '#333',
  padding: 0,
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
});

const switchSx = color => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  mb: '5px',
  '& .MuiSwitch-thumb': {
    color:
      color === 'primary'
        ? theme.palette.primary.main
        : theme.palette.secondary.main,
  },
});

const tableSx = theme => ({
  width: '100%',
  background: 'none',
  '& th, & td': {
    fontSize: '14px',
    fontWeight: 500,
    '&:first-child': { pl: 0 },
    '&:last-child': { pr: 0 },
  },
  [theme.breakpoints.down('md')]: {
    '& th, & td': { padding: '6px 11px' },
  },
  [theme.breakpoints.down('sm')]: {
    '& th, & td': {
      fontSize: '12px',
      '&:first-child': { pr: 0 },
    },
  },
  [theme.breakpoints.down('xxs')]: {
    '& th, & td': {
      fontSize: '11px',
    },
  },
});

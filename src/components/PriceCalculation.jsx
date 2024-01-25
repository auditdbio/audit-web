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
  Paper,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js';
import ExpandLessIcon from '@mui/icons-material/ExpandLess.js';

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
          title="Price calculation shows preliminary cost using scope and price per line"
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
          <Box>
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
            <TableContainer sx={{ mt: '15px' }}>
              <Table sx={tableSx} size="small" aria-label="Price table">
                <TableHead>
                  <TableRow>
                    <TableCell>Language</TableCell>
                    <TableCell align="right">Files</TableCell>
                    <TableCell align="right">Code</TableCell>
                    <TableCell align="right">Comment</TableCell>
                    <TableCell align="right">Blank</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {priceCalculation.map(row => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.files}</TableCell>
                      <TableCell align="right">{row.code}</TableCell>
                      <TableCell align="right">{row.comment}</TableCell>
                      <TableCell align="right">{row.blank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PriceCalculation;

const head = {
  display: 'flex',
  alignItems: 'center',
  color: '#333',
  fontSize: '14px',
  fontWeight: 500,
  mb: '15px',
};

const checkButton = {
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'none',
  maxHeight: '28px',
  maxWidth: '180px',
  padding: '8px 42px',
  ml: '15px',
  boxShadow: '0',
  ':hover': { boxShadow: '0' },
};

const calcResult = theme => ({
  border: '1px solid #e0e0e0',
  borderRadius: '5px',
  width: '100%',
  padding: '15px',
  color: '#333',
  fontSize: '14px',
  fontWeight: 500,
  '& > div': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '5px',
    fontSize: '12px',
  },
});

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
});

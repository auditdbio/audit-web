import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GitUrlParse from 'git-url-parse';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js';
import ExpandLessIcon from '@mui/icons-material/ExpandLess.js';
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
  CircularProgress,
} from '@mui/material';
import theme from '../styles/themes.js';
import {
  clearCloc,
  clearProjectError,
  getCloc,
} from '../redux/actions/projectAction.js';
import CustomSnackbar from './custom/CustomSnackbar.jsx';

const PriceCalculation = ({
  scope,
  price = 0,
  color = 'primary',
  sx = {},
  autoCheck = true,
  totalPrice,
}) => {
  const dispatch = useDispatch();

  const { cloc, error } = useSelector(s => s.project);
  const [isDetailsPrice, setIsDetailsPrice] = useState(false);
  const [isDetailsMore, setIsDetailsMore] = useState(false);
  const [isAutoCheckOn, setIsAutoCheckOn] = useState(autoCheck);
  const [isLoading, setIsLoading] = useState(false);
  const [correctLinks, setCorrectLinks] = useState([]);

  useEffect(() => {
    if (scope) {
      const links = scope.reduce((acc, url) => {
        if (!url.startsWith('http')) return acc;

        // const parsedUrl = GitUrlParse(url);
        // if (
        //   ((parsedUrl.resource === 'github.com' ||
        //     parsedUrl.source === 'github.com') &&
        //     url.includes('/blob/')) ||
        //   parsedUrl.source === 'githubusercontent.com' ||
        //   parsedUrl.resource === 'raw.githubusercontent.com'
        // ) {
        //   acc.push(url);
        // }

        acc.push(url);
        return acc;
      }, []);

      setCorrectLinks(links);
    }
  }, [scope]);

  useEffect(() => {
    if (correctLinks.length && isAutoCheckOn) {
      dispatch(getCloc({ links: correctLinks }));
    }
    return () => {
      dispatch(clearCloc());
    };
  }, [correctLinks, isAutoCheckOn]);

  const handleCheckCost = () => {
    if (correctLinks.length) {
      setIsLoading(prev => !prev);
      setIsAutoCheckOn(true);
      dispatch(getCloc({ links: correctLinks }));
    }
  };

  // if (!correctLinks.length) {
  //   return null;
  // }

  return (
    <Box sx={sx}>
      <CustomSnackbar
        autoHideDuration={5000}
        open={!!error}
        severity="error"
        text={error}
        onClose={() => {
          setIsLoading(false);
          dispatch(clearProjectError());
        }}
      />

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

        {!cloc && !isAutoCheckOn && (
          <Tooltip
            title={!+price ? 'Add the price per line of code' : ''}
            arrow
            placement="bottom"
            enterDelay={200}
            leaveDelay={100}
          >
            <span>
              <Button
                sx={checkButton}
                color={color}
                variant="contained"
                type="button"
                onClick={handleCheckCost}
                disabled={!+price}
              >
                {isLoading ? (
                  <CircularProgress size={15} color="light" thickness={8} />
                ) : (
                  'Check'
                )}
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

      {/*{cloc && (*/}
      <Box sx={calcResult}>
        <Box sx={calcResultHead}>
          <Box>
            <Box sx={{ mb: '3px' }}>
              Total price:&nbsp; $ {(cloc?.result?.SUM?.code || 0) * price}
            </Box>
            <Box>
              Total lines of code:&nbsp;
              {cloc?.result?.SUM?.code || 0}
            </Box>
            {!!totalPrice && (
              <Box sx={{ mt: '3px' }}>
                Price per line:&nbsp; ${' '}
                {(totalPrice / cloc?.result?.SUM?.code || 0).toFixed(2)}
              </Box>
            )}
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
                {cloc && (
                  <TableBody>
                    {Object.keys(cloc.result).map(lang => (
                      <TableRow
                        key={lang}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {lang === 'SUM' ? 'Summary' : lang}
                        </TableCell>
                        {isDetailsPrice ? (
                          <>
                            <TableCell align="right">
                              {cloc.result[lang].code}
                            </TableCell>
                            <TableCell align="right" sx={priceCellSx}>
                              $ {cloc.result[lang].code * price}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell align="right">
                              {cloc.result[lang].nFiles}
                            </TableCell>
                            <TableCell align="right">
                              {cloc.result[lang].code}
                            </TableCell>
                            <TableCell align="right">
                              {cloc.result[lang].comment}
                            </TableCell>
                            <TableCell align="right">
                              {cloc.result[lang].blank}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
      {/*)}*/}
    </Box>
  );
};

export default PriceCalculation;

const head = theme => ({
  height: '28px',
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
  width: '130px',
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

const priceCellSx = {
  minWidth: '80px',
};

import React, { useMemo, useState } from 'react';
import { Box } from '@mui/system';
import {
  Avatar,
  Button,
  Chip,
  ClickAwayListener,
  FormControl,
  InputLabel,
  Modal,
  OutlinedInput,
  Popover,
  Select,
  Typography,
  useMediaQuery,
} from '@mui/material';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ASSET_URL } from '../../services/urls.js';
import { FastField, Field } from 'formik';
import { TextField } from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';
import MenuItem from '@mui/material/MenuItem';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { approveHistory } from '../../redux/actions/auditAction.js';
import PendingIcon from '@mui/icons-material/Pending';

const DescriptionModal = ({ item, request, oldValue }) => {
  const [isOpenDiff, setIsOpenDiff] = useState(false);
  const approvedChange = useSelector(s => s.audits.approvedHistory);
  const user = useSelector(s => s.user.user);
  const { audit, auditRequest } = useSelector(s => s.audits);
  const [compare, setCompare] = useState(null);
  const auditHistory = useSelector(s => s.audits.auditHistory);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const mediaSx = useMediaQuery(theme => theme.breakpoints.down('xs'));

  const mainAudit = useMemo(() => {
    return JSON.parse(oldValue.audit);
  }, [item, request]);

  const handleClose = () => {
    setIsOpenDiff(false);
    setCompare(null);
  };
  //

  const data = JSON.parse(item?.audit);

  const checkAudit = useMemo(() => {
    if (compare) {
      return JSON.parse(compare.audit);
    } else {
      return {
        project_name: mainAudit.project_name,
        description: mainAudit.description,
        scope: mainAudit.scope,
        tags: mainAudit.tags,
        price: mainAudit.price,
        time: mainAudit.time,
        conclusion: mainAudit.conclusion,
      };
    }
  }, [mainAudit, compare]);

  const handleApprove = () => {
    // console.log(22);
    dispatch(approveHistory(audit.id, item, request));
    setIsOpenDiff(false);
  };
  //
  const approve = Object.entries(approvedChange).map(([key, value]) => {
    return { id: key, value: value };
  });
  const isApprovedByMe = approve.filter(
    el => el.value === item.id && el.id === user.id,
  );

  const isApprovedByOther = approve.filter(
    el => el.value === item.id && el.id !== user.id,
  );

  console.log(isApprovedByMe);
  return (
    <Box sx={{ margin: '8px 0', paddingLeft: '12px' }}>
      <Box sx={itemWrapperSx}>
        <Box sx={userTitleSx} onClick={() => setIsOpenDiff(true)}>
          <Avatar src={`${ASSET_URL}/${item.author.avatar}`} />
          <Typography sx={[titleSx, { mr: '7px' }]} variant={'h5'}>
            {item.author.name}
          </Typography>
          {/*{approvedChange === 2 && <Chip label="Approved" color="primary" />}*/}
        </Box>
        <Box
          sx={{
            width: '300px',
            '& .MuiChip-root': {
              fontSize: '10px',
            },
          }}
        >
          {!!isApprovedByMe.length && (
            <Chip size={'small'} label={'Approved by you'} color="info" />
          )}
          {!!isApprovedByOther.length && (
            <Chip label={'Waiting for approve'} size={'small'} color="error" />
          )}
          <Button
            variant={'contained'}
            onClick={e => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
            sx={compareSx}
            disabled={!auditHistory.filter(el => el.id !== item.id).length}
          >
            Compare with
          </Button>
        </Box>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <Box
              sx={{
                width: '210px',
                backgroundColor: 'white',
                boxShadow: '0px 3px 9px 0px rgba(0,0,0,0.75)',
                borderRadius: '5px',
              }}
            >
              {auditHistory
                .filter(el => el.id !== item.id)
                .map(el => (
                  <MenuItem
                    sx={{ color: 'black', borderBottom: '1px solid #c9c9c9' }}
                    key={el.date}
                    value={el}
                    onClick={() => {
                      setCompare(el);
                      setAnchorEl(null);
                      setIsOpenDiff(true);
                    }}
                  >
                    {dayjs(el.date / 1000).format('MM.DD.YYYY HH:mm')}
                  </MenuItem>
                ))}
            </Box>
          </ClickAwayListener>
        </Popover>

        <Typography variant={'h6'} sx={dateSx}>
          {dayjs(item.date / 1000).format('MM.DD.YYYY HH:mm')}
        </Typography>
      </Box>
      <Modal
        open={isOpenDiff}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={modalSx}>
          <Button onClick={handleClose} sx={closeBtnSx}>
            <CloseRoundedIcon />
          </Button>
          <Box>
            <Box sx={compareUserSx}>
              <Box sx={headerSx}>
                <Avatar src={`${ASSET_URL}/${item.author.avatar}`} />
                <Box
                  sx={{ display: 'flex', gap: '7px', flexDirection: 'column' }}
                >
                  <Typography
                    variant={'h5'}
                    onClick={() => setIsOpenDiff(true)}
                    sx={[titleSx, compareUserTitleSx]}
                  >
                    {item.author.name}{' '}
                  </Typography>
                  <Typography variant={'h5'} sx={{ fontSize: '16px' }}>
                    {dayjs(item.date / 1000).format('MM.DD.YYYY HH:mm')}
                  </Typography>
                </Box>
              </Box>
              {(oldValue || compare) && (
                <Box sx={headerSx}>
                  <Avatar
                    src={`${ASSET_URL}/${(oldValue || compare).author.avatar}`}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '7px',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      variant={'h5'}
                      onClick={() => setIsOpenDiff(true)}
                      sx={[titleSx, compareUserTitleSx]}
                    >
                      {(oldValue || compare).author.name}{' '}
                    </Typography>
                    <Typography variant={'h5'} sx={{ fontSize: '16px' }}>
                      {dayjs((oldValue || compare).date / 1000).format(
                        'MM.DD.YYYY HH:mm',
                      )}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            {data.price && (
              <>
                <Typography variant={'h6'} sx={{ fontWeight: 500 }}>
                  Price
                </Typography>
                <ReactDiffViewer
                  oldValue={JSON.stringify(checkAudit.price, null, 2)}
                  newValue={JSON.stringify(data.price, null, 2)}
                  splitView={!mediaSx}
                  compareMethod={DiffMethod.WORDS}
                />
              </>
            )}
            {data.description && (
              <>
                <Typography variant={'h6'} sx={{ fontWeight: 500 }}>
                  Description
                </Typography>
                <ReactDiffViewer
                  oldValue={JSON.stringify(checkAudit.description, null, 2)}
                  newValue={JSON.stringify(data.description, null, 2)}
                  splitView={!mediaSx}
                  compareMethod={DiffMethod.WORDS}
                />
              </>
            )}

            {data.scope && (
              <>
                <Typography variant={'h6'} sx={{ fontWeight: 500 }}>
                  Scope
                </Typography>
                <ReactDiffViewer
                  oldValue={JSON.stringify(checkAudit.scope, null, 2)}
                  newValue={JSON.stringify(data.scope, null, 2)}
                  splitView={!mediaSx}
                  compareMethod={DiffMethod.WORDS}
                />
              </>
            )}
            {data.tags && (
              <>
                <Typography variant={'h6'} sx={{ fontWeight: 500 }}>
                  Tags
                </Typography>
                <ReactDiffViewer
                  oldValue={JSON.stringify(checkAudit.tags, null, 2)}
                  newValue={JSON.stringify(data.tags, null, 2)}
                  splitView={!mediaSx}
                  compareMethod={DiffMethod.WORDS}
                />
              </>
            )}
            {data.conclusion && (
              <>
                <Typography variant={'h6'} sx={{ fontWeight: 500 }}>
                  Conclusion
                </Typography>
                <ReactDiffViewer
                  oldValue={JSON.stringify(checkAudit.conclusion, null, 2)}
                  newValue={JSON.stringify(data.conclusion, null, 2)}
                  splitView={!mediaSx}
                  compareMethod={DiffMethod.WORDS}
                />
              </>
            )}
            {item.comment && (
              <>
                <Typography variant={'h6'} sx={{ fontWeight: 500 }}>
                  Comments
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <ReactDiffViewer
                    oldValue={JSON.stringify(
                      oldValue.comment || compare?.comment || '',
                      null,
                      2,
                    )}
                    newValue={JSON.stringify(item.comment || '', null, 2)}
                    splitView={!mediaSx}
                    compareMethod={DiffMethod.WORDS}
                  />
                </Box>
              </>
            )}
            <Button
              onClick={handleApprove}
              variant={'contained'}
              sx={{ mt: '15px', textTransform: 'unset' }}
              // disabled={item.approved.length === 2}
            >
              Approve changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DescriptionModal;

const dateSx = theme => ({
  width: '150px',
  marginLeft: '8px',
  fontSize: '16px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    width: '122px',
  },
});

const closeBtnSx = theme => ({
  minWidth: 'unset',
  marginLeft: '-25px',
  [theme.breakpoints.down('xs')]: {
    marginTop: '-10px',
    marginLeft: '-10px',
  },
});

const compareUserTitleSx = theme => ({
  maxWidth: '400px',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    maxWidth: '270px',
  },
});

const headerSx = theme => ({
  padding: '7px 0',
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  width: '50%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
});

const compareUserSx = theme => ({
  display: 'flex',
  borderBottom: '1px solid #c9c9c9',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
});

const titleSx = theme => ({
  cursor: 'pointer',
  fontSize: '22px!important',
  fontWeight: 500,
  [theme.breakpoints.down('md')]: {
    fontSize: '18px!important',
  },
});

const itemWrapperSx = theme => ({
  padding: '7px 0',
  borderBottom: '1px solid #c9c9c9',
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    gap: '8px',
    padding: '10px 0',
    alignItems: 'flex-start',
  },
});

const compareSx = theme => ({
  position: 'relative',
  textTransform: 'unset',
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
  [theme.breakpoints.down('xs')]: {
    order: 1,
  },
});

const userTitleSx = theme => ({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  width: '550px',
  textOverflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    width: '400px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '350px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
});

const modalSx = theme => ({
  position: 'absolute',
  width: '98%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '10px',
  height: '90%',
  overflowY: 'auto',
  paddingTop: '7px',
  [theme.breakpoints.down('xs')]: {
    padding: 2,
    // '& .react-diff-1klnsbn-empty-gutter': {
    //   display: 'none',
    // },
  },
});

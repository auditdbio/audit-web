import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/system';
import {
  Avatar,
  Button,
  Chip,
  ClickAwayListener,
  Divider,
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
import {
  approveHistory,
  approveHistoryAndRead,
  approveHistoryAndReadRequest,
  handleReadHistory,
  handleReadRequestHistory,
} from '../../redux/actions/auditAction.js';
import PendingIcon from '@mui/icons-material/Pending';
import Badge from '@mui/material/Badge';
import { CUSTOMER } from '../../redux/actions/types.js';

const DescriptionModal = ({
  item,
  request,
  oldValue,
  idx,
  openDiff,
  handleCloseRecap,
  closeChangesRecap,
}) => {
  const [isOpenDiff, setIsOpenDiff] = useState(false);
  const approvedChange = useSelector(s => s.audits.approvedHistory);
  const user = useSelector(s => s.user.user);
  const { audit, auditRequest } = useSelector(s => s.audits);
  const [compare, setCompare] = useState(null);
  const auditHistory = useSelector(s => s.audits.auditHistory);
  const unread = useSelector(s => s.audits.unreadHistory);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const mediaSx = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const auditRequestHistory = useSelector(s => s.audits.auditRequestHistory);

  useEffect(() => {
    if (openDiff) {
      openDiff(setIsOpenDiff);
    }
  }, [openDiff]);

  const mainAudit = useMemo(() => {
    return JSON.parse(oldValue.audit);
  }, [item, request]);

  const handleClose = () => {
    setIsOpenDiff(false);
    setCompare(null);
    if (handleCloseRecap) {
      handleCloseRecap();
    }
  };

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
        total_cost: mainAudit.total_cost,
      };
    }
  }, [mainAudit, compare]);

  const handleApprove = () => {
    if (openDiff) {
      if (!request) {
        dispatch(approveHistoryAndRead(audit.id, item, idx, request, user.id));
      }
    } else {
      dispatch(approveHistory(audit.id, item, request));
    }

    handleClose();
  };
  const approve = Object.entries(approvedChange || []).map(([key, value]) => {
    return { id: key, value: value };
  });
  const isApprovedByMe = approve.filter(
    el => el.value === item.id && el.id === user.id,
  );

  const isApprovedByOther = approve.filter(
    el => el.value === item.id && el.id !== user.id,
  );

  const isApproved = approve.every(el => el.value === item.id);

  const handleOpen = () => {
    setIsOpenDiff(true);
    if (unread[user?.id] >= idx + 1 && unread[user?.id] > 0) {
      if (!request) {
        dispatch(handleReadHistory(audit.id, idx, user.id));
      } else {
        dispatch(handleReadRequestHistory(auditRequest.id, idx, user.id));
      }
    }
  };

  return (
    <Box sx={{ margin: '8px 0', paddingLeft: '12px' }}>
      <Box sx={itemWrapperSx}>
        <Box sx={userTitleSx} onClick={handleOpen}>
          {unread && unread[user?.id] >= idx + 1 && unread[user?.id] > 0 ? (
            <Badge
              color={user.current_role === CUSTOMER ? 'primary' : 'secondary'}
              badgeContent="new"
            >
              <Avatar
                src={
                  item.author.avatar ? `${ASSET_URL}/${item.author.avatar}` : ''
                }
              />
            </Badge>
          ) : (
            <Avatar
              src={
                item.author.avatar ? `${ASSET_URL}/${item.author.avatar}` : ''
              }
            />
          )}
          <Box sx={titleWrapper}>
            <Typography sx={[titleSx, { mr: '7px' }]} variant={'h5'}>
              {item.author.name}
            </Typography>
            {!mediaSx && (
              <Box sx={chipSx}>
                {approvedChange && isApproved ? (
                  <Chip size={'small'} label={'Approved'} color="success" />
                ) : (
                  <>
                    {!!isApprovedByMe.length && (
                      <Chip
                        size={'small'}
                        label={
                          user.current_role === CUSTOMER
                            ? 'Customer'
                            : 'Auditor'
                        }
                        color="warning"
                      />
                    )}
                    {!!isApprovedByOther.length && (
                      <Chip
                        label={
                          user.current_role !== CUSTOMER
                            ? 'Customer'
                            : 'Auditor'
                        }
                        size={'small'}
                        color="secondary"
                      />
                    )}
                  </>
                )}
              </Box>
            )}
          </Box>
        </Box>
        {mediaSx && (!!isApprovedByMe.length || !!isApprovedByOther.length) && (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Typography sx={{ fontWeight: 600 }}>Approve</Typography>
            {!!isApprovedByMe.length && (
              <Chip
                size={'small'}
                label={user.current_role === CUSTOMER ? 'Customer' : 'Auditor'}
                color="info"
              />
            )}
            {!!isApprovedByOther.length && (
              <Chip
                label={user.current_role !== CUSTOMER ? 'Customer' : 'Auditor'}
                size={'small'}
                color="error"
              />
            )}
          </Box>
        )}
        <Button
          variant={'contained'}
          onClick={e => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
          sx={compareSx}
          disabled={
            !(request ? auditRequestHistory : auditHistory).filter(
              el => el.id !== item.id,
            ).length
          }
        >
          Compare with
        </Button>

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
              {(request ? auditRequestHistory : auditHistory)
                ?.filter(el => el.id !== item.id)
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
                <Avatar
                  src={
                    (oldValue || compare).author.avatar
                      ? `${ASSET_URL}/${(oldValue || compare).author.avatar}`
                      : ''
                  }
                />
                <Box
                  sx={{ display: 'flex', gap: '7px', flexDirection: 'column' }}
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
              {item && (
                <Box sx={headerSx}>
                  <Avatar
                    src={
                      item.author.avatar
                        ? `${ASSET_URL}/${item.author.avatar}`
                        : ''
                    }
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
                      {item.author.name}{' '}
                    </Typography>
                    <Typography variant={'h5'} sx={{ fontSize: '16px' }}>
                      {dayjs(item.date / 1000).format('MM.DD.YYYY HH:mm')}
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
            {data.total_cost && (
              <>
                <Typography variant={'h6'} sx={{ fontWeight: 500 }}>
                  Total cost
                </Typography>
                <ReactDiffViewer
                  oldValue={JSON.stringify(checkAudit.total_cost, null, 2)}
                  newValue={JSON.stringify(data.total_cost, null, 2)}
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
                <Divider sx={{ mt: '20px' }} />
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
            <Box
              sx={[
                openDiff ? { display: 'flex', justifyContent: 'center' } : {},
                { mt: '20px' },
              ]}
            >
              <Button
                onClick={handleApprove}
                variant={'contained'}
                sx={{ mt: '15px', textTransform: 'unset', width: '157px' }}
                // disabled={item.approved.length === 2}
              >
                Approve changes
              </Button>
              {openDiff && (
                <Button
                  onClick={() => {
                    setIsOpenDiff(false);
                    setCompare(null);
                    closeChangesRecap(false);
                  }}
                  color={'secondary'}
                  variant={'contained'}
                  sx={{
                    mt: '15px',
                    textTransform: 'unset',
                    ml: '20px',
                    width: '157px',
                  }}
                  // disabled={item.approved.length === 2}
                >
                  Show history
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DescriptionModal;

const titleWrapper = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

const chipSx = theme => ({
  width: '148px',
  [theme.breakpoints.down('md')]: {
    width: '95px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '85px',
  },
});

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
  width: 'calc(100% - 320px)',
  textOverflow: 'hidden',
  // [theme.breakpoints.down('md')]: {
  //   width: '400px',
  // },
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100% - 280px)',
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

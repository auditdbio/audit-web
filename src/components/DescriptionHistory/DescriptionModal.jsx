import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/system';
import {
  Avatar,
  Button,
  Chip,
  ClickAwayListener,
  Collapse,
  Divider,
  Modal,
  Popover,
  Typography,
  useMediaQuery,
} from '@mui/material';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ASSET_URL } from '../../services/urls.js';
import MenuItem from '@mui/material/MenuItem';
import {
  approveHistory,
  approveHistoryAndRead,
  handleReadHistory,
  handleReadRequestHistory,
} from '../../redux/actions/auditAction.js';
import Badge from '@mui/material/Badge';
import { CUSTOMER } from '../../redux/actions/types.js';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';

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
  const issuesReducer = useSelector(s => s.issues.issues);
  const [checkIssuesDiff, setCheckIssuesDiff] = useState(false);
  const machXxs = useMediaQuery(theme => theme.breakpoints.down(570));

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

  const checkIssue = useMemo(() => {
    if (compare) {
      return compare.issues;
    } else {
      return oldValue?.issues;
    }
  }, [oldValue, compare]);

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

  useEffect(() => {
    setCheckIssuesDiff(
      issuesReducer.some(issue => {
        const issueData = item?.issues[issue.id];
        const compareIssue = checkIssue[issue.id]
          ? JSON.parse(checkIssue[issue.id])
          : null;
        const convertedIssue = issueData ? JSON.parse(issueData) : null;
        return compareIssue?.feedback === convertedIssue?.feedback;
      }),
    );
  }, [issuesReducer, item, checkIssue]);

  return (
    <Box sx={{ margin: '8px 0', paddingLeft: '12px' }}>
      <Box sx={itemWrapperSx}>
        <Box sx={userTitleSx} onClick={handleOpen}>
          {unread && unread[user?.id] >= idx + 1 && unread[user?.id] > 0 ? (
            <Badge
              color={
                user?.current_role?.toLowerCase() === CUSTOMER?.toLowerCase()
                  ? 'primary'
                  : 'secondary'
              }
              badgeContent="new"
            >
              <Avatar
                src={
                  item.author.avatar
                    ? `${ASSET_URL}/id/${item.author.avatar}`
                    : ''
                }
              />
            </Badge>
          ) : (
            <Avatar
              src={
                item.author.avatar
                  ? `${ASSET_URL}/id/${item.author.avatar}`
                  : ''
              }
            />
          )}
          <Box sx={titleWrapper}>
            <Box>
              <Typography sx={[titleSx, { mr: '7px' }]} variant={'h5'}>
                {item.author.name}
              </Typography>
              {machXxs &&
                (!!isApprovedByMe.length || !!isApprovedByOther.length) && (
                  <Box sx={aproovesSx}>
                    <Typography sx={{ fontWeight: 600 }}>Approve</Typography>

                    {approvedChange && isApproved ? (
                      <Chip size={'small'} label={'Approved'} color="success" />
                    ) : (
                      <>
                        {!!isApprovedByMe.length && (
                          <Chip
                            size={'small'}
                            label={
                              user?.current_role?.toLowerCase() ===
                              CUSTOMER?.toLowerCase()
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
            {!machXxs && (
              <Box sx={chipSx}>
                {approvedChange && isApproved ? (
                  <Chip size={'small'} label={'Approved'} color="success" />
                ) : (
                  <>
                    {!!isApprovedByMe.length && (
                      <Chip
                        size={'small'}
                        label={
                          user?.current_role?.toLowerCase() ===
                          CUSTOMER?.toLowerCase()
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
        {!mediaSx ? (
          <>
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
            <Typography variant={'h6'} sx={dateSx}>
              {dayjs(item.date / 1000).format('MM.DD.YYYY HH:mm')}
            </Typography>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
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
            <Typography variant={'h6'} sx={dateSx}>
              {dayjs(item.date / 1000).format('MM.DD.YYYY HH:mm')}
            </Typography>
          </Box>
        )}
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
                      ? `${ASSET_URL}/id/${(oldValue || compare).author.avatar}`
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
                        ? `${ASSET_URL}/id/${item.author.avatar}`
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
            <Typography
              variant={'h5'}
              sx={{ fontWeight: 500, color: '#8e8e8e', mt: '7px' }}
            >
              Audit
            </Typography>
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
            {!!data.total_cost && (
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

            {!!Object.keys(item.issues).length && (
              <>
                <Divider sx={{ my: '7px', borderColor: '#c9c9c9' }} />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    my: '5px',
                  }}
                >
                  <Typography
                    onClick={() => setCheckIssuesDiff(!checkIssuesDiff)}
                    variant={'h5'}
                    sx={{
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      color: '#8e8e8e',
                    }}
                  >
                    Issues{' '}
                    <ExpandLessOutlinedIcon
                      sx={[
                        checkIssuesDiff ? {} : { transform: 'rotate(180deg)' },
                        {
                          transition: '0.2s',
                          width: '20px',
                          height: '20px',
                        },
                      ]}
                    />
                  </Typography>
                </Box>
                <Collapse sx={{ width: '100%' }} in={checkIssuesDiff}>
                  {issuesReducer.map(issue => {
                    const issueData = item?.issues[issue.id];
                    const compareIssue = checkIssue[issue.id]
                      ? JSON.parse(checkIssue[issue.id])
                      : null;
                    const convertedIssue = issueData
                      ? JSON.parse(issueData)
                      : null;
                    if (convertedIssue?.feedback) {
                      return (
                        <React.Fragment key={issue.id}>
                          <Typography
                            variant={'h6'}
                            sx={{ fontWeight: 500, fontSize: '20px' }}
                          >
                            {convertedIssue.issue_name} feedback
                          </Typography>
                          <ReactDiffViewer
                            oldValue={JSON.stringify(
                              compareIssue?.feedback || '',
                              null,
                              2,
                            )}
                            newValue={JSON.stringify(
                              convertedIssue?.feedback || '',
                              null,
                              2,
                            )}
                            splitView={!mediaSx}
                            compareMethod={DiffMethod.WORDS}
                          />
                        </React.Fragment>
                      );
                    }
                  })}
                </Collapse>
              </>
            )}
            {item.comment && (
              <>
                <Divider sx={{ mt: '7px', borderColor: '#c9c9c9' }} />
                <Typography variant={'h6'} sx={{ fontWeight: 500 }}>
                  Comment
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography>{item.comment}</Typography>
                </Box>
              </>
            )}
            <Box
              sx={[
                openDiff ? { display: 'flex', justifyContent: 'center' } : {},
              ]}
            >
              <Button
                onClick={handleApprove}
                variant={'contained'}
                sx={{ mt: '15px', textTransform: 'unset', width: '157px' }}
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

const readAllButton = theme => ({
  p: '3px',
  paddingX: '8px',
  minWidth: 'unset',
  textTransform: 'unset',
  boxShadow: 'unset',
  fontWeight: 600,
  borderRadius: '8px',
  width: '280px',
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
  },
});

const aproovesSx = theme => ({
  display: 'flex',
  gap: '8px',
  mt: '7px',
  [theme.breakpoints.down('xs')]: {
    alignSelf: 'center',
  },
});

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
  [theme.breakpoints.down('xs')]: {
    alignSelf: 'center',
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
  [theme.breakpoints.down('xs')]: {
    alignSelf: 'flex-end',
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
    gap: '8px',
    padding: '10px 0',
    alignItems: 'flex-start',
  },
  [theme.breakpoints.down(460)]: {
    flexDirection: 'column',
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
    alignSelf: 'flex-end',
    width: '122px',
  },
});

const userTitleSx = theme => ({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  width: 'calc(100% - 320px)',
  textOverflow: 'hidden',
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
  '&::-webkit-scrollbar': {
    width: '2px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: 2,
    paddingRight: '8px',
  },
});

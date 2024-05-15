import React, { useMemo, useState } from 'react';
import { Box } from '@mui/system';
import {
  Avatar,
  Button,
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
import { addCommentAudit } from '../../redux/actions/auditAction.js';

const DescriptionModal = ({ item, request }) => {
  const [isOpenDiff, setIsOpenDiff] = useState(false);
  const { audit, auditRequest } = useSelector(s => s.audits);
  const [openComment, setOpenComment] = useState(false);
  const [compare, setCompare] = useState(null);
  const auditHistory = useSelector(s => s.audits.auditHistory);
  const [showCompareList, setShowCompareList] = useState(false);
  const [commentField, setCommentField] = useState('');
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const mediaSx = useMediaQuery(theme => theme.breakpoints.down('xs'));

  const mainAudit = useMemo(() => {
    if (request) {
      return auditRequest;
    } else {
      return audit;
    }
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

  const handleAddComment = () => {
    const data = { description: checkAudit.description, comment: commentField };
    dispatch(addCommentAudit(audit.id, data));
  };

  return (
    <Box sx={{ margin: '8px 0' }}>
      <Box sx={itemWrapperSx}>
        <Box sx={userTitleSx} onClick={() => setIsOpenDiff(true)}>
          <Avatar src={`${ASSET_URL}/${item.author.avatar}`} />
          <Typography sx={titleSx} variant={'h5'}>
            {item.author.name}
          </Typography>
        </Box>
        <Button
          variant={'contained'}
          onClick={e => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
          sx={compareSx}
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

        <Typography
          variant={'h6'}
          sx={{ width: '150px', marginLeft: '8px', fontSize: '16px' }}
        >
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
                <Box sx={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
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
              {compare && (
                <Box sx={headerSx}>
                  <Avatar src={`${ASSET_URL}/${compare.author.avatar}`} />
                  <Box
                    sx={{ display: 'flex', gap: '7px', alignItems: 'center' }}
                  >
                    <Typography
                      variant={'h5'}
                      onClick={() => setIsOpenDiff(true)}
                      sx={[titleSx, compareUserTitleSx]}
                    >
                      {compare.author.name}{' '}
                    </Typography>
                    <Typography variant={'h5'} sx={{ fontSize: '16px' }}>
                      {dayjs(compare.date / 1000).format('MM.DD.YYYY HH:mm')}
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
                  oldValue={JSON.stringify(data.price, null, 2)}
                  newValue={JSON.stringify(checkAudit.price, null, 2)}
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
                  oldValue={JSON.stringify(data.description, null, 2)}
                  newValue={JSON.stringify(checkAudit.description, null, 2)}
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
                  oldValue={JSON.stringify(data.scope, null, 2)}
                  newValue={JSON.stringify(checkAudit.scope, null, 2)}
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
                  oldValue={JSON.stringify(data.tags, null, 2)}
                  newValue={JSON.stringify(checkAudit.tags, null, 2)}
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
                  oldValue={JSON.stringify(data.conclusion, null, 2)}
                  newValue={JSON.stringify(checkAudit.conclusion, null, 2)}
                  splitView={!mediaSx}
                  compareMethod={DiffMethod.WORDS}
                />
              </>
            )}
            {/*{item.comment ? (*/}
            {/*  <Typography>{item.comment}</Typography>*/}
            {/*) : (*/}
            {/*  <Button*/}
            {/*    variant={'contained'}*/}
            {/*    sx={{ marginY: '15px' }}*/}
            {/*    onClick={() => {*/}
            {/*      console.log(openComment);*/}
            {/*      setOpenComment(!openComment);*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    {openComment ? 'Close comment' : 'Open comment'}*/}
            {/*  </Button>*/}
            {/*)}*/}
            {/*{openComment && (*/}
            {/*  <>*/}
            {/*    <TextField*/}
            {/*      label="Comment"*/}
            {/*      multiline*/}
            {/*      rows={4}*/}
            {/*      variant="outlined"*/}
            {/*      fullWidth*/}
            {/*      sx={{ marginY: '15px' }}*/}
            {/*      onChange={e => {*/}
            {/*        setCommentField(e.target.value);*/}
            {/*      }}*/}
            {/*    />*/}
            {/*    <Button variant={'contained'} onClick={handleAddComment}>*/}
            {/*      Submit*/}
            {/*    </Button>*/}
            {/*  </>*/}
            {/*)}*/}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DescriptionModal;

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
    gap: '5px',
    padding: '10px 0',
    alignItems: 'flex-start',
  },
});

const compareSx = theme => ({
  position: 'relative',
  textTransform: 'unset',
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
    '& .react-diff-1klnsbn-empty-gutter': {
      display: 'none',
    },
  },
});

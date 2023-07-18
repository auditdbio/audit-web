import React, { useMemo, useRef, useState, useEffect } from 'react';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import { Avatar, Box, Button, Typography, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, Link } from 'react-router-dom/dist';
import TagsList from '../components/tagsList.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  acceptAudit,
  confirmAudit,
  deleteAudit,
  deleteAuditRequest,
} from '../redux/actions/auditAction.js';
import {
  CUSTOMER,
  DONE,
  IN_PROGRESS,
  PENDING,
  RESOLVED,
  SUBMITED,
  WAITING_FOR_AUDITS,
} from '../redux/actions/types.js';
import dayjs from 'dayjs';
import Markdown from '../components/markdown/Markdown.jsx';
import { ASSET_URL } from '../services/urls.js';
import { addTestsLabel } from '../lib/helper.js';
import { handleOpenReport } from '../lib/openReport.js';
import { getIssues } from '../redux/actions/issueAction.js';

const AuditInfo = ({ audit, auditRequest, issues }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showFull, setShowFull] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const descriptionRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (descriptionRef?.current?.offsetHeight > 400) {
        setShowReadMoreButton(true);
      }
    }, 500);
  }, [descriptionRef.current]);

  const handleConfirm = () => {
    dispatch(confirmAudit(audit));
  };

  const handleDecline = () => {
    if (audit?.status) {
      dispatch(deleteAudit(audit.id));
    } else {
      dispatch(deleteAuditRequest(audit.id));
    }
  };

  const handleAcceptAudit = () => {
    dispatch(
      acceptAudit({
        id: audit.id,
        report: audit.report,
        status: SUBMITED,
      }),
    );
  };

  const goToIssues = () => {
    navigate(`/issues/audit-issue/${audit?.id}`);
  };

  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Button
          sx={backButtonSx}
          onClick={() => {
            navigate('/profile/audits');
          }}
          aria-label="Go back"
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon />
        </Button>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Typography sx={{ width: '100%', textAlign: 'center' }}>
            You have offer to audit for{' '}
            <span style={{ fontWeight: 500, wordBreak: 'break-word' }}>
              <Link
                style={{ color: '#000' }}
                to={`/projects/${audit.project_id}`}
              >
                {audit?.project_name}
              </Link>
            </span>{' '}
            project!
          </Typography>
        </Box>
        <Box sx={{ maxWidth: '100%' }}>
          <Box sx={contentWrapper}>
            <Box sx={userWrapper}>
              <Avatar
                src={audit?.avatar ? `${ASSET_URL}/${audit?.avatar}` : ''}
                alt="auditor photo"
              />
              <Box sx={{ display: 'grid' }}>
                <Tooltip
                  title={audit?.auditor_first_name}
                  arrow
                  placement={'top'}
                >
                  <Typography noWrap={true} sx={userNameWrapper}>
                    {audit?.auditor_first_name}
                  </Typography>
                </Tooltip>
                <Tooltip
                  title={audit?.auditor_last_name}
                  arrow
                  placement={'top'}
                >
                  <Typography noWrap={true} sx={userNameWrapper}>
                    {audit?.auditor_last_name}
                  </Typography>
                </Tooltip>
              </Box>
            </Box>
            <Box sx={userInfoWrapper}>
              <Box sx={infoWrapper}>
                <span>E-mail</span>
                <Box sx={{ display: 'grid' }}>
                  {audit?.auditor_contacts?.email !== null ? (
                    <Tooltip
                      title={audit?.auditor_contacts?.email}
                      arrow
                      placement={'top'}
                    >
                      <Typography noWrap={true}>
                        {audit?.auditor_contacts?.email}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography noWrap={true}>Hidden</Typography>
                  )}
                </Box>
              </Box>
              <Box sx={infoWrapper}>
                <span>Telegram</span>
                <Box sx={{ display: 'grid' }}>
                  {audit?.auditor_contacts?.telegram !== null ? (
                    <Tooltip
                      title={audit?.auditor_contacts?.telegram}
                      arrow
                      placement={'top'}
                    >
                      <Typography noWrap={true}>
                        {audit?.auditor_contacts?.telegram}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography noWrap={true}>Hidden</Typography>
                  )}
                </Box>
              </Box>
              <Box sx={infoWrapper}>
                <span>Price:</span>
                <Typography>${audit?.price} per line</Typography>
              </Box>
            </Box>
            <Box sx={projectWrapper}>
              <Typography>Time for project</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Box sx={dateWrapper}>
                  {dayjs(audit?.time?.from).format('DD.MM.YYYY')}
                </Box>
                -
                <Box sx={dateWrapper}>
                  {dayjs(audit?.time?.to).format('DD.MM.YYYY')}
                </Box>
              </Box>
              <TagsList />
            </Box>
          </Box>

          <Box sx={descriptionSx(showFull)}>
            <Box ref={descriptionRef}>
              <Markdown value={audit?.description} />
            </Box>
          </Box>
          {showReadMoreButton && (
            <Button onClick={() => setShowFull(!showFull)} sx={readAllButton}>
              {showFull ? 'Hide ▲' : `Read all ▼`}
            </Button>
          )}
        </Box>
        <Box>
          {(audit?.status?.toLowerCase() === RESOLVED.toLowerCase() ||
            audit?.report ||
            audit?.report_name) && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant={'contained'}
                color={'secondary'}
                onClick={() => handleOpenReport(audit)}
                sx={[buttonSx, { marginBottom: '20px' }]}
                {...addTestsLabel('report-button')}
              >
                Download Report
              </Button>
            </Box>
          )}
          {auditRequest && (
            <Button
              variant={'contained'}
              sx={buttonSx}
              disabled={audit?.last_changer?.toLowerCase() === CUSTOMER}
              onClick={handleConfirm}
              {...addTestsLabel('accept-button')}
            >
              Accept
            </Button>
          )}
          {audit?.status !== SUBMITED && audit?.status === DONE && (
            <Button
              variant={'contained'}
              sx={buttonSx}
              onClick={handleAcceptAudit}
              {...addTestsLabel('confirm-button')}
            >
              Confirm
            </Button>
          )}
          {!audit?.status && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDecline}
              sx={buttonSx}
              {...addTestsLabel('decline-button')}
            >
              Decline
            </Button>
          )}

          {/*{(audit?.status === DONE ||*/}
          {/*  audit?.status === SUBMITED ||*/}
          {/*  audit?.status === PENDING) && (*/}
          {audit?.status &&
            !!issues?.length &&
            audit?.status?.toLowerCase() !==
              WAITING_FOR_AUDITS.toLowerCase() && (
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={goToIssues}
                sx={buttonSx}
                {...addTestsLabel('issues-button')}
              >
                Issues ({issues?.length})
              </Button>
            )}
          {/*)}*/}
        </Box>
      </CustomCard>
    </Layout>
  );
};

export default AuditInfo;

const wrapper = theme => ({
  padding: '48px 74px 80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '80px',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    padding: '38px 44px 60px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '40px',
    padding: '38px 20px 30px',
  },
});

const userNameWrapper = theme => ({
  maxWidth: '190px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'unset',
  },
});

const backButtonSx = theme => ({
  position: 'absolute',
  left: 0,
  top: '10px',
  [theme.breakpoints.down('md')]: {
    minWidth: 'unset',
    top: 0,
  },
});

const contentWrapper = theme => ({
  display: 'flex',
  gap: '70px',
  alignItems: 'center',
  mb: '30px',
  [theme.breakpoints.down('md')]: {
    gap: '30px',
    mb: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
    maxWidth: '400px',
    marginX: 'auto',
  },
});

const userWrapper = theme => ({
  '& .MuiAvatar-root': {
    width: '120px',
    height: '120px',
  },
  '& p': {
    color: '#434242',
    fontSize: '15px',
    fontWeight: 500,
    '&:nth-of-type(1)': {
      margin: '13px 0 18px',
    },
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiAvatar-root': {
      width: '90px',
      height: '90px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '20px',
    '& p': {
      color: '#434242',
      fontSize: '15px',
      fontWeight: 500,
      '&:nth-of-type(1)': {
        margin: '0 0 18px',
      },
    },
  },
});

const userInfoWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
  },
});

const buttonSx = theme => ({
  padding: '19px 0',
  fontSize: '18px',
  textTransform: 'unset',
  fontWeight: 600,
  mr: '15px',
  width: '270px',
  borderRadius: '10px',
  ':last-child': { mr: 0 },
  [theme.breakpoints.down('md')]: {
    width: '210px',
    padding: '11px 0',
  },
  [theme.breakpoints.down('sm')]: {
    width: '170px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '120px',
  },
});

const dateWrapper = theme => ({
  border: '1.5px solid #E5E5E5',
  width: '120px',
  padding: '18px 0',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    width: '110px',
  },
  [theme.breakpoints.down('sm')]: {
    paddingY: '10px',
  },
});

const projectWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
  '& p': {
    color: '#B2B3B3',
    fontSize: '15px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  fontWeight: 500,
  color: '#434242',
  '& p': {
    fontSize: 'inherit',
    maxWidth: '200px',
  },
  '& span': {
    width: '85px',
    marginRight: '30px',
    color: '#B2B3B3',
  },
  fontSize: '15px',
  [theme.breakpoints.down('md')]: {
    '& span': {
      width: '90px',
      marginRight: '20px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& p': {
      maxWidth: '300px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
});

const descriptionSx = full => ({
  maxHeight: full ? 'unset' : '400px',
  overflow: 'hidden',
  border: '2px solid #E5E5E5',
});

const readAllButton = theme => ({
  width: '100%',
  padding: '8px',
  fontWeight: 600,
  fontSize: '21px',
  color: 'black',
  textTransform: 'none',
  lineHeight: '25px',
  background: '#E5E5E5',
  borderRadius: 0,
  boxShadow: '0px -24px 14px -8px rgba(252, 250, 246, 1)',
  ':hover': { background: '#D5D5D5' },
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
    border: 'none',
  },
});

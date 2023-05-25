import React, { useMemo } from 'react';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import { Avatar, Box, Button, Typography, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom/dist';
import TagsList from '../components/tagsList.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  acceptAudit,
  confirmAudit,
  deleteAudit,
  deleteAuditRequest,
} from '../redux/actions/auditAction.js';
import { CUSTOMER, DONE, PENDING, SUBMITED } from '../redux/actions/types.js';
import dayjs from 'dayjs';
import Markdown from '../components/custom/Markdown.jsx';
import { ASSET_URL } from '../services/urls.js';
import { addTestsLabel } from '../lib/helper.js';
import { handleOpenReport } from '../lib/openReport.js';

const AuditInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const auditRequest = useSelector(s =>
    s.audits?.auditRequests?.find(audit => audit.id === id),
  );
  const auditConfirm = useSelector(s =>
    s.audits?.audits?.find(audit => audit.id === id),
  );

  const audit = useMemo(() => {
    if (auditRequest && !auditConfirm) {
      return auditRequest;
    } else {
      return auditConfirm;
    }
  }, [id, auditConfirm, auditRequest]);

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
    navigate(`/issues/audit-issue/${id}`);
  };

  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Button
          sx={backButtonSx}
          onClick={() => navigate(-1)}
          aria-label="Go back"
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon />
        </Button>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Typography sx={{ width: '100%', textAlign: 'center' }}>
            You have offer to audit for{' '}
            <span style={{ fontWeight: 500 }}>{audit?.project_name}</span>{' '}
            project!
          </Typography>
        </Box>
        <Box>
          <Box sx={contentWrapper}>
            <Box sx={userWrapper}>
              <Avatar
                src={audit?.avatar ? `${ASSET_URL}/${audit?.avatar}` : ''}
                alt="auditor photo"
              />
              <Box sx={{ display: 'grid' }}>
                <Tooltip
                  title={audit?.auditor_contacts?.email || 'Hidden'}
                  arrow
                  placement={'top'}
                >
                  <Typography noWrap={true} sx={userNameWrapper}>
                    {audit?.auditor_contacts?.email || 'Hidden'}
                  </Typography>
                </Tooltip>
                <Tooltip
                  title={audit?.auditor_contacts?.telegram || 'Hidden'}
                  arrow
                  placement={'top'}
                >
                  <Typography noWrap={true} sx={userNameWrapper}>
                    {audit?.auditor_contacts?.telegram || 'Hidden'}
                  </Typography>
                </Tooltip>
              </Box>
            </Box>
            <Box sx={userInfoWrapper}>
              <Box sx={infoWrapper}>
                <span>E-mail</span>
                <Box sx={{ display: 'grid' }}>
                  <Tooltip
                    title={audit?.auditor_contacts?.email || 'Hidden'}
                    arrow
                    placement={'top'}
                  >
                    <Typography noWrap={true}>
                      {audit?.auditor_contacts?.email || 'Hidden'}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={infoWrapper}>
                <span>Telegram</span>
                <Box sx={{ display: 'grid' }}>
                  <Tooltip
                    title={audit?.auditor_contacts?.telegram || 'Hidden'}
                    arrow
                    placement={'top'}
                  >
                    <Typography noWrap={true}>
                      {audit?.auditor_contacts?.telegram || 'Hidden'}
                    </Typography>
                  </Tooltip>
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
          <Markdown value={audit?.description} />
          {(audit?.status === DONE || audit?.status === SUBMITED) && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => handleOpenReport(audit)}
                sx={{ margin: '15px auto 0', display: 'block' }}
                {...addTestsLabel('report-button')}
              >
                Report
              </Button>
            </Box>
          )}
        </Box>
        <Box>
          {auditRequest && (
            <Button
              variant={'contained'}
              sx={buttonSx}
              disabled={audit?.last_changer.toLowerCase() === CUSTOMER}
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
          {audit?.status !== SUBMITED && (
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

          {(audit?.status === DONE ||
            audit?.status === SUBMITED ||
            audit?.status === PENDING) && (
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={goToIssues}
              sx={buttonSx}
              {...addTestsLabel('issues-button')}
            >
              Issues ({audit?.issues?.length})
            </Button>
          )}
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
  [theme.breakpoints.down('md')]: {
    gap: '30px',
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
  margin: '0 12px',
  width: '270px',
  borderRadius: '10px',
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

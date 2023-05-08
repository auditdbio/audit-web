import React from 'react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import Currency from './icons/Currency.jsx';
import Star from './icons/Star.jsx';
import theme, { radiusOfComponents } from '../styles/themes.js';
import { AUDITOR, DONE, SUBMITED } from '../redux/actions/types.js';
import { useNavigate } from 'react-router-dom/dist';
import { useSelector } from 'react-redux';

const ProjectCard = ({ type, project }) => {
  const navigate = useNavigate();
  const currentRole = useSelector(s => s.user.user.current_role);

  const handleClick = () => {
    if (type === AUDITOR) {
      navigate(`/audit-request-offer/${project.id}`);
    } else {
      navigate(`/edit-project/${project.id}`);
    }
  };

  const handleMakeCopy = () => {
    navigate(`/edit-project/${project.id}?copy=true`);
  };

  return (
    <Box sx={cardWrapper}>
      <Box sx={cardInnerWrapper}>
        <Tooltip
          title={project.name || project.project_name}
          arrow
          placement={'top'}
        >
          <Typography variant={'h5'} textAlign={'center'} sx={projectNameSx}>
            {project.name || project.project_name}
          </Typography>
        </Tooltip>
        <Tooltip
          title={project?.tags?.map(el => el).join(', ') ?? ''}
          arrow
          placement={'top'}
        >
          <Typography sx={categorySx}>
            {project?.tags?.map(el => el).join(', ') ?? ''}
          </Typography>
        </Tooltip>
        <Box sx={priceWrapper}>
          <Box sx={infoWrapper}>
            <Currency />
            <Typography>{project.price}</Typography>
          </Box>
          <Box sx={infoWrapper}>
            <Star />
            <Typography>150</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 'auto',
          marginBottom: 0,
        }}
      >
        {currentRole === AUDITOR ? (
          <Box sx={statusWrapper}>
            {project.status !== SUBMITED && (
              <>
                {project.status === DONE ? (
                  <Box sx={{ backgroundColor: '#52176D' }} />
                ) : (
                  project.status === 'pending' && (
                    <Box sx={{ backgroundColor: '#FF9900' }} />
                  )
                )}
                {project.status !== 'pending' && project.status !== DONE && (
                  <Box sx={{ backgroundColor: '#09C010' }} />
                )}
              </>
            )}
            <Typography>
              {!project.status
                ? 'Waiting for audit'
                : project.status === DONE
                ? 'Finished'
                : project.status === SUBMITED
                ? 'Submitted'
                : 'In progress'}
            </Typography>
          </Box>
        ) : (
          <Box sx={statusWrapper}>
            {project.status === DONE ? (
              <Box sx={{ backgroundColor: '#FF4444' }} />
            ) : project.publish_options.publish ? (
              <Box sx={{ backgroundColor: '#09C010' }} />
            ) : (
              <Box sx={{ backgroundColor: '#FF9900' }} />
            )}
            <Typography>
              {project.status === DONE
                ? 'Project closed'
                : project.publish_options.publish
                ? 'Published'
                : 'Hidden'}
            </Typography>
          </Box>
        )}
        <Button
          variant={'contained'}
          sx={[editButton, type === 'auditor' ? editAuditor : {}]}
          onClick={handleClick}
        >
          {type === AUDITOR ? 'Submit' : 'Edit'}
        </Button>
        {project.name && (
          <Button sx={copyBtn} onClick={handleMakeCopy}>
            Make a copy
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProjectCard;

const priceWrapper = theme => ({
  display: 'flex',
  gap: '30px',
  mt: '18px',
  [theme.breakpoints.down('md')]: {
    gap: '18px',
  },
  [theme.breakpoints.down('xs')]: {
    mt: '5px',
  },
});

const projectNameSx = theme => ({
  height: '45px',
  overflow: 'hidden',
  wordBreak: 'break-word',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  display: '-webkit-box',
});

const cardInnerWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    alignItems: 'flex-start',
  },
});

const copyBtn = theme => ({
  textTransform: 'none',
  fontSize: '10px',
  mt: '12px',
  [theme.breakpoints.down('xs')]: {
    mt: '5px',
  },
});

const statusWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '15px',
  width: '100%',
  '& p': {
    fontSize: '10px',
    fontWeight: 500,
    color: '#434242',
  },
  '& div': {
    width: '17px',
    height: '17px',
    borderRadius: '50%',
  },
  margin: '40px 0 18px',
  [theme.breakpoints.down('md')]: {
    margin: '25px 0 10px',
  },
  [theme.breakpoints.down('xs')]: {
    marginTop: 0,
    gap: '10px',
    '& div': {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
  },
});

const editButton = theme => ({
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: '25px',
  width: '110px',
  textTransform: 'none',
  borderRadius: '10px',
  gap: '40px',
  padding: '9px 0',
  maxWidth: '170px',
  [theme.breakpoints.down('md')]: {
    width: '100px',
    height: '30px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '11px',
  },
});

const editAuditor = theme => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: '#450e5d',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& p': {
    fontSize: '12px!important',
    marginLeft: '8px',
  },
  [theme.breakpoints.down('xs')]: {
    '& p': {
      fontSize: '10px!important',
    },
    '& svg': {
      width: '10px',
      height: '10px',
    },
  },
});

const categorySx = theme => ({
  textAlign: 'center',
  height: '55px',
  overflow: 'hidden',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  display: '-webkit-box',
  fontSize: '12px!important',
  fontWeight: 500,
  color: '#434242',
  margin: '10px 0 7px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px!important',
    textAlign: 'left',
    height: '40px',
  },
});

const cardWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 30px 24px',
  height: '100%',
  boxShadow:
    '0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07),' +
    ' 0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275),' +
    '0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), ' +
    '0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), ' +
    '0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)',
  borderRadius: '25px',
  border: '1px solid rgba(67, 66, 66, 0.1)',
  alignItems: 'center',
  '& h5': {
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: '22px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '24px 22px 24px',
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '40px',
    padding: '15px 20px',
    '& h5': {
      fontSize: '14px',
      fontWeight: 500,
    },
  },
  [theme.breakpoints.down(420)]: {
    gap: '10px',
  },
});

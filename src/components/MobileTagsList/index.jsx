import React, { useEffect, useRef, useState } from 'react';
import theme from '../../styles/themes.js';
import Tooltip from '@mui/material/Tooltip';
import { Box, Button, Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear.js';
import { useSelector } from 'react-redux';
import { AUDITOR } from '../../redux/actions/types.js';

const MobileTagsList = ({ data }) => {
  const [showMore, setShowMore] = useState(false);
  const containerRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const currentRole = useSelector(state => state.user.user.current_role);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    const containerHeight = containerRef.current.clientHeight;
    const itemsHeight = containerRef.current.firstChild.clientHeight;
    if (itemsHeight > containerHeight) {
      setShowButton(true);
    }
  }, [data]);

  return (
    <>
      <Box
        ref={containerRef}
        className={'mobile-tag-wrapper'}
        sx={{ height: showMore ? '100%' : '150px', overflow: 'hidden' }}
      >
        <Box className={'tagsWrapper'} sx={[tagsWrapper]}>
          {data?.map((tag, idx) => (
            <Tooltip key={idx} title={tag} arrow placement={'top'}>
              <Chip sx={chipStyle} label={tag} variant="outlined" />
            </Tooltip>
          ))}
        </Box>
      </Box>
      {showButton && (
        <Button
          onClick={handleShowMore}
          color={currentRole === AUDITOR ? 'secondary' : 'primary'}
          sx={showMoreSx}
        >
          {showMore ? 'Hide' : 'Show More'}
        </Button>
      )}
    </>
  );
};

export default MobileTagsList;

const chipStyle = theme => ({
  border: '2px solid #E5E5E5',
  borderRadius: '5px',
  color: '#434242',
  marginBottom: '10px',
  marginRight: '10px',
  fontWeight: 500,
  height: '24px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '7px',
    border: '1px solid #E5E5E5',
    height: '16px',
  },
});

const tagsWrapper = theme => ({
  overflow: 'hidden',
  transition: 'height 0.3s ease-in-out',
});

const showMoreSx = theme => ({
  fontSize: '10px',
  textTransform: 'none',
  marginRight: 0,
  marginLeft: 'auto',
});

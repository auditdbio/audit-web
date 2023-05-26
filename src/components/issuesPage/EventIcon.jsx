import React from 'react';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications.js';
import InfoIcon from '@mui/icons-material/Info';
import PlaylistAddCircleIcon from '@mui/icons-material/PlaylistAddCircle';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

const EventIcon = ({ kind }) => {
  const iconProps = {
    fontSize: 'large',
    color: 'default',
    sx: { backgroundColor: '#fcfaf6' },
  };

  if (kind === 'IssueName') return <InfoIcon {...iconProps} />;

  if (kind === 'IssueSeverity') return <FlagCircleIcon {...iconProps} />;

  if (kind === 'IssueLink') return <OfflineBoltIcon {...iconProps} />;

  if (kind === 'IssueDescription')
    return <PlaylistAddCircleIcon {...iconProps} />;

  if (kind === 'IssueCategory')
    return <SwapHorizontalCircleIcon {...iconProps} />;

  if (kind === 'StatusChange')
    return <CircleNotificationsIcon {...iconProps} />;

  return <CircleNotificationsIcon {...iconProps} />;
};

export default EventIcon;

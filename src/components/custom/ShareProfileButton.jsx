import React, { useRef, useState } from 'react';
import { AUDITOR } from '../../redux/actions/types.js';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded.js';
import { Button } from '@mui/material';
import { BASE_URL } from '../../services/urls.js';
import ClipboardJS from 'clipboard';

const ShareProfileButton = ({ role, userId, sx, isModal, isPublic }) => {
  const buttonRef = useRef(null);
  const [tooltipText, setTooltipText] = useState(null);

  const getProfileUrl = () => {
    return `${BASE_URL}${role[0]}/${userId}`;
  };

  const handleShare = e => {
    e.preventDefault();

    const buffer = getProfileUrl();
    const options = {
      text: () => buffer,
    };

    if (isModal) {
      options.container = document.querySelector('.auditor-modal');
    }

    const clipboard = new ClipboardJS(buttonRef.current, options);

    clipboard.on('success', () => {
      setTooltipText('Copied');
      clipboard.destroy();
      setTimeout(() => {
        setTooltipText(null);
      }, 1500);
    });

    clipboard.on('error', () => {
      console.error('Failed to copy URL to clipboard.');
      clipboard.destroy();
    });

    clipboard.onClick(event);
  };

  return (
    <Button
      sx={[shareBtn, sx]}
      color={role === AUDITOR ? 'secondary' : 'primary'}
      onClick={handleShare}
      ref={buttonRef}
      href={getProfileUrl()}
    >
      {!tooltipText ? (
        <>
          <LaunchRoundedIcon size="small" sx={{ marginRight: '5px' }} />
          {isPublic ? 'Share profile' : 'Share my profile'}
        </>
      ) : (
        tooltipText
      )}
    </Button>
  );
};

export default ShareProfileButton;

const shareBtn = {
  textTransform: 'capitalize',
};

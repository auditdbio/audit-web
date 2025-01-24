import React, { useRef, useState } from 'react';
import ClipboardJS from 'clipboard';
import { Button, Tooltip } from '@mui/material';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded.js';
import { addTestsLabel } from '../../lib/helper.js';
import { BASE_URL } from '../../services/urls.js';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ShareProjectButton = ({
  projectId,
  showIcon = false,
  sx = {},
  showText = false,
  isModal = false,
}) => {
  const [text, setText] = useState('Share the Project');
  const [hideIcon, setHideIcon] = useState(false);
  const buttonRef = useRef(null);
  const [successCopied, setSuccessCopied] = useState(false);

  const handleShare = () => {
    const buffer = `${BASE_URL}project/${projectId}`;
    const options = {
      text: () => buffer,
    };
    if (isModal) {
      options.container = document.querySelector('.audit-request-wrapper');
    }

    const clipboard = new ClipboardJS(buttonRef.current, options);
    clipboard.on('success', a => {
      setText('Link copied');
      setSuccessCopied(true);
      setHideIcon(true);
      clipboard.destroy();
      setTimeout(() => {
        setText('Share the Project');
        setSuccessCopied(false);
        setHideIcon(false);
      }, 2000);
    });

    clipboard.on('error', () => {
      console.error('Failed to copy URL to clipboard.');
      clipboard.destroy();
    });

    clipboard.onClick(event);
  };

  return (
    <>
      {showIcon && !showText ? (
        <Tooltip
          arrow
          placement={'top'}
          title={successCopied ? 'Link copied' : 'Share project'}
        >
          <Button
            sx={[buttonSx, sx]}
            onClick={handleShare}
            ref={buttonRef}
            className={'share-button'}
            {...addTestsLabel('share-button')}
          >
            {successCopied ? (
              <CheckCircleOutlineIcon sx={{ marginRight: '5px' }} />
            ) : (
              <LaunchRoundedIcon sx={{ marginRight: '5px' }} />
            )}
          </Button>
        </Tooltip>
      ) : (
        <Button
          sx={[buttonSx, sx]}
          onClick={handleShare}
          ref={buttonRef}
          className={'share-button'}
          {...addTestsLabel('share-button')}
        >
          {showText && text}
        </Button>
      )}
    </>
  );
};

export default ShareProjectButton;

const buttonSx = theme => ({
  textTransform: 'none',
  fontSize: '10px',
  padding: 'unset',
  minWidth: 'unset',
  '& svg': {
    width: '40px',
    height: '40px',
  },
});

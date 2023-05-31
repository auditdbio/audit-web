import React, { useEffect, useRef, useState } from 'react';
import { Box, Tooltip, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';
import LinkIcon from '@mui/icons-material/Link';

const linkShortener = link => {
  const regex = /(^https?:\/\/(www\.)?(github\.com\/)?)|(\?.*$)/g;
  return link.replace(regex, '');
};

const CustomLink = ({ link }) => {
  const linkBoxRef = useRef();
  const [isNotFit, setIsNotFit] = useState(false);

  useEffect(() => {
    const boxWidth = linkBoxRef.current?.offsetWidth;
    const linkElement = linkBoxRef.current?.querySelector('a');
    const linkWidth = linkElement?.offsetWidth;

    if (linkWidth === boxWidth) setIsNotFit(true);
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Tooltip title={link} arrow placement="top">
        <Typography noWrap={true} sx={linkBoxSx} ref={linkBoxRef}>
          {/^https?:\/\/(www\.)?github\.com/.test(link) ? (
            <GitHubIcon sx={{ mr: '8px' }} />
          ) : (
            <LinkIcon sx={{ mr: '8px' }} />
          )}
          <Link
            href={/^https?:\/\//.test(link) ? link : `https://${link}`}
            target="_blank"
            sx={[linkSx, isNotFit && { maxWidth: '90%' }]}
          >
            <span>{linkShortener(link)}</span>
            {isNotFit && <span>{linkShortener(link)}</span>}
          </Link>
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default CustomLink;

const linkBoxSx = {
  mb: '10px',
  maxWidth: '100%',
};

const linkSx = {
  color: '#152BEA',
  textDecoration: 'none',
  display: 'flex',
  maxWidth: '100%',
  '& span': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:nth-child(2)': {
      textOverflow: 'clip',
      direction: 'rtl',
    },
  },
};

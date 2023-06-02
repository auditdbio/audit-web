import React, { useEffect, useRef, useState } from 'react';
import { Box, Tooltip, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';
import LinkIcon from '@mui/icons-material/Link';

const linkShortener = link => {
  const regex = /(^https?:\/\/(www\.)?(github\.com\/)?)|(\?.*$)/g;
  return link.replace(regex, '');
};

const CustomLink = ({ link, showIcon = true, sx = {} }) => {
  const linkBoxRef = useRef();
  const [isNotFit, setIsNotFit] = useState(false);
  const [shortLink, setShortLink] = useState(() => linkShortener(link));

  useEffect(() => {
    const boxWidth = linkBoxRef.current?.offsetWidth;
    const linkElement = linkBoxRef.current?.querySelector('a');
    const linkWidth = linkElement?.offsetWidth;

    if (linkWidth >= boxWidth - 40) setIsNotFit(true);
  }, []);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Tooltip title={link} arrow placement="top">
        <Typography noWrap={true} sx={linkBoxSx} ref={linkBoxRef}>
          {showIcon &&
            (/^https?:\/\/(www\.)?github\.com/.test(link) ? (
              <GitHubIcon sx={{ mr: '8px' }} />
            ) : (
              <LinkIcon sx={{ mr: '8px' }} />
            ))}
          <Link
            href={/^https?:\/\//.test(link) ? link : `https://${link}`}
            target="_blank"
            sx={[linkSx, isNotFit && { maxWidth: '90%' }, sx]}
          >
            <span>
              {isNotFit ? shortLink.slice(0, shortLink.length / 2) : shortLink}
            </span>
            {isNotFit && <span>{shortLink.slice(shortLink.length / 2)}</span>}
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

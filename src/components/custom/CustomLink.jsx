import React, { useEffect, useRef, useState } from 'react';
import { Box, Tooltip, Typography, Link, useMediaQuery } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';
import LinkIcon from '@mui/icons-material/Link';
import theme from '../../styles/themes.js';

const linkShortener = (link, shortLinkLength) => {
  const regex = /(^https?:\/\/(www\.)?(github\.com\/)?)|(\?.*$)/g;
  const shortLink = link.replace(regex, '');
  if (shortLinkLength) {
    return (
      shortLink
        .slice(0, shortLinkLength - 1)
        .replace(/(?<=[\/\-_.])[^\/\-_.]*$/, '') +
      '…' +
      shortLink.slice(-shortLinkLength)
    );
  }
  return shortLink;
};

const CustomLink = ({ link, showIcon = true, sx = {} }) => {
  const linkBoxRef = useRef();
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [shortLinkLength, setShortLinkLength] = useState(null);

  useEffect(() => {
    const boxWidth = linkBoxRef.current?.offsetWidth;
    const linkElement = linkBoxRef.current?.querySelector('span');
    const linkWidth = linkElement?.offsetWidth;
    const charWidth = matchSm ? 8.25 : 10;

    if (linkWidth >= boxWidth) {
      const charsCount = Math.trunc(boxWidth / charWidth / 2);
      setShortLinkLength(charsCount);
    }
  }, [matchSm]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Tooltip title={link} arrow placement="top">
        <Typography noWrap={true} sx={linkBoxSx}>
          {showIcon &&
            (/^https?:\/\/(www\.)?github\.com/.test(link) ? (
              <GitHubIcon sx={{ mr: '8px' }} />
            ) : (
              <LinkIcon sx={{ mr: '8px' }} />
            ))}
          <Link
            href={/^https?:\/\//.test(link) ? link : `https://${link}`}
            target="_blank"
            sx={[linkSx, sx]}
            ref={linkBoxRef}
          >
            <span>{linkShortener(link, shortLinkLength)}</span>
          </Link>
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default CustomLink;

const linkBoxSx = {
  mb: '10px',
  width: '100%',
};

const linkSx = {
  fontFamily: 'monospace',
  fontWeight: 400,
  color: '#152BEA',
  textDecoration: 'none',
  display: 'flex',
  width: '100%',
  overflow: 'hidden',
};

import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../styles/themes.js';
import { FieldArray, useField } from 'formik';
import React from 'react';
import CustomLink from './CustomLink.jsx';

export const ProjectLinksList = ({ name }) => {
  const [field, meta] = useField(name);

  return (
    <Box>
      {meta.error && (
        <Typography
          variant={'body1'}
          sx={{ color: `${theme.palette.error.main}!important` }}
        >
          Links required
        </Typography>
      )}

      <FieldArray
        name={name}
        render={arrayHelper =>
          field.value?.map((link, idx) => {
            return (
              <Box key={idx} sx={linkWrapper}>
                <CustomLink
                  link={link}
                  showIcon={false}
                  sx={{ fontSize: '18px' }}
                />

                <IconButton
                  sx={{ padding: '5px' }}
                  onClick={() => arrayHelper.remove(idx)}
                >
                  <CloseIcon
                    sx={{
                      height: '18px',
                      width: '18px',
                    }}
                  />
                </IconButton>
              </Box>
            );
          })
        }
      />
    </Box>
  );
};

const linkWrapper = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  '& > div': { width: '90%' },
  '& p': {
    mb: 0,
    width: '100%',
    lineHeight: 1,
    '& a': {
      maxWidth: '100%',
      textDecoration: 'underline',
    },
  },
};

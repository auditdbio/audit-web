import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../styles/themes.js';
import { FieldArray, useField } from 'formik';
import React from 'react';
import CustomLink from './CustomLink.jsx';
import { SCOPE_GIT_BLOCK, SCOPE_LINKS } from '../../services/constants.js';

export const ProjectLinksList = ({ name, handleSubmit }) => {
  const [field, meta, helper] = useField(name);

  const handleRemove = idx => {
    const { value } = field;
    let updatedScope;

    if (value?.type === SCOPE_GIT_BLOCK) {
      updatedScope = {
        ...value,
        content: {
          ...value.content,
          files: value.content.files.filter((_, i) => i !== idx),
        },
      };
    } else if (value?.type === SCOPE_LINKS) {
      updatedScope = {
        ...value,
        content: value.content.filter((_, i) => i !== idx),
      };
    } else {
      updatedScope = value.filter((_, i) => i !== idx);
    }

    helper.setValue(updatedScope);
    if (handleSubmit) handleSubmit();
  };

  return (
    <Box>
      {meta.touched && meta.error && (
        <Typography
          variant={'body1'}
          sx={{
            color: `${theme.palette.error.main}!important`,
            fontSize: '16px',
          }}
        >
          Links required
        </Typography>
      )}

      <FieldArray
        name={name}
        render={() => {
          const scope =
            field.value?.type === SCOPE_GIT_BLOCK
              ? field.value.content?.files?.map(file => file.display_url)
              : field.value?.type === SCOPE_LINKS
              ? field.value.content
              : field.value;

          return scope?.map((link, idx) => {
            return (
              <Box key={idx} sx={linkWrapper}>
                <CustomLink
                  isGithub={field.value?.type === SCOPE_GIT_BLOCK}
                  link={link}
                  showIcon={false}
                  sx={linkSx}
                />

                <IconButton
                  sx={{ padding: '5px' }}
                  onClick={() => handleRemove(idx)}
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
          });
        }}
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

const linkSx = theme => ({
  fontSize: '18px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
  },
});

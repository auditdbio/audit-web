import React from 'react';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear.js';
import { FieldArray, useField } from 'formik';
import theme from '../../styles/themes.js';

const TagsArray = ({ name }) => {
  const [field, meta] = useField(name);

  return (
    <Box
      sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}
      className="tags-array-wrapper"
    >
      {meta.touched && meta.error && (
        <Typography
          variant="body1"
          sx={{
            color: `${theme.palette.error.main}!important`,
            fontSize: '16px',
          }}
        >
          Tags required
        </Typography>
      )}
      <FieldArray
        name={name}
        render={arrayHelper =>
          field?.value?.map((tag, idx) => {
            return (
              <Tooltip key={idx} title={tag} arrow placement={'top'}>
                <Chip
                  sx={chipSx}
                  label={tag}
                  variant="outlined"
                  onDelete={() => arrayHelper.remove(idx)}
                  deleteIcon={<ClearIcon sx={iconSx} />}
                />
              </Tooltip>
            );
          })
        }
      />
    </Box>
  );
};

export default TagsArray;

const iconSx = theme => ({
  width: '15px',
  height: '15px',
  '& path': {
    fill: '#52176D',
  },
});

const chipSx = theme => ({
  border: '2px solid #E5E5E5',
  borderRadius: '5px',
  color: '#434242',
  fontWeight: 500,
  '& span': {
    maxWidth: '200px',
  },
});

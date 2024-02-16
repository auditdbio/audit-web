import React from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';

const CustomTextarea = styled(TextareaAutosize)({
  width: '100%',
  height: '54px !important',
  fontFamily: '"Montserrat", sans-serif',
  fontSize: '18px',
  fontWeight: '500',
  lineHeight: '1.5',
  padding: '12px',
  border: 'none',
  borderTop: '2px solid #e5e5e5',
  resize: 'none',
  '&:focus': {
    boxShadow: 'none',
    outline: 'none',
  },
});

export default CustomTextarea;
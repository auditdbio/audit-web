import React from 'react';
import { Box } from '@mui/system';

const ListBoxItem = ({ listInnerRef, handleScroll, children, ...props }) => {
  return (
    <Box
      {...props}
      ref={listInnerRef}
      sx={{ overflowY: 'auto' }}
      onScroll={e => handleScroll(e, children)}
    >
      {children}
    </Box>
  );
};

export default ListBoxItem;

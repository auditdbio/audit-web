import React from 'react';
import { Box, Pagination } from '@mui/material';

const CustomPagination = ({
  show = true,
  count,
  onChange,
  sx,
  page = 1,
  color = 'secondary',
  showFirstLast = true,
  ...props
}) => {
  return (
    <>
      {show && (
        <Box sx={sx}>
          <Pagination
            count={count}
            page={page}
            onChange={onChange}
            color={color}
            variant="outlined"
            shape="rounded"
            showFirstButton={showFirstLast}
            showLastButton={showFirstLast}
            {...props}
          />
        </Box>
      )}
    </>
  );
};

export default CustomPagination;

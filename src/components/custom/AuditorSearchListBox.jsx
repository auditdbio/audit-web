import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const CreateProjectCard = ({ name, status, id }) => {
  return (
    <Box>
      <Typography>
          {name}
      </Typography>
        {/*<Typography>*/}
        {/*    {name}*/}
        {/*</Typography>*/}
    </Box>
  );
};
export default CreateProjectCard;

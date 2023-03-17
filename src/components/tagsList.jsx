import React from "react";
import { Box, Chip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear.js";
import { FieldArray, useField } from "formik";

const TagsList = ({ data }) => {
  return (
    <Box className={"tagsWrapper"} sx={tagsList}>
      {data?.map((tag, idx) => (
        <Chip
          key={idx}
          sx={chipStyle}
          label={tag}
          variant="outlined"
          deleteIcon={<ClearIcon sx={iconSx} />}
        />
      ))}
    </Box>
  );
};

export default TagsList;

const tagsList = (theme) => ({
  display: "flex",
  flexWrap: "wrap",
  maxWidth: "500px",
  gap: "10px",
  [theme.breakpoints.down("xs")]: {
    gap: "5px",
  },
});

const chipStyle = (theme) => ({
  border: "2px solid #E5E5E5",
  borderRadius: "5px",
  color: "#434242",
  fontWeight: 500,
  [theme.breakpoints.down("xs")]: {
    fontSize: "7px",
    border: "1px solid #E5E5E5",
    height: "16px",
  },
});

const iconSx = (theme) => ({
  width: "15px",
  height: "15px",
  "& path": {
    fill: "#52176D",
  },
});

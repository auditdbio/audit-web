import React from "react";
import { Box, Chip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear.js";

const TagsArray = ({ tags, handleDelete }) => {
  return tags ? (
    <Box sx={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
      {tags.map((tag) => (
        <Chip
          sx={{
            border: "2px solid #E5E5E5",
            borderRadius: "5px",
            color: "#434242",
            fontWeight: 500,
          }}
          label={tag}
          variant="outlined"
          onDelete={() => handleDelete(tag)}
          deleteIcon={<ClearIcon sx={iconSx} />}
        />
      ))}
    </Box>
  ) : (
    <Box sx={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
      <Chip
        sx={{
          border: "2px solid #E5E5E5",
          borderRadius: "5px",
          color: "#434242",
          fontWeight: 500,
        }}
        label={"java"}
        variant="outlined"
        onDelete={() => console.log(11)}
        deleteIcon={<ClearIcon sx={iconSx} />}
      />
      <Chip
        sx={{
          border: "2px solid #E5E5E5",
          borderRadius: "5px",
          color: "#434242",
          fontWeight: 500,
        }}
        label={"piton"}
        variant="outlined"
        onDelete={() => console.log(11)}
        deleteIcon={<ClearIcon sx={iconSx} />}
      />
      <Chip
        sx={{
          border: "2px solid #E5E5E5",
          borderRadius: "5px",
          color: "#434242",
          fontWeight: 500,
        }}
        label={"java"}
        variant="outlined"
        onDelete={() => console.log(11)}
        deleteIcon={<ClearIcon sx={iconSx} />}
      />
    </Box>
  );
};

export default TagsArray;

const iconSx = (theme) => ({
  width: "15px",
  height: "15px",
  "& path": {
    fill: "#52176D",
  },
});

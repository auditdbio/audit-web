import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear.js";
import { FieldArray, useField } from "formik";
import theme from "../../styles/themes.js";

const TagsArray = ({ name }) => {
  const [field, meta] = useField(name);

  return (
    <Box sx={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
      {meta.error && (
        <Typography
          variant={"body1"}
          sx={{ color: `${theme.palette.error.main}!important` }}
        >
          Tags required
        </Typography>
      )}
      <FieldArray
        name={name}
        render={(arrayHelper) =>
          field?.value?.map((tag, idx) => {
            return (
              <Chip
                key={idx}
                sx={{
                  border: "2px solid #E5E5E5",
                  borderRadius: "5px",
                  color: "#434242",
                  fontWeight: 500,
                }}
                label={tag}
                variant="outlined"
                onDelete={() => arrayHelper.remove(idx)}
                deleteIcon={<ClearIcon sx={iconSx} />}
              />
            );
          })
        }
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

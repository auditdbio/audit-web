import React, { useState } from "react";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import { Field } from "formik";
import { TextField } from "formik-mui";
import AddLinkIcon from "@mui/icons-material/AddLink";

const IconField = ({ name, label, array, handleAdd }) => {
  const [text, setText] = useState("");

  const onClick = () => {
    if (text && !array.includes(text)) {
      handleAdd(text);
      console.log(array);
    }
    setText("");
  };
  return (
    <Box sx={wrapper} className={"field-wrapper"}>
      <Typography variant={"body2"} sx={formLabelSx}>
        {label}
      </Typography>
      <Field
        component={TextField}
        name={name}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        placeholder={"● ● ● ● ● ● ●"}
        fullWidth={true}
        disabled={false}
        sx={fieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="add" onClick={onClick}>
                <AddLinkIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default IconField;

const wrapper = (theme) => ({
  display: "flex",
  gap: "28px",
  flexDirection: "column",
  "& p.Mui-error": {
    display: "none",
  },
});

const formLabelSx = (theme) => ({
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "24px",
  color: "#434242",
  [theme.breakpoints.down("lg")]: {
    fontSize: "14px",
  },
});

const fieldSx = (theme) => ({
  "& input": {
    paddingLeft: "35px",
  },
});

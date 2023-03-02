import React from "react";
import { Box, Typography } from "@mui/material";
import { Field } from "formik";
import { TextField } from "formik-mui";

const DescriptionField = ({ name, label }) => {
    return (
        <Box sx={wrapper} className={"field-wrapper"}>
            <Typography variant={"body2"} sx={formLabelSx}>
                {label}
            </Typography>
            <Field
                component={TextField}
                rows="9"
                // maxRows = "9"
                multiline
                name={name}
                placeholder={"● ● ● ● ● ● ●"}
                fullWidth={true}
                disabled={false}
                sx={fieldSx}
            />
        </Box>
    );
};

export default DescriptionField;

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
    // height: "230px",
});
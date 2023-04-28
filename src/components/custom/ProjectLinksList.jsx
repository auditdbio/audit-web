import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../styles/themes.js";
import {FieldArray, useField} from "formik";
import React, {useState} from "react";

export const ProjectLinksList = ({name}) => {
    const [field, meta] = useField(name);

    return (
        <Box
            sx={{
                // display: "flex",
                flexDirection: "column",
            }}
        >
            {meta.error && (
                <Typography
                    variant={"body1"}
                    sx={{color: `${theme.palette.error.main}!important`}}
                >
                    Links required
                </Typography>
            )}
            <FieldArray
                name={name}
                render={(arrayHelper) =>
                    field.value?.map((link, idx) => {
                        return (
                            <Box
                                key={idx}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <a href={link} target="_blank">
                                    <Tooltip
                                        key={idx}
                                        title={link}
                                        arrow placement={'top'}>
                                        <Typography variant="body2" sx={linkStyle}>
                                            {link}
                                        </Typography>
                                    </Tooltip>
                                </a>

                                <IconButton
                                    sx={{padding: "5px"}}
                                    onClick={() => arrayHelper.remove(idx)}
                                >
                                    <CloseIcon
                                        sx={{
                                            height: "18px",
                                            width: "18px",
                                        }}
                                    />
                                </IconButton>
                            </Box>
                        );
                    })
                }
            />
        </Box>
    );
};

const linkStyle = {
    whiteSpace: "nowrap",
    [theme.breakpoints.down("md")]: {
        width: "250px",
    },
    [theme.breakpoints.down("sm")]: {
        width: "200px",
    },
    width: "300px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    fontSize: "18px",
    color: "#152BEA",
    textDecoration: "underline",
};

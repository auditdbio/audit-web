import React, {useState} from 'react';
import {Box, Typography} from "@mui/material";
import MarkdownEditor from "@uiw/react-markdown-editor";
import {useField} from "formik";



const Markdown = ({name}) => {
    const [markdownField, ,markdownHelper] = useField(name);

    return (
        <Box data-color-mode="light" sx={wrapper}>
            <MarkdownEditor
                toolbars={[]}
                height={'300px'}
                enableScroll={false}
                previewWidth={'50%'}
                value={markdownField.value}
                onChange={(value) => {
                    markdownHelper.setValue(value);
                }}
            />
        </Box>
    );
};

export default Markdown;

const wrapper = (theme) => ({
    display: "flex",
    gap: "16px",
    flexDirection: "column",
    "& p.Mui-error": {
        display: "none",
    },
    '& .cm-gutters,.md-editor-toolbar-warp': {
      backgroundColor: '#FCFAF6'
    },
    '& .cm-content': {
        whiteSpace: 'unset',
        wordWrap: 'unset',
        flexShrink: 'unset'
    }
})

const formLabelSx = (theme) => ({
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "24px",
    color: "#434242",
    [theme.breakpoints.down("lg")]: {
        fontSize: "14px",
    },
});
import React, {useState} from 'react';
import {Box} from "@mui/material";
import MarkdownEditor from "@uiw/react-markdown-editor";
import {useField} from "formik";


const Markdown = ({name}) => {
    const [markdownField, , markdownHelper] = useField(name);
    const [width, setWidth] = useState('50%');

    const handleClick = () => {
        if (width === '50%') {
            setWidth('100%');
        } else {
            setWidth('50%');
        }
    }
    const title2 = {
        name: "title2",
        keyCommand: "title2",
        icon: (
              width === '50%' ? <svg onClick={handleClick} width="15" height="15" viewBox="0 0 520 520">
                    <polygon fill="currentColor" points="0 71.293 0 122 38.023
                 123 38.023 398 0 397 0 449.707 91.023 450.413 91.023 72.293"/>
                    <polygon fill="currentColor" points="148.023 72.293 520
                71.293 520 122 200.023 124 200.023 397 520 396 520 449.707 148.023 450.413"/>
                </svg>
                :
                <svg onClick={handleClick} width="15" height="15" viewBox="0 0 520 520">
                    <polygon fill="currentColor"
                     points="0 71.293 0 122 179 122 179 397 0 397 0 449.707 232 449.413 232 71.293"/>
                    <polygon fill="currentColor"
                     points="289 71.293 520 71.293 520 122 341 123 341 396 520 396 520 449.707 289 449.413"/>
                </svg>
    )
}
    return (
        <Box data-color-mode="light" sx={wrapper}>
            <MarkdownEditor
                toolbars={[title2]}
                height={'300px'}
                enableScroll={false}
                previewWidth={width}
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
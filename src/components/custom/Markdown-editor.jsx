import React, {useEffect, useState} from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "katex/dist/katex.min.css";
import markdownItKatex from "markdown-it-katex";
import {Box} from "@mui/material";
import {useField} from "formik";
import hljs from "highlight.js";
import 'highlight.js/styles/github.css';

const mdParser = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            console.log(hljs.getLanguage(lang));
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
        }

        return ''; // use external default escaping
    },
}).use(markdownItKatex);

const Markdown = ({name}) => {
    const [markdownField, , markdownHelper] = useField(name);

    const handleEditorChange = ({ html, text }) => {
        markdownHelper.setValue(text);
    };


    return (
        <Box data-color-mode="light" sx={wrapper}>
            <MdEditor
                value={markdownField.value}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                style={{ height: '300px' }}
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
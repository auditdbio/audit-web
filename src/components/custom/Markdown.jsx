import React from 'react';
import {Box} from "@mui/material";
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/ascetic.css';
import MarkdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";
import ReactMarkdownEditorLite from "react-markdown-editor-lite";

const mdParser = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
        }

        return ''; // use external default escaping
    },
}).use(markdownItKatex);

const config = {
    view: {
        menu: false, // отключаем меню
        md: false, // отключаем редактор
        html: true, // включаем только превью
    },
};

const Markdown = ({value}) => {
    return (
        <Box data-color-mode="light" sx={wrapper}>
            <ReactMarkdownEditorLite
                value={value}
                renderHTML={(text) => mdParser.render(text)}
                view={{ menu: false }}
                config={config}
            />
        </Box>
    );
};

export default Markdown;

const wrapper = (theme) => ({
    '& .rc-md-editor,.rc-md-editor .editor-container>.section': {
        backgroundColor: 'unset',
        border: 'unset',
    }
})
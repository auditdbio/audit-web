import React, { useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import 'katex/dist/katex.min.css';
import markdownItKatex from 'markdown-it-katex';
import { Box } from '@mui/material';
import { useField } from 'formik';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

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

    return '';
  },
}).use(markdownItKatex);

const initialPlugins = [
  'header',
  'font-bold',
  'font-italic',
  'font-underline',
  'font-strikethrough',
  'divider',
  'list-unordered',
  'list-ordered',
  'block-quote',
  'block-wrap',
  'block-code-inline',
  'block-code-block',
  'table',
  'image',
  'link',
  'clear',
  'logger',
  'mode-toggle',
  'full-screen',
  'tab-insert',
];

const Markdown = ({ name, setMdRef, mdProps = {}, plugins = [] }) => {
  const [markdownField, , markdownHelper] = useField(name);
  const mdRef = useRef();

  useEffect(() => {
    plugins.forEach(plugin => MdEditor.use(plugin));
  }, []);

  useEffect(() => {
    if (setMdRef) {
      setMdRef(mdRef);
    }
  }, [mdRef]);

  const handleEditorChange = ({ html, text }) => {
    markdownHelper.setValue(text);
  };

  return (
    <Box data-color-mode="light" sx={wrapper}>
      <MdEditor
        value={markdownField.value}
        renderHTML={text => mdParser.render(text)}
        onChange={handleEditorChange}
        style={{ height: '300px' }}
        ref={mdRef}
        plugins={[...plugins.map(p => p.pluginName), ...initialPlugins]}
        {...mdProps}
      />
    </Box>
  );
};

export default Markdown;

const wrapper = theme => ({
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
  '& > *': {
    wordWrap: 'break-word',
  },
  '& p.Mui-error': {
    display: 'none',
  },
  '& .cm-gutters,.md-editor-toolbar-warp': {
    backgroundColor: '#FCFAF6',
  },
  '& .cm-content': {
    whiteSpace: 'unset',
    wordWrap: 'unset',
    flexShrink: 'unset',
  },
  '& .katex .vlist': {
    verticalAlign: 'unset',
  },
  '& .mbin,.mrel': {
    margin: '0 3px',
  },
});

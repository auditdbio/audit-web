import React, { useEffect, useRef, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import { useField } from 'formik';
import { Box } from '@mui/material';
import 'react-markdown-editor-lite/lib/index.css';
import 'katex/dist/katex.min.css';
import renderHTML from './renderHTML.jsx';
import MarkdownInlineMath from './plugins/MarkdownInlineMath.jsx';
import MarkdownMath from './plugins/MarkdownMath.jsx';
import MarkdownCheckedList from './plugins/MarkdownCheckedList.jsx';
import ImageUploadPlugin from './plugins/ImageUploadPlugin.jsx';

const initialPlugins = [
  'header',
  'font-bold',
  'font-italic',
  'font-strikethrough',
  'divider',
  'list-unordered',
  'list-ordered',
  'list-checked',
  'block-quote',
  'block-wrap',
  'block-code-inline',
  'block-code-block',
  'table',
  'image-upload',
  'link',
  'divider',
  'inline-math',
  'math',
  'divider',
  'clear',
  'logger',
  'mode-toggle',
  'full-screen',
];

const MarkdownEditor = ({
  name,
  saved,
  hideMenu,
  setMdRef,
  mdProps = {},
  plugins = [],
  setFieldTouched,
  handleBlur,
  isPublic,
  fastSave,
  sx,
}) => {
  const [markdownField, meta, markdownHelper] = useField(name);
  const [markdown, setMarkdown] = useState('');
  const mdRef = useRef();

  useEffect(() => {
    MdEditor.use(MarkdownInlineMath);
    MdEditor.use(MarkdownMath);
    MdEditor.use(MarkdownCheckedList);
    MdEditor.use(ImageUploadPlugin);
    plugins.forEach(plugin => MdEditor.use(plugin));
  }, []);

  useEffect(() => {
    setMarkdown(markdownField.value);
    if (handleBlur && meta.touched) {
      handleBlur();
    }
  }, [markdownField.value]);

  useEffect(() => {
    if (markdown && fastSave) {
      markdownHelper.setValue(markdown);
    }
  }, [markdown]);

  useEffect(() => {
    if (setMdRef) {
      setMdRef(mdRef);
    }
  }, [mdRef]);

  const handleEditorChange = ({ text }) => {
    setMarkdown(text);
  };

  const handleEditorBlur = () => {
    markdownHelper.setValue(markdown);
    if (setFieldTouched && !meta.touched) {
      setFieldTouched(name);
    }
  };

  return (
    <Box
      data-color-mode="light"
      className="md-editor-wrapper"
      sx={[
        wrapper,
        {
          border: `1px solid ${
            (handleBlur || isPublic) && meta.touched && !markdownField.value
              ? 'red'
              : 'transparent'
          }`,
        },
        sx,
      ]}
    >
      <MdEditor
        renderHTML={renderHTML}
        value={markdown}
        onChange={handleEditorChange}
        onBlur={handleEditorBlur ? handleEditorBlur : null}
        style={{ height: '400px' }}
        ref={mdRef}
        plugins={[
          ...plugins.map(p => p.pluginName),
          ...(!hideMenu ? initialPlugins : []),
        ]}
        {...mdProps}
      />
    </Box>
  );
};

export default MarkdownEditor;

const wrapper = {
  overflow: 'hidden',
  display: 'flex',
  gap: '5px',
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
  '& .mbin,.mrel': {
    margin: '0 3px',
  },
};

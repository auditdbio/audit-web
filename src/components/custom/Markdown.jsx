import React from 'react';
import {Box} from "@mui/material";
import MarkdownEditor from '@uiw/react-markdown-editor';

const Markdown = ({value}) => {
    return (
        <Box data-color-mode="light" sx={wrapper}>
            <MarkdownEditor.Markdown source={value}/>
        </Box>
    );
};

export default Markdown;

const wrapper = (theme) => ({
    '& .wmde-markdown': {
        backgroundColor: '#FCFAF6'
    }
})
import React from 'react';
import {Box} from "@mui/material";
import MDEditor from '@uiw/react-md-editor';
const Markdown = ({value}) => {
    return (
        <Box data-color-mode="light" sx={wrapper}>
            <MDEditor.Markdown source={value} />
        </Box>
    );
};

export default Markdown;

const wrapper = (theme) => ({
    '& .wmde-markdown': {
        backgroundColor: '#FCFAF6'
    }
})
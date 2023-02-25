import React from 'react';
import {Box, Chip} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear.js";

const TagsArray = () => {
    return (
        <Box>
            <Chip
                sx={{
                    border: '2px solid #E5E5E5',
                    borderRadius: '5px',
                    color: '#434242',
                    fontWeight: 500
                }}
                label={'java'}
                variant="outlined"
                onDelete={() => console.log(11)}
                deleteIcon={<ClearIcon sx={iconSx}/>}
            />
            <Chip
                sx={{
                    border: '2px solid #E5E5E5',
                    borderRadius: '5px',
                    color: '#434242',
                    fontWeight: 500
                }}
                label={'piton'}
                variant="outlined"
                onDelete={() => console.log(11)}
                deleteIcon={<ClearIcon sx={iconSx}/>}
            />
            <Chip
                sx={{
                    border: '2px solid #E5E5E5',
                    borderRadius: '5px',
                    color: '#434242',
                    fontWeight: 500
                }}
                label={'java'}
                variant="outlined"
                onDelete={() => console.log(11)}
                deleteIcon={<ClearIcon sx={iconSx}/>}
            />
            <Chip
                sx={{
                    border: '2px solid #E5E5E5',
                    borderRadius: '5px',
                    color: '#434242',
                    fontWeight: 500
                }}
                label={'react'}
                variant="outlined"
                onDelete={() => console.log(11)}
                deleteIcon={<ClearIcon sx={iconSx}/>}
            />
        </Box>
    );
};

export default TagsArray;

const iconSx = (theme) => ({
    width: '15px',
    height: '15px',
    '& path': {
        fill: '#52176D'
    }
})
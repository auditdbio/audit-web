import React from 'react';
import {Box, Chip} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear.js";
import {FieldArray, useField} from "formik";

const TagsList = ({data}) => {

    return (
        <Box sx={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>

            {
                data?.map((tag, idx) =>
                    <Chip
                        key={idx}
                        sx={{
                            border: '2px solid #E5E5E5',
                            borderRadius: '5px',
                            color: '#434242',
                            fontWeight: 500
                        }}
                        label={tag}
                        variant="outlined"
                        deleteIcon={<ClearIcon sx={iconSx}/>}
                    />
                )
            }
        </Box>
    );
};

export default TagsList;

const iconSx = (theme) => ({
    width: '15px',
    height: '15px',
    '& path': {
        fill: '#52176D'
    }
})
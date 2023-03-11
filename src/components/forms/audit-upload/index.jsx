import React from 'react';
import {Box, Button} from "@mui/material";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined.js";
import {useField} from "formik";
import axios from "axios";

const AuditUpload = ({name}) => {
    const [field, meta, fieldHelper] = useField(name)
    const formData = new FormData();

    const handleUpdateAudit = (e) => {
        formData.append('file', e.target.files[0])
        formData.append('upload_preset', 'gallery')
        axios.post('https://api.cloudinary.com/v1_1/dktewh88s/upload', formData)
            .then(({data}) => fieldHelper.setValue(data.url))
    }
    return (
        <>
            <Box sx={[inputWrapper, meta.error ? {borderColor: '#f44336'} : {}]}>{field?.value}</Box>
            <Button>
                <label htmlFor="audit-upload">
                    <CreateNewFolderOutlinedIcon fontSize={'large'} color={'disabled'}/>
                </label>
            </Button>
            <input id={'audit-upload'}
                   style={{display: 'none'}}
                   onChange={handleUpdateAudit}
                   type="file"
            />
        </>
    );
};

export default AuditUpload;

const inputWrapper = (theme) => ({
    border: '1.43062px solid #E5E5E5',
    width: '400px',
    padding: '15px',
    marginRight: '10px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
        width: '250px',
        overflow: 'hidden',
        whiteSpace: 'noWrap'
    }
})
import React, {useState} from 'react';
import {Alert, AlertTitle, Box, Button, Snackbar, Stack} from "@mui/material";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined.js";
import {useField} from "formik";
import axios from "axios";
import Cookies from "js-cookie";
import {useSelector} from "react-redux";

const AuditUpload = ({name, disabled, auditId, auditorId, customerId}) => {
    const [field, meta, fieldHelper] = useField(name)
    const formData = new FormData()
    const user = useSelector(state => state.user.user)
    const [error, setError] = useState(null)

    const handleUpdateAudit = (e) => {
        const file = e.target.files[0];
        const fileSize = file.size;
        if (fileSize > 10000000) {
           return setError('File size is too large')
        } else {
            formData.append('file', file)
            formData.append('path', user.id + user.current_role + file.name)
            formData.append('original_name', file.name)
            formData.append("private", "true")
            formData.append('audit', auditId)
            formData.append('auditorId', auditorId)
            formData.append('customerId', customerId)
            axios.post('https://dev.auditdb.io/api/files/create', formData, {
                headers: {Authorization: "Bearer " + Cookies.get("token")}
            })
                .then((data) => {
                    fieldHelper.setValue(formData.get('path'))
                    formData.delete('file')
                    formData.delete('path')
                    formData.delete('original_name')
                    formData.delete('private')
                    formData.delete('audit')
                    formData.delete('auditorId')
                    formData.delete('customerId')
                })
                .catch((err) => {
                    setError('Error while uploading file')
                    formData.delete('file')
                    formData.delete('path')
                    formData.delete('original_name')
                    formData.delete('private')
                    formData.delete('audit')
                    formData.delete('auditorId')
                    formData.delete('customerId')
                })
        }
    }
    return (
        <>
            <Box sx={[inputWrapper, meta.error ? {borderColor: '#f44336'} : {}]}>{field?.value}</Box>
            <Snackbar
                autoHideDuration={10000}
                open={!!error}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                onClose={() => {
                    setError(null)
                }}
            >
                <Stack sx={{ width: '100%', flexDirection: 'column', gap: 2 }} spacing={2}>
                    <Alert severity='error'>
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                </Stack>
            </Snackbar>
            <Button disabled={disabled}>
                <label htmlFor="audit-upload">
                    <CreateNewFolderOutlinedIcon fontSize={'large'} color={'disabled'}/>
                </label>
            </Button>
            <input id={'audit-upload'}
                   style={{display: 'none'}}
                   accept="application/pdf"
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
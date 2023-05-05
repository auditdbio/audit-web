import React, {useState} from 'react';
import {Box, Button} from "@mui/material";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined.js";
import {useField} from "formik";
import axios from "axios";
import Cookies from "js-cookie";
import {useSelector} from "react-redux";
import {ASSET_URL} from "../../../services/urls.js";
import CustomSnackbar from "../../custom/CustomSnackbar.jsx";

const AuditUpload = ({ name, disabled, auditId, auditorId, auditReportName, customerId, setFieldValue }) => {
    const [field, meta, fieldHelper] = useField(name)
    const [originalFileName, setOriginalFileName] = useState(auditReportName || '')
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
            formData.append('report_name', file.name)
            axios.post(ASSET_URL, formData, {
                headers: {Authorization: "Bearer " + Cookies.get("token")}
            })
                .then((data) => {
                    setOriginalFileName(file.name)
                    fieldHelper.setValue(formData.get('path'))
                    setFieldValue('report_name', formData.get('report_name'))
                    formData.delete('file')
                    formData.delete('path')
                    formData.delete('original_name')
                    formData.delete('private')
                    formData.delete('audit')
                    formData.delete('auditorId')
                    formData.delete('customerId')
                    formData.delete('report_name')
                })
                .catch((err) => {
                    if (err?.code === "ERR_NETWORK"){
                        setError('File size is too big')
                    } else {
                        setError('Error while uploading file')
                    }
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
            <Box sx={[inputWrapper, meta.error ? {borderColor: '#f44336'} : {}]}>
              {originalFileName}
            </Box>
            <CustomSnackbar
              autoHideDuration={10000}
              open={!!error}
              onClose={() => setError(null)}
              severity='error'
              text={error}
            />

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
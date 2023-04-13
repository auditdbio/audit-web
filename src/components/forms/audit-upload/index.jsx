import React from 'react';
import {Box, Button} from "@mui/material";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined.js";
import {useField} from "formik";
import axios from "axios";
import Cookies from "js-cookie";
import {useSelector} from "react-redux";

const AuditUpload = ({name, disabled, auditId}) => {
    const [field, meta, fieldHelper] = useField(name)
    const formData = new FormData()
    const user = useSelector(state => state.user.user)

    const handleUpdateAudit = (e) => {
        formData.append('file', e.target.files[0])
        formData.append('path', user.id + user.current_role + e.target.files[0].name)
        formData.append('original_name', e.target.files[0].name)
        formData.append("private", "true")
        formData.append('audit', auditId)
        axios.post('https://dev.auditdb.io/api/files/create', formData, {
            headers: {Authorization: "Bearer " + Cookies.get("token")}
        })
            .then((data) => {
                fieldHelper.setValue(formData.get('path'))
            })
    }
    return (
        <>
            <Box sx={[inputWrapper, meta.error ? {borderColor: '#f44336'} : {}]}>{field?.value}</Box>
            <Button disabled={disabled}>
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
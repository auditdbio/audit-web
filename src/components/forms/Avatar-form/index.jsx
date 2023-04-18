import React, {useEffect, useState} from 'react';
import {Alert, AlertTitle, Avatar, Button, Snackbar, Stack} from "@mui/material";
import {AUDITOR} from "../../../redux/actions/types.js";
import theme from "../../../styles/themes.js";
import EditIcon from "@mui/icons-material/Edit.js";
import {useField} from "formik";
import axios from "axios";
import Cookies from "js-cookie";
import {useSelector} from "react-redux";
import {ASSET_URL} from "../../../services/urls.js";


const AvatarForm = ({role, name}) => {
    const user = useSelector(state => state.user.user)
    const [avatarField, ,fieldHelper] = useField(name)
    const formData = new FormData();
    const [error, setError] = useState(null)

    const handleUpdateAvatar = (e) => {
        const file = e.target.files[0];
        const fileSize = file.size;
        if (fileSize > 10000000) {
           return setError('File size is too big')
        } else {
            formData.append('file', file)
            formData.append('path', user.id + user.current_role + file.name)
            formData.append('original_name', file.name)
            formData.append("private", "false")
            axios.post(ASSET_URL, formData, {
                headers: {Authorization: "Bearer " + Cookies.get("token")}
            })
                .then((data) => {
                    fieldHelper.setValue(formData.get('path'))
                    formData.delete('file')
                    formData.delete('path')
                    formData.delete('original_name')
                    formData.delete('private')
                })
                .catch((err) => {
                    console.log(err)
                    setError('Error while uploading file')
                    formData.delete('file')
                    formData.delete('path')
                    formData.delete('original_name')
                    formData.delete('private')
                })
        }
    }

    return (
        <>
            {/*<Avatar src={`https://dev.auditdb.io/api/files/get/${avatarField.value}`}/>*/}
            <Avatar src={`${ASSET_URL}/${avatarField.value}`}/>
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
            <Button sx={
                role === AUDITOR ? {color: theme.palette.secondary.main} : {}
            }>
                <label htmlFor="file-upload" style={{display: 'flex'}}>
                    <EditIcon fontSize={'small'}/>
                    Edit photo
                </label>
            </Button>
            <input id={'file-upload'}
                   style={{display: 'none'}}
                   accept={".jpg,.png,.jpeg,.gif,.bmp,.tif,.tiff,.webp"}
                   onChange={handleUpdateAvatar}
                   type="file"
            />
        </>
    );
};

export default AvatarForm;
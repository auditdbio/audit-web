import React, {useEffect} from 'react';
import {Avatar, Button} from "@mui/material";
import {AUDITOR} from "../../../redux/actions/types.js";
import theme from "../../../styles/themes.js";
import EditIcon from "@mui/icons-material/Edit.js";
import {useField} from "formik";
import axios from "axios";
import Cookies from "js-cookie";
import {useSelector} from "react-redux";


const AvatarForm = ({role, name, data}) => {
    const user = useSelector(state => state.user.user)
    const [avatarField, ,fieldHelper] = useField(name)
    const formData = new FormData();
    // const handleUpdateAvatar = (e) => {
    //     formData.append('file', e.target.files[0])
    //     formData.append('upload_preset', 'gallery')
    //     axios.post('https://api.cloudinary.com/v1_1/dktewh88s/upload', formData)
    //         .then(({data}) => fieldHelper.setValue(data.url))
    // }

    const handleUpdateAvatar = (e) => {
        formData.append('file', e.target.files[0])
        formData.append('path', user.id + user.current_role + e.target.files[0].name)
        formData.append('original_name', e.target.files[0].name)
        formData.append("private", "false")
        axios.post('https://dev.auditdb.io/api/files/create', formData, {
                headers: {Authorization: "Bearer " + Cookies.get("token")}
        })
            .then((data) => {
                fieldHelper.setValue(formData.get('path'))
            })
    }

    return (
        <>
            <Avatar src={`https://dev.auditdb.io/api/files/get/${avatarField.value}`}/>
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
                   onChange={handleUpdateAvatar}
                   type="file"
            />
        </>
    );
};

export default AvatarForm;
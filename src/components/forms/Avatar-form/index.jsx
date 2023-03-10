import React, {useEffect} from 'react';
import {Avatar, Button} from "@mui/material";
import {AUDITOR} from "../../../redux/actions/types.js";
import theme from "../../../styles/themes.js";
import EditIcon from "@mui/icons-material/Edit.js";
import {useField} from "formik";
import axios from "axios";
import Cookies from "js-cookie";


const AvatarForm = ({role, name, data}) => {
    const [avatarField, ,fieldHelper] = useField(name)
    const formData = new FormData();
    const handleUpdateAvatar = (e) => {
        formData.append('file', e.target.files[0])
        formData.append('upload_preset', 'gallery')
        axios.post('https://api.cloudinary.com/v1_1/dktewh88s/upload', formData)
            .then(({data}) => fieldHelper.setValue(data.url))
    }

    return (
        <>
            <Avatar src={avatarField.value}/>
            <Button sx={
                role === AUDITOR ? {color: theme.palette.secondary.main} : {}
            }>
                <label htmlFor="file-upload">
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
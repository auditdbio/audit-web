import React, {useEffect} from 'react';
import {Box} from "@mui/material";
import Layout from "../styles/Layout.jsx";
import {CustomCard} from "../components/custom/Card.jsx";
import EditProfileForm from "../components/forms/edit-profile-form/edit-profile-form.jsx";
import {getCustomer} from "../redux/actions/customerAction.js";
import {getAuditor} from "../redux/actions/auditorAction.js";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/Loader.jsx";

const EditProfile = () => {
    const role = useSelector(s => s.user.user.current_role)
    const customer = useSelector(s => s.customer.customer)
    const auditor = useSelector(s => s.auditor.auditor)

    const dispatch = useDispatch()

    useEffect(() => {
        if  (role === 'auditor'){
            dispatch(getCustomer())
        } else {
            dispatch(getAuditor())
        }
    },[role])

       return (
           <Layout>
               <CustomCard sx={editWrapper}>
                   <EditProfileForm role={role}/>
               </CustomCard>
           </Layout>
       )
};

export default EditProfile;

const editWrapper = (theme) => ({
    padding: '41px 68px 70px',
    [theme.breakpoints.down('sm')]: {
        padding: '41px 48px 50px'
    },
    [theme.breakpoints.down('xs')]: {
        padding: '31px 28px 40px'
    }
})
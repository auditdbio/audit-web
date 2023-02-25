import React, {useEffect} from 'react';
import { Route, Routes } from 'react-router-dom/dist'
import HomePage from "../pages/HomePage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import SigninPage from "../pages/SigninPage.jsx";
import HomeCustomer from "../pages/home-customer.jsx";
import HomeAuditor from "../pages/home-auditor.jsx";
import {PrivateRoute} from "../router/PrivateRoute.jsx";
import {useDispatch, useSelector} from "react-redux";
import {authenticate} from "../redux/actions/userAction.js";
import {isAuth} from "../lib/helper.js";


const AppRoutes = () => {
    const token = useSelector(s => s.user.token)
    const dispatch = useDispatch()
    useEffect(() => {
        if (isAuth()){
            dispatch(authenticate())
        }
    },[dispatch, token])

    return (
        <>
            <Routes>
                <Route path={'/'} element={<HomePage />} />
                <Route path={'/sign-up'} element={<SignupPage />} />
                <Route path={'/sign-in'} element={<SigninPage />} />
                <Route
                    path="/home-customer"
                    element={
                        <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
                            <HomeCustomer />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/home-auditor"
                    element={
                        <PrivateRoute auth={{isAuthenticated: isAuth() }}>
                            <HomeAuditor />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </>
    );
};

export default AppRoutes
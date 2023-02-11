import React from 'react';
import { Route, Routes } from 'react-router-dom'
import HomePage from "../pages/HomePage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import SigninPage from "../pages/SigninPage.jsx";


const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path={'/'} element={<HomePage />} />
                <Route path={'sign-up'} element={<SignupPage />} />
                <Route path={'sign-in'} element={<SigninPage />} />
            </Routes>
        </>
    );
};

export default AppRoutes
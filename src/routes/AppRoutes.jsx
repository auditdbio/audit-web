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
import EditProfile from "../pages/edit-profile.jsx";
import AuditInfo from "../pages/audit-info.jsx";
import AuditRequestInfo from "../components/audit-request-info.jsx";
import AuditOffer from "../pages/audit-offer.jsx";
import CreateProject from "../pages/CreateProject.jsx";
import ProfilePage from "../pages/profile-page.jsx";
import {AUDITOR} from "../redux/actions/types.js";
import {getAuditor} from "../redux/actions/auditorAction.js";
import {getCustomer} from "../redux/actions/customerAction.js";
import Projects from "../components/Projects.jsx";
import ProjectPage from "../pages/Project-page.jsx";
import AuditRequestPage from "../pages/Audit-Request-Page.jsx";
import {getProjects} from "../redux/actions/projectAction.js";
import {getAudits, getAuditsRequest} from "../redux/actions/auditAction.js";
import EditProject from "../pages/EditProject.jsx";


const AppRoutes = () => {
    const token = useSelector(s => s.user.token)
    const currentRole = useSelector(s => s.user.user.current_role)
    const dispatch = useDispatch()
    useEffect(() => {
        if (isAuth()) {
            dispatch(getAuditor())
            dispatch(getCustomer())
            dispatch(getProjects())
            if (currentRole){
                dispatch(getAuditsRequest(currentRole))
                dispatch(getAudits(currentRole))
            }
        }
        // dispatch(getProjects())
    }, [dispatch, token, currentRole])

    return (
        <>
            <Routes>
                <Route path={'/'} element={<HomePage/>}/>
                <Route path={'/sign-up'} element={<SignupPage/>}/>
                <Route path={'/sign-in'} element={<SigninPage/>}/>
                <Route path={'/projects'} element={<ProjectPage/>}/>
                <Route
                    path="/profile/:tab"
                    element={
                        <PrivateRoute auth={{isAuthenticated: isAuth()}}>
                            <ProfilePage/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit-profile"
                    element={
                        <PrivateRoute auth={{isAuthenticated: isAuth()}}>
                            <EditProfile/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/audit-info"
                    element={
                        <PrivateRoute auth={{isAuthenticated: isAuth()}}>
                            <AuditInfo/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/audit-request/:id"
                    element={
                        <PrivateRoute auth={{isAuthenticated: isAuth()}}>
                            <AuditRequestPage/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/audit-request-offer"
                    element={
                        <PrivateRoute auth={{isAuthenticated: isAuth()}}>
                            <AuditOffer/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/create-project"
                    element={
                        <PrivateRoute auth={{isAuthenticated: isAuth()}}>
                            <CreateProject/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit-project"
                    element={
                        <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
                            <EditProject />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </>
    );
};

export default AppRoutes;

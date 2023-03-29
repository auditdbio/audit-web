import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom/dist";
import HomePage from "../pages/HomePage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import SigninPage from "../pages/SigninPage.jsx";
import { PrivateRoute } from "../router/PrivateRoute.jsx";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../redux/actions/userAction.js";
import { isAuth } from "../lib/helper.js";
import EditProfile from "../pages/edit-profile.jsx";
import AuditInfo from "../pages/audit-info.jsx";
import AuditRequestInfo from "../components/audit-request-info.jsx";
import AuditOffer from "../pages/audit-offer.jsx";
import CreateProject from "../pages/CreateProject.jsx";
import ProfilePage from "../pages/profile-page.jsx";
import { AUDITOR } from "../redux/actions/types.js";
import {getAuditor, getAuditors} from "../redux/actions/auditorAction.js";
import { getCustomer } from "../redux/actions/customerAction.js";
import Projects from "../components/Projects.jsx";
import ProjectPage from "../pages/Project-page.jsx";
import AuditRequestPage from "../pages/Audit-Request-Page.jsx";
import { getAllProjects, getProjects } from "../redux/actions/projectAction.js";
import { getAudits, getAuditsRequest } from "../redux/actions/auditAction.js";
import EditProject from "../pages/EditProject.jsx";
import ForCustomer from "../pages/For-customer.jsx";
import ForAuditor from "../pages/For-auditor.jsx";
import AuditorsPage from "../pages/AuditorsPage.jsx";
import AuditDb from "../pages/AuditDb.jsx";
import Faq from "../pages/Faq.jsx";
import ContactUs from "../pages/Contact-Us.jsx";
import MyProjects from "../pages/My-projects.jsx";


const AppRoutes = () => {
    const token = useSelector(s => s.user.token)
    const currentRole = useSelector(s => s.user.user.current_role)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAllProjects())
        if (isAuth()) {
            dispatch(getAuditors())
            dispatch(getCustomer())
            dispatch(getProjects())
            if (currentRole){
                dispatch(getAuditsRequest(currentRole))
                dispatch(getAudits(currentRole))
            }
        }
    }, [token, currentRole, isAuth])

    return (
        <>
            <Routes>
                <Route path={'/'} element={<HomePage/>}/>
                <Route path={'/sign-up'} element={<SignupPage/>}/>
                <Route path={'/sign-in'} element={<SigninPage/>}/>
                <Route path={'/projects'} element={<ProjectPage/>}/>
                <Route path={'/for-customers'} element={<ForCustomer/>}/>
                <Route path={'/for-auditors'} element={<ForAuditor/>}/>
                <Route path={"/auditors"} element={<AuditorsPage />} />
                <Route path={'/audit-db'} element={<AuditDb/>}/>
                <Route path={'/FAQ'} element={<Faq/>}/>
                <Route path={'/contact-us'} element={<ContactUs/>}/>
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
                    path="/my-projects"
                    element={
                        <PrivateRoute auth={{isAuthenticated: isAuth()}}>
                            <MyProjects/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/audit-info/:id"
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
                    path="/audit-request-offer/:id"
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

import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom/dist";
import HomePage from "../pages/HomePage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import SigninPage from "../pages/SigninPage.jsx";
import HomeCustomer from "../pages/home-customer.jsx";
import HomeAuditor from "../pages/home-auditor.jsx";
import { PrivateRoute } from "../router/PrivateRoute.jsx";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../redux/actions/userAction.js";
import { isAuth } from "../lib/helper.js";
import EditProfile from "../pages/edit-profile.jsx";
import AuditInfo from "../pages/audit-info.jsx";
import AuditRequestInfo from "../pages/audit-request-info.jsx";
import AuditOffer from "../pages/audit-offer.jsx";
import CreateProject from "../pages/CreateProject.jsx";
import ProfilePage from "../pages/profile-page.jsx";
import { AUDITOR } from "../redux/actions/types.js";
import { getAuditor } from "../redux/actions/auditorAction.js";
import { getCustomer } from "../redux/actions/customerAction.js";
import EditProject from "../pages/EditProject.jsx";

const AppRoutes = () => {
  const token = useSelector((s) => s.user.token);
  const currentRole = useSelector((s) => s.user.user.current_role);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuth()) {
      dispatch(authenticate());
      if (currentRole === AUDITOR) {
        dispatch(getAuditor());
      } else {
        dispatch(getCustomer());
      }
    }
  }, [dispatch, token, currentRole]);

  return (
    <>
      <Routes>
        <Route path={"/"} element={<HomePage />} />
        <Route path={"/sign-up"} element={<SignupPage />} />
        <Route path={"/sign-in"} element={<SigninPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/home-auditor"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <HomeAuditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-info"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <AuditInfo />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-request"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <AuditRequestInfo />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-request-offer"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <AuditOffer />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <CreateProject />
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

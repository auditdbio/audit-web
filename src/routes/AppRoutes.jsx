import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import HomePage from '../pages/HomePage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import SigninPage from '../pages/SigninPage.jsx';
import { PrivateRoute } from '../router/PrivateRoute.jsx';
import { isAuth } from '../lib/helper.js';
import EditProfile from '../pages/edit-profile.jsx';
import AuditOffer from '../pages/audit-offer.jsx';
import CreateProject from '../pages/CreateProject.jsx';
import ProfilePage from '../pages/profile-page.jsx';
import { getAuditor } from '../redux/actions/auditorAction.js';
import { getCustomer } from '../redux/actions/customerAction.js';
import ProjectPage from '../pages/Project-page.jsx';
import AuditRequestPage from '../pages/Audit-Request-Page.jsx';
import { getProjects } from '../redux/actions/projectAction.js';
import { getAudits, getAuditsRequest } from '../redux/actions/auditAction.js';
import EditProject from '../pages/EditProject.jsx';
import ForCustomer from '../pages/For-customer.jsx';
import ForAuditor from '../pages/For-auditor.jsx';
import AuditorsPage from '../pages/AuditorsPage.jsx';
import AuditDb from '../pages/AuditDb.jsx';
import Faq from '../pages/Faq.jsx';
import ContactUs from '../pages/Contact-Us.jsx';
import MyProjects from '../pages/My-projects.jsx';
import RestorePasswordPage from '../pages/RestorePasswordPage.jsx';
import AuditIssues from '../pages/AuditIssues.jsx';
import AuditIssueDetails from '../pages/AuditIssueDetails.jsx';
import CreateIssuePage from '../pages/CreateIssuePage.jsx';
import PublicProfile from '../pages/Public-profile.jsx';
import NotFound from '../pages/Not-Found.jsx';
import AuditInfoReqPage from '../pages/audit-info-req-page.jsx';
import AuditInfoPage from '../pages/audit-info-page.jsx';
import {
  getUnreadMessages,
  websocketConnect,
  websocketDisconnect,
} from '../redux/actions/websocketAction.js';
import PublicProject from '../pages/PublicProject.jsx';
import ChatPage from '../pages/ChatPage.jsx';
import {
  getChatList,
  getUnreadForDifferentRole,
} from '../redux/actions/chatActions.js';
import PublicConstructor from '../pages/PublicConstructor.jsx';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import InvitePage from '../pages/Invite-page.jsx';
import DeleteBadge from '../pages/Delete-badge.jsx';
import Github from '../pages/Github.jsx';
import ConnectAccount from '../pages/Connect-account.jsx';
import DisclaimerPage from '../pages/DisclaimerPage.jsx';
import UserProjects from '../pages/UserProjects.jsx';

const AppRoutes = () => {
  const token = useSelector(s => s.user.token);
  const currentRole = useSelector(s => s.user.user.current_role);
  const customer = useSelector(s => s.customer.customer);
  const auditor = useSelector(s => s.auditor.auditor);
  const dispatch = useDispatch();
  const { reconnect, connected, needUpdate } = useSelector(s => s.websocket);
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    if (isAuth()) {
      dispatch(getUnreadMessages());
    }
  }, [isAuth()]);

  useEffect(() => {
    if (isAuth()) {
      dispatch(getProjects());
      if (currentRole) {
        dispatch(getAuditsRequest(currentRole));
        dispatch(getAudits(currentRole));
      }
    }
  }, [token, currentRole, isAuth()]);

  useEffect(() => {
    if (isAuth()) {
      if (currentRole === 'auditor' && !auditor) {
        dispatch(getAuditor());
      } else if (currentRole === 'customer' && !customer) {
        dispatch(getCustomer());
      }
    }
  }, [currentRole, isAuth(), customer, auditor]);

  useEffect(() => {
    if (isAuth() && !connected) {
      dispatch(websocketConnect());
    }
  }, [isAuth(), connected]);

  useEffect(() => {
    if (isAuth() && reconnect && !connected) {
      const handleReconnect = setInterval(() => {
        dispatch(websocketConnect());
      }, 10000);
      return () => {
        clearInterval(handleReconnect);
      };
    }
  }, [reconnect, connected]);

  useEffect(() => {
    if (isAuth()) {
      dispatch(getChatList(currentRole));
      dispatch(getUnreadForDifferentRole());
    }
  }, [currentRole]);

  useEffect(() => {
    return () => {
      dispatch(websocketDisconnect());
    };
  }, []);

  useEffect(() => {
    if (needUpdate) {
      setIsOpen(true);
    }
  }, [needUpdate]);

  const handleReload = () => {
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <>
      <CustomSnackbar
        open={isOpen}
        action={handleReload}
        autoHideDuration={50000}
        onClose={() => setIsOpen(false)}
        text="New version is available. Please reload the page"
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/invite-user/:id/:secret" element={<InvitePage />} />
        <Route path="/sign-in" element={<SigninPage />} />
        <Route path="/oauth/callback" element={<ConnectAccount />} />
        <Route path="/oauth/callback" element={<Github />} />
        <Route
          path="/restore-password/:token"
          element={<RestorePasswordPage />}
        />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/projects/:id" element={<PublicProject />} />
        <Route path="/for-customers" element={<ForCustomer />} />
        <Route path="/for-auditors" element={<ForAuditor />} />
        <Route path="/auditors" element={<AuditorsPage />} />
        <Route path="/audit-db" element={<AuditDb />} />
        <Route path="/FAQ" element={<Faq />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/user/:id/:role" element={<PublicProfile />} />
        <Route path="/delete/:id/:secret" element={<DeleteBadge />} />
        <Route
          path="/audit-builder/:auditId"
          element={<PublicConstructor isPublic={true} />}
        />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/for-customers" element={<ForCustomer />} />
        <Route path="/for-auditors" element={<ForAuditor />} />
        <Route path="/auditors" element={<AuditorsPage />} />
        <Route path="/audit-db" element={<AuditDb />} />
        <Route path="/FAQ" element={<Faq />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/user/:id/:role" element={<PublicProfile />} />
        <Route path="/delete/:id/:secret" element={<DeleteBadge />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route
          path="/profile/:tab"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <ProfilePage />
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
          path="/my-projects/:id"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <MyProjects />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer-projects/:id"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <UserProjects />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-info/:id/customer"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <AuditInfoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-builder/edit/:auditId"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <PublicConstructor saved={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-request/:id"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <AuditRequestPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-request/:id/customer"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <AuditInfoReqPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-info/:auditId/auditor"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <AuditOffer />
            </PrivateRoute>
          }
        />
        <Route
          path="/issues/audit-issue/:auditId"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <AuditIssues />
            </PrivateRoute>
          }
        />
        <Route
          path="/issues/audit-issue/:auditId/:issueId"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <AuditIssueDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/public-issues/audit-issue/:auditId/:issueId"
          element={<AuditIssueDetails isPublic={true} />}
        />
        <Route
          path="/private-issues/audit-issue/:auditId/:issueId"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <AuditIssueDetails saved={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/issues/new-issue/:auditId"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <CreateIssuePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/public-issues/new-issue/:auditId"
          element={<CreateIssuePage isPublic={true} />}
        />
        <Route
          path="/private-issues/new-issue/:auditId"
          element={<CreateIssuePage saved={true} />}
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
          path="/edit-project/:id"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <EditProject />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;

import {Navigate} from "react-router-dom/dist";

export const PrivateRoute = ({ auth: { isAuthenticated }, children }) => {
    return isAuthenticated ? children : <Navigate to="/sign-in" />;
};
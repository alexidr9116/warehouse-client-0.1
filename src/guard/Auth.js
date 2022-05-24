import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../hook/useAuth";
import { useState } from "react";
import LoadingScreen from "../component/custom/LoadingScreen";
import Login from "../page/auth/Login";

AuthGuard.propTypes = {
  children: PropTypes.node,
};
export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Navigate to="/auth/login" />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <> {children} </>;
}

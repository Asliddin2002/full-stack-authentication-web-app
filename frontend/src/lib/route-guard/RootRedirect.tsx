import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();

  return <Navigate to={isAuthenticated ? "/" : "/auth"} replace />;
};

export default RootRedirect;

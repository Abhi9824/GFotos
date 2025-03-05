import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loading/Loading";

export const RequireAuth = ({ children }) => {
  const { isLoggedIn, status } = useSelector((state) => state.user);
  const location = useLocation();

  if (status === "loading") return <Loading />; 

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

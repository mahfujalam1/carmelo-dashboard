/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // localStorage থেকে token এবং user পড়া
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  // Token বা user না থাকলে auth route এ redirect
  if (!token || !userStr) {
    return <Navigate to="/auth" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return <Navigate to="/auth" replace />;
  }

  // User না থাকলে auth এ redirect
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // সব ঠিক থাকলে route render করবে
  return <>{children}</>;
};

export default ProtectedRoute;

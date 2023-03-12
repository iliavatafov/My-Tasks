import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

function AdminProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);

  if (auth.isAdmin) {
    return children;
  } else {
    window.location.href = "/";
  }
}

export default AdminProtectedRoute;

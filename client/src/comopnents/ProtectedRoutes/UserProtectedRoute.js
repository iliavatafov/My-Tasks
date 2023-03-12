import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

function UserProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);

  if (auth.email) {
    return children;
  } else {
    window.location.href = "/";
  }
}

export default UserProtectedRoute;

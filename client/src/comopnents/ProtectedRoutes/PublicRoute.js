import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

function PublicRoute({ children }) {
  const { auth } = useContext(AuthContext);

  if (auth.email) {
    window.location.href = "/";
  } else {
    return children;
  }
}

export default PublicRoute;

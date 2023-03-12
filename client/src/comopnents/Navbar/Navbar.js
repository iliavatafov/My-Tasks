import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { MyLinks, MyLinksLoggedIn, MyLinksAdmin } from "./MyLinks";
import { AuthContext } from "../../context/AuthContext";

import "../Navbar/Navbar.css";

export const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const [menuToRender, setMenuToRender] = useState([]);

  const { auth, userLogout } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.email) {
      if (auth.isAdmin) {
        setMenuToRender(MyLinksAdmin);
      } else {
        setMenuToRender(MyLinksLoggedIn);
      }
    } else {
      setMenuToRender(MyLinks);
    }
  }, [auth]);

  const myLinks = menuToRender.map(({ title, url }, index) => {
    return (
      <li key={index}>
        <Link to={url} className="actve">
          {title}
        </Link>
      </li>
    );
  });

  const navbarClickHandler = () => {
    setClicked(!clicked);
  };

  const logOutHandler = () => {
    userLogout({});
    setMenuToRender(MyLinks);
    navigate("/");
  };

  return (
    <nav>
      <Link className="logo" to="/">
        My <font>Tasks</font>
      </Link>
      <div className="links">
        <div className="nav-icon" onClick={navbarClickHandler}>
          <i className={clicked ? "fa fa-times" : "fa fa-bars"}></i>
        </div>
        <ul
          onClick={navbarClickHandler}
          className={clicked ? "nav-list" : "nav-list close"}
        >
          {myLinks}

          {auth.email && (
            <li className="logout">
              <Link onClick={logOutHandler} to="/" className="actve">
                Logout
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

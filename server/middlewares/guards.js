function isAuth() {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json([{ msg: "Please log in" }]);
    }
  };
}

function isGuest() {
  return (req, res, next) => {
    if (!req.user) {
      next();
    } else {
      res.status(400).json([{ msg: "You are already signed in" }]);
    }
  };
}

function isAdmin() {
  return (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(400).json([{ msg: "You are not authorised" }]);
    }
  };
}

module.exports = {
  isAuth,
  isGuest,
  isAdmin,
};

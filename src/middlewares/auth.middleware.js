const createError = require("http-errors");
const { create } = require("../controllers/user.controller");

module.exports.isAuthenticated = (req, _, next) => {
  if (req.session.user) {
    next();
  } else {
    next(createError(401));
  }
};

module.exports.isNotAuthenticated = (req, _, next) => {
  if (!req.session.user) {
    next();
  } else {
    next(createError(403));
  }
};

module.exports.isPropietary = (req, _, next) => {
  if (
    req.session.user.name === req.params.path.split("-")[0] ||
    req.session.user.userType === "Admin"
  ) {
    next();
  } else {
    next(createError(403));
  }
};

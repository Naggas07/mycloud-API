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

const createError = require("http-errors");

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

module.exports.isEditor = (req, _, next) => {
  console.log(req.session.user);
  next();
};

const createError = require("http-errors");

module.exports.isAdmin = (req, _, next) => {
  if (req.session.user.userType === "Admin") {
    next();
  } else {
    next(createError(403));
  }
};

module.exports.isUser = (req, _, next) => {
  if (req.session.userType === "User") {
    next();
  } else {
    next(createError(403));
  }
};

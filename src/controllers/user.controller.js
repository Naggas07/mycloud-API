const User = require("../models/user.model");

module.exports.create = (req, res, next) => {
  const { name, nickName, email, password, userType, avatar } = req.body;

  const user = {
    name,
    nickName,
    email,
    password,
    userType,
    avatar: null,
  };

  User.create(user)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);
};

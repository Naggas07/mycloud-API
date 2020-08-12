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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        return user.comparePassword(password).then((match) => {
          if (match) {
            req.session.user = user;
            res.status(200).json(user);
          } else {
            res.status(404).json({ message: "User not found" });
          }
        });
      }
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "session destroyed" });
};

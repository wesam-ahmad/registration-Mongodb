const User = require("../model/user");
const errorHandler = require('../middleware/500')
const jwt= require('jsonwebtoken');
const bcrypt= require('bcrypt');



// Login 
const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!req.user || !req.user.email) {
      return res.status(403).json({ message: "Invalid Email" });
    }
  
    if (!req.user || !req.user.password) {
      return res.status(403).json({ message: "Invalid Password" });
    }
  
    if (email !== req.user.email) {
      return res.status(403).json({ message: "Invalid Email" });
    } else if (password !== req.user.password) {
      return res.status(403).json({ message: "Invalid Password" });
    }
  
    res.json(req.user);
  };


//signup
const signup = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const users = await User.find();
      const isEmailTaken = users.some((user) => user.email === email);
  
      if (isEmailTaken) {
        return res.json("Email already taken.");
      }
  
      const accessToken = jwt.sign(
        {
          email: email,
          username: username,
          password: password,
        },
        process.env.ACCESS_TOKEN_SECRET
      );
  
      const hashedPwd = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPwd,
        token: accessToken,
      });
      const addUser = await newUser.save();
  
      res.json(addUser);
    } catch (error) {
      errorHandler(error, req, res);
    }
  };


module.exports = {
    login,
    signup
};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const JWT_SECRET = "ogjnernflsdnmfgner432423dfsf234234fds23478gfhfghfghgf";
const blacklist = [];

async function register(email, name, password, employeeId) {
  const existing = await User.findOne({ email: new RegExp(`^${email}&`, "i") });

  if (existing) {
    throw new Error("Email already exists");
  }

  const user = new User({
    email,
    name,
    employeeId,
    hashedPassword: await bcrypt.hash(password, 10),
  });

  await user.save();

  return createSession(user);
}

async function updateUser(userId, data) {
  const { name, email, password } = data;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }
  if (password) {
    user.hashedPassword = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  };
}

async function login(email, password) {
  const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

  if (!user) {
    throw new Error("Incorrect email or password");
  }

  const match = await bcrypt.compare(password, user.hashedPassword);

  if (!match) {
    throw new Error("Incorrect email or password");
  }

  return createSession(user);
}

function logout(token) {
  blacklist.push(token);
}

async function deleteUser(id) {
  await User.findByIdAndDelete(id);
}

function createSession(user) {
  if (user.isAdmin) {
    return {
      email: user.email,
      _id: user._id,
      isAdmin: user.isAdmin,
      accessToken: jwt.sign(
        { email: user.email, _id: user._id, isAdmin: user.isAdmin },
        JWT_SECRET
      ),
    };
  } else {
    return {
      email: user.email,
      _id: user._id,
      employeeId: user.employeeId || "",
      accessToken: jwt.sign(
        { email: user.email, _id: user._id, isAdmin: user.isAdmin },
        JWT_SECRET
      ),
    };
  }
}

function verifySession(token) {
  if (blacklist.includes(token)) {
    throw new Error("Token is invalidated");
  }

  const payload = jwt.verify(token, JWT_SECRET);

  return {
    email: payload.email,
    isAdmin: payload.isAdmin,
    _id: payload._id,
    token,
  };
}

module.exports = {
  register,
  updateUser,
  login,
  logout,
  verifySession,
  deleteUser,
};

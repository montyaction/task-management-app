import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { seedStarterTasksForUser } from "../services/starterTasks.service.js";

const normalizeIdentifier = (value = "") => value.trim();

const serializeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl || "",
  createdAt: user.createdAt
});

const hasHttpProtocol = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password, avatarUrl = "" } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const normalizedUsername = normalizeIdentifier(username);
    const normalizedEmail = normalizeIdentifier(email).toLowerCase();
    const normalizedAvatarUrl = normalizeIdentifier(avatarUrl);

    if (!normalizedUsername || !normalizedEmail) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    if (normalizedAvatarUrl && !hasHttpProtocol(normalizedAvatarUrl)) {
      return res.status(400).json({ message: "Avatar URL must be a valid http or https URL" });
    }

    const exists = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
    });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hash,
      avatarUrl: normalizedAvatarUrl
    });
    await seedStarterTasksForUser(user._id);
    const token = generateToken(user._id.toString());
    res.status(201).json({
      token,
      user: serializeUser(user)
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username
    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedIdentifier = normalizeIdentifier(identifier);
    const user = await User.findOne({
      $or: [{ email: normalizedIdentifier.toLowerCase() }, { username: normalizedIdentifier }]
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id.toString());
    res.json({
      token,
      user: serializeUser(user)
    });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, avatarUrl } = req.body;

    const updates = {};
    if (username !== undefined) {
      const normalizedUsername = normalizeIdentifier(username);
      if (!normalizedUsername) {
        return res.status(400).json({ message: "Username cannot be empty" });
      }
      updates.username = normalizedUsername;
    }

    if (email !== undefined) {
      const normalizedEmail = normalizeIdentifier(email).toLowerCase();
      if (!normalizedEmail) {
        return res.status(400).json({ message: "Email cannot be empty" });
      }
      updates.email = normalizedEmail;
    }

    if (avatarUrl !== undefined) {
      const normalizedAvatarUrl = normalizeIdentifier(avatarUrl);
      if (normalizedAvatarUrl && !hasHttpProtocol(normalizedAvatarUrl)) {
        return res.status(400).json({ message: "Avatar URL must be a valid http or https URL" });
      }
      updates.avatarUrl = normalizedAvatarUrl;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No profile fields provided to update" });
    }

    if (updates.username) {
      const usernameTaken = await User.findOne({
        _id: { $ne: req.user.id },
        username: updates.username
      });
      if (usernameTaken) {
        return res.status(409).json({ message: "Username already in use" });
      }
    }

    if (updates.email) {
      const emailTaken = await User.findOne({
        _id: { $ne: req.user.id },
        email: updates.email
      });
      if (emailTaken) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
};

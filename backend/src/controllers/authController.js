const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
exports.register = async (req, res) => {
  try {
    console.log("Register request received:", {
      body: { ...req.body, password: "***" },
      headers: req.headers,
    });

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log("User already exists:", { email, username });
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();
    console.log("New user created:", { userId: user._id, email, username });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error in register:", {
      error: error.message,
      stack: error.stack,
      body: { ...req.body, password: "***" },
    });
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log("Login request received:", {
      body: { ...req.body, password: "***" },
      headers: req.headers,
    });

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: User not found", { email });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Login failed: Invalid password", { email });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("Login successful:", { userId: user._id, email });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error in login:", {
      error: error.message,
      stack: error.stack,
      body: { ...req.body, password: "***" },
    });
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    console.log("Get current user request:", { userId: req.userId });
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      console.log("User not found:", { userId: req.userId });
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error in getCurrentUser:", {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
    });
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

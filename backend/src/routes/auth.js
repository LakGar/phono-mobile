const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const authController = require("../controllers/authController");
const { body, validationResult } = require("express-validator");

// Signup route
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("username")
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters"),
    body("name")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
  ],
  async (req, res) => {
    try {
      console.log("Signup request received:", {
        body: { ...req.body, password: "***" },
        headers: req.headers,
      });

      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, username } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        console.log("User already exists:", { email, username });
        return res.status(400).json({
          message: "User already exists",
          field: existingUser.email === email ? "email" : "username",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const user = new User({
        email,
        password: hashedPassword,
        name,
        username,
      });

      await user.save();
      console.log("New user created:", { userId: user._id, email, username });

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("Error in signup:", {
        error: error.message,
        stack: error.stack,
        body: { ...req.body, password: "***" },
      });
      res.status(500).json({
        message: "Error creating user",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Get current user route
router.get("/me", auth, authController.getCurrentUser);

module.exports = router;

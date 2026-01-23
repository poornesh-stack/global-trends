const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// Helper function to create JWT token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Login user
const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Required field validation
    if (!identifier || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Determine if identifier is email or username
    const isEmail = validator.isEmail(identifier);

    // Find user by email or username
    const user = await User.findOne(
      isEmail ? { email: identifier.toLowerCase() } : { username: identifier },
    );

    //Check if user exists
    if (!user) {
      return res.status(401).json({
        error: isEmail
          ? "No account found with this email address"
          : "No account found with this username",
      });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        error: "Incorrect password",
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = createToken(user._id);

    // Send response with public profile
    return res.status(200).json({
      user: user.getPublicProfile(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Server error. Please try again later.",
    });
  }
};

// Signup user
const signupUser = async (req, res) => {
  console.log("Signup request received:", req.body);

  const { email, password, username, firstName, lastName, theme } = req.body;

  try {
    // Required field validation
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        error: "Email and Password are required",
      });
    }

    // Email format validation
    if (!validator.isEmail(email)) {
      console.log("Invalid email format");
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Password strength validation
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      console.log("Password not strong enough");
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    // Username validation (if provided)
    if (username) {
      if (username.length < 3 || username.length > 20) {
        console.log("Invalid username length");
        return res.status(400).json({
          error: "Username must be between 3 and 20 characters",
        });
      }

      // Check if username already exists
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        console.log("Username already exists");
        return res.status(400).json({
          error: "Username already taken",
        });
      }
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      console.log("Email already exists");
      return res.status(400).json({
        error: "Email already in use",
      });
    }

    // Build user data object
    const userData = {
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save hook
      preferences: {
        theme: theme || "auto",
      },
    };

    // Add optional fields only if they exist
    if (username) userData.username = username;
    if (firstName) userData.firstName = firstName;
    if (lastName) userData.lastName = lastName;

    console.log("Creating user with data:", {
      ...userData,
      password: "[REDACTED]",
    });

    // Create user
    const user = await User.create(userData);
    console.log("User created successfully");

    // Generate JWT token
    const token = createToken(user._id);

    // Send response with public profile
    return res.status(201).json({
      user: user.getPublicProfile(),
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle duplicate key errors from MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }

    return res.status(400).json({
      error: error.message || "An error occurred during signup",
    });
  }
};

module.exports = { signupUser, loginUser };

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier) {
      newErrors.identifier = "Email or username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await login(formData.identifier, formData.password);
      if (success) {
        navigate("/");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #000068 0%, #07072e 100%)",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #000068 0%, #2626a5 100%)",
            color: "#fff",
            py: 4,
            px: 3,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "15px",
              background:
                "conic-gradient(from 180deg at 50% 50%, #72E7FF 0deg, #7B61FF 140deg, #00FFC6 320deg)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              margin: "0 auto 16px",
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Michroma", sans-serif',
              fontWeight: 700,
              letterSpacing: ".1rem",
              mb: 0.5,
            }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Sign in to continue to Global Trends
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email or Username"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              error={!!errors.identifier}
              helperText={errors.identifier}
              autoComplete="username"
              autoFocus
              disabled={isLoading}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              disabled={isLoading}
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: "right", mb: 3 }}>
              <Link
                href="#"
                underline="hover"
                sx={{
                  fontSize: "0.875rem",
                  color: "primary.main",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                background: "linear-gradient(135deg, #000068 0%, #2626a5 100%)",
                boxShadow: "0 6px 20px rgba(0,0,104,0.3)",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: ".05rem",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2626a5 0%, #000068 100%)",
                  boxShadow: "0 8px 25px rgba(0,0,104,0.4)",
                },
                "&:disabled": {
                  background: "rgba(0, 0, 104, 0.5)",
                },
              }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Don't have an account?{" "}
                <Link
                  onClick={() => navigate("/signup")}
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

"use client";

import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid2,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    setError(null);

    console.log("Signing up manually with:", username, email, password);

    try {
      setIsLoading(true);
      const url = "http://localhost:8080/user/signup";
      const response = await fetch(url, {
        method: "POST", // You forgot this!
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // optional: read error body
        throw new Error(
          `Signup failed. Status: ${response.status}, Message: ${errorText}`,
        );
      }
      setIsLoading(false);
      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setIsLoading(false);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <CssBaseline />
      <Paper
        sx={{
          width: { xs: "90%", sm: "400px" },
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            mb: 2,
            width: 60,
            height: 60,
          }}
        >
          <PersonAddOutlinedIcon />
        </Avatar>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Sign Up
        </Typography>
        <Grid2 container spacing={2}>
          {/* Username */}
          <Grid2 sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                id="username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 30,
                  },
                }}
              />
              {error && <FormHelperText error>{error}</FormHelperText>}
            </FormControl>
          </Grid2>
          {/* Email */}
          <Grid2 sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <TextField
                id="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 30,
                  },
                }}
              />
            </FormControl>
          </Grid2>
          {/* Password */}
          <Grid2 sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                id="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 30,
                  },
                }}
              />
            </FormControl>
          </Grid2>
          {/* Confirm Password */}
          <Grid2 sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                id="confirmPassword"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                type="password"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 30,
                  },
                }}
              />
            </FormControl>
          </Grid2>

          {/* Traditional Sign Up */}
          <Grid2 sx={{ width: "100%", mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSignup}
              sx={{
                padding: "12px",
                borderRadius: 30,
                boxShadow: 2,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: "white"}}/> : "Sign Up"}
            </Button>
          </Grid2>

          {/* Divider */}
          <Grid2 sx={{ width: "100%", mt: 2 }}>
            <Divider>OR</Divider>
          </Grid2>

          {/* Google Sign Up */}
          {/* <Grid2
            sx={{
              width: "100%",
              mt: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
              theme="outline"
              size="large"
              width="100%"
            />
          </Grid2> */}

          {/* Link to Login */}
          <Grid2 sx={{ width: "100%", mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                href="/login"
                variant="body2"
                sx={{ color: "primary.main" }}
              >
                Login
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>
    </Box>
  );
};

export default SignupPage;

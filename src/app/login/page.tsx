"use client";

import { useProfileStore } from "@/app/utils/store/profileStore";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  FormControl,
  FormHelperText,
  Grid2,
  Input,
  InputLabel,
  Link,
  Paper,
  Typography,
} from "@mui/material";
// import { GoogleLogin } from "@react-oauth/google";
// import { decodeJwt } from "jose";
import { useRouter } from "next/navigation";
import { apiUrl } from "../utils/api";
import React, { useState } from "react";

// interface GoogleJWT {
//   sub: string;
//   email: string;
//   name: string;
//   picture: string;
//   exp: number;
//   iat: number;
// }

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function manualLogin(email: string, password: string) {
    setIsLoading(true);
    const url = apiUrl("/user/login");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setIsLoading(false);
      return data.token;
    } catch (error: any) {
      console.error("Login failed:", error.message);
      setIsLoading(false);
      throw error;
    }
  }

  async function fetchProfile() {
    const url = apiUrl("/user/profile");
    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile, status: ${response.status}`);
    }

    return await response.json();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      // Perform login
      await manualLogin(email, password);

      // Try to fetch profile (browser sends `sessionid` cookie automatically)
      const userProfile = await fetchProfile();
      useProfileStore.getState().setProfile(userProfile);

      setIsLoading(false);
      router.push("/");
    } catch (err: any) {
      console.error("Login or profile fetch failed:", err);
      setError("Invalid credentials or session error.");
    }
  }

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
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Login
        </Typography>
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <Grid2 container spacing={2}>
            <Grid2 sx={{ width: "100%" }}>
              <FormControl fullWidth required error={!!error}>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby="email-helper-text"
                />
                <FormHelperText id="email-helper-text">{error}</FormHelperText>
              </FormControl>
            </Grid2>
            <Grid2 sx={{ width: "100%" }}>
              <FormControl fullWidth required error={!!error}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="password-helper-text"
                />
                <FormHelperText id="password-helper-text">
                  {error}
                </FormHelperText>
              </FormControl>
            </Grid2>
            <Grid2 sx={{ width: "100%", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  padding: "12px",
                  borderRadius: 30,
                  boxShadow: 2,
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Login"
                )}
              </Button>
            </Grid2>
            <Grid2 sx={{ width: "100%", mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  variant="body2"
                  sx={{ color: "primary.main" }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Grid2>
          </Grid2>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Tabs,
  Tab,
  Grid,
  useTheme,
  Divider,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import { loginUser, registerUser } from "../utils/api";
import { useNavigate } from "react-router-dom";

const preferencesList = [
  "India",
  "US",
  "UK",
  "Technology",
  "Politics",
  "Entertainment",
  "Sports",
  "Business",
  "Science",
  "Health",
  "Travel",
  "Food",
  "Fashion",
  "Automotive",
  "History",
];

const Auth = () => {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "error",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setForm({ username: "", email: "", password: "" });
    setSelectedPreferences([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePreference = (pref) => {
    const lower = pref.toLowerCase();
    setSelectedPreferences((prev) =>
      prev.includes(lower) ? prev.filter((p) => p !== lower) : [...prev, lower]
    );
  };

  const handleSnackbarClose = () => setSnackbar((s) => ({ ...s, open: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, email, password } = form;

    if (tab === "login") {
      try {
        const result = await loginUser({ username, password });
        if (!result.success) throw new Error(result.error || "Login failed");
        dispatch(login({ username, token: result.data.token }));
        setSnackbar({
          open: true,
          message: "Login successful!",
          type: "success",
        });
        navigate("/");
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Username or password is incorrect.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        if (selectedPreferences.length < 5)
          throw new Error("Please select at least 5 preferences.");
        const reg = await registerUser({
          username,
          email,
          password,
          preferences: selectedPreferences,
        });
        if (!reg.success) throw new Error(reg.error || "Registration failed");
        const result = await loginUser({ username, password });
        if (!result.success) throw new Error("Login failed after registration");
        dispatch(login({ username, token: result.data.token }));
        setSnackbar({
          open: true,
          message: "Registration successful!",
          type: "success",
        });
        navigate("/");
      } catch (error) {
        setSnackbar({
          open: true,
          message: "username or email already exists.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: { xs: "100%", sm: 400 },
          borderRadius: 3,
          p: { xs: 2, sm: 4 },
          bgcolor: theme.palette.background.paper,
          boxShadow: `0 4px 24px 0 ${theme.palette.primary.main}18`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 2,
            ".MuiTab-root": {
              fontWeight: 600,
              fontSize: 16,
              color: theme.palette.text.secondary,
            },
            ".Mui-selected": {
              color: theme.palette.primary.main,
            },
            ".MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          <Tab label="Login" value="login" />
          <Tab label="Register" value="register" />
        </Tabs>
        <Divider sx={{ width: "100%", mb: 2 }} />
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.divider,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.secondary,
              },
            }}
            InputLabelProps={{
              sx: { color: theme.palette.text.secondary },
            }}
          />
          {tab === "register" && (
            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 1,
                  backgroundColor: theme.palette.background.paper,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.divider,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.secondary,
                },
              }}
              InputLabelProps={{
                sx: { color: theme.palette.text.secondary },
              }}
            />
          )}
          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={form.password}
            onChange={handleChange}
            autoComplete={tab === "login" ? "current-password" : "new-password"}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.divider,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.secondary,
              },
            }}
            InputLabelProps={{
              sx: { color: theme.palette.text.secondary },
            }}
          />
          {tab === "register" && (
            <>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Select at least 5 preferences
              </Typography>
              <Grid container spacing={1} mb={2} justifyContent="center">
                {preferencesList.map((pref) => {
                  const selected = selectedPreferences.includes(
                    pref.toLowerCase()
                  );
                  return (
                    <Grid item key={pref}>
                      <Chip
                        label={pref}
                        clickable
                        variant={selected ? "filled" : "outlined"}
                        color={selected ? "primary" : "default"}
                        onClick={() => togglePreference(pref)}
                        sx={{
                          fontWeight: 600,
                          fontSize: 15,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 3,
                          borderWidth: 2,
                          borderColor: theme.palette.primary.main,
                          transition: "all 0.2s",
                          boxShadow: selected
                            ? `0 2px 8px 0 ${theme.palette.primary.main}22`
                            : "none",
                          "&:hover": {
                            backgroundColor: selected
                              ? theme.palette.primary.dark
                              : theme.palette.action.hover,
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
              <Typography
                variant="caption"
                color={
                  selectedPreferences.length < 5 ? "error" : "success.main"
                }
                sx={{ display: "block", textAlign: "center", mb: 1 }}
              >
                {selectedPreferences.length < 5
                  ? "Please select at least 5 preferences to continue."
                  : "Ready to register!"}
              </Typography>
            </>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={
              loading || (tab === "register" && selectedPreferences.length < 5)
            }
            sx={{
              mt: 2,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: 17,
              py: 1.2,
              borderRadius: 3,
              boxShadow: `0 2px 8px 0 ${theme.palette.primary.main}22`,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              "&:hover": {
                background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : tab === "login" ? (
              "Login"
            ) : (
              "Register"
            )}
          </Button>
        </form>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.type}
            onClose={handleSnackbarClose}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Auth;

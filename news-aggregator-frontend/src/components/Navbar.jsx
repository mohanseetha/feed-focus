import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
} from "@mui/material";
import { WbSunny, DarkMode } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleColorMode, mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username, isLoggedIn } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = useCallback(
    (e) => setAnchorEl(e.currentTarget),
    []
  );
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const handleLogout = useCallback(() => {
    dispatch(logout());
    handleMenuClose();
    navigate("/auth");
  }, [dispatch, handleMenuClose, navigate]);

  const displayName =
    username?.charAt(0).toUpperCase() + username?.slice(1) || "";

  return (
    <AppBar position="static" color="default" elevation={3}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          sx={{
            cursor: "pointer",
            fontWeight: "bold",
            color: "primary.main",
            textDecoration: "none",
            userSelect: "none",
          }}
        >
          FeedFocus - {isLoggedIn ? `Welcome, ${displayName}` : "Home"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip
            title={
              mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
          >
            <IconButton
              onClick={toggleColorMode}
              size="medium"
              sx={{
                color: "primary.main",
                p: 0.5,
                borderRadius: 1,
              }}
              aria-label="toggle theme"
            >
              {mode === "light" ? <DarkMode /> : <WbSunny />}
            </IconButton>
          </Tooltip>
          {!isLoggedIn ? (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => navigate("/auth")}
              sx={{ fontWeight: 600, textTransform: "none" }}
            >
              Login
            </Button>
          ) : (
            <>
              <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "primary.main", color: "#fff" }}>
                  {displayName.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    bgcolor: "background.paper",
                    color: "text.primary",
                    minWidth: 140,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                >
                  View Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

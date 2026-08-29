import React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAuth } from "../auth/AuthContext";

const BASE_NAV_ITEMS = [
  { label: "Home", to: "/", icon: <HomeRoundedIcon fontSize="small" /> },
  {
    label: "Bookshelf",
    to: "/bookshelf",
    icon: <AutoStoriesRoundedIcon fontSize="small" />,
  },
  {
    label: "Wishlist",
    to: "/wishlist",
    icon: <FavoriteBorderRoundedIcon fontSize="small" />,
  },
  {
    label: "Pick My Shelf",
    to: "/pick-my-shelf",
    icon: <AutoAwesomeRoundedIcon fontSize="small" />,
  },
];

const OWNER_NAV_ITEM = {
  label: "Enter New Book",
  to: "/new-book",
  icon: <AddCircleOutlineRoundedIcon fontSize="small" />,
};

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // Only the owner can add books, so only show that link when logged in.
  const navItems = isAuthenticated
    ? [...BASE_NAV_ITEMS.slice(0, 2), OWNER_NAV_ITEM, ...BASE_NAV_ITEMS.slice(2)]
    : BASE_NAV_ITEMS;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: { xs: 72, sm: 88 },
          px: { xs: 2, sm: 5 },
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: isMobile ? 1.5 : 0,
          py: isMobile ? 1.5 : 0,
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            color: "text.primary",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AutoStoriesRoundedIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Box sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.01em" }}>
            OurLibrary
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexWrap: "wrap",
            order: isMobile ? 3 : 0,
            width: isMobile ? "100%" : "auto",
          }}
        >
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Box
                key={item.to}
                component={RouterLink}
                to={item.to}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1.1,
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontWeight: active ? 700 : 600,
                  fontSize: 14.5,
                  color: active ? "primary.dark" : "text.secondary",
                  bgcolor: active ? "#E3F5F2" : "transparent",
                  transition: "background-color 0.15s ease, color 0.15s ease",
                  "&:hover": {
                    bgcolor: active ? "#E3F5F2" : "#F5F2EC",
                  },
                }}
              >
                {item.icon}
                {item.label}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Box
                component={RouterLink}
                to="/new-book"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  bgcolor: "primary.main",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  px: 2.25,
                  py: 1.1,
                  borderRadius: "999px",
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <AddRoundedIcon fontSize="small" />
                Add Book
              </Box>
              <Box
                component="button"
                onClick={handleLogout}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  bgcolor: "transparent",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: 14,
                  px: 2,
                  py: 1,
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: "#F5F2EC" },
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
                Log Out
              </Box>
            </>
          ) : (
            <Box
              component={RouterLink}
              to="/login"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                bgcolor: "primary.main",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 14,
                px: 2.25,
                py: 1.1,
                borderRadius: "999px",
                transition: "background-color 0.15s ease",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <LoginRoundedIcon fontSize="small" />
              Log In
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

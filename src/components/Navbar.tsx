import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
          }}
        >
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/bookshelf">
            Bookshelf
          </Button>
          <Button color="inherit" component={RouterLink} to="/new-book">
            Enter New Book
          </Button>
          <Button color="inherit" component={RouterLink} to="/wishlist">
            Wishlist
          </Button>
          <Button color="inherit" component={RouterLink} to="/pick-my-shelf">
            Pick My Shelf
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

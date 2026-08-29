import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const API_URL = "http://localhost:5089";

interface Book {
  status?: string;
}

const SHELF_COLORS = [
  "#0F9B8E",
  "#FF6B4A",
  "#F2C46D",
  "#7C9CE0",
  "#0B6F65",
  "#E4AF8E",
  "#A98FD2",
];

const Home: React.FC = () => {
  const [ownedCount, setOwnedCount] = useState<number | null>(null);
  const [wishlistCount, setWishlistCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCounts = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/Books`);
        if (!response.ok) return;
        const data: Book[] = await response.json();
        if (cancelled) return;
        setOwnedCount(data.filter((b) => b.status === "Owned").length);
        setWishlistCount(data.filter((b) => b.status === "Wanted").length);
      } catch {
        // Home page stays welcoming even if the API is unreachable
      }
    };

    fetchCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    { value: ownedCount, label: "books on the shelf" },
    { value: wishlistCount, label: "on the wishlist" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 88px)",
        px: { xs: 3, md: 8 },
        py: { xs: 6, md: 0 },
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: -140,
          top: 80,
          width: 560,
          height: 560,
          borderRadius: "50%",
          bgcolor: "#E3F5F2",
          opacity: 0.6,
          zIndex: 0,
          display: { xs: "none", md: "block" },
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1, flex: "0 0 auto", maxWidth: 560 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "999px",
            px: 2,
            py: 0.75,
            fontWeight: 700,
            fontSize: 13,
            color: "primary.dark",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "primary.dark",
            }}
          />
          Welcome back!
        </Box>

        <Typography
          variant="h1"
          sx={{ fontSize: { xs: 36, md: 48 }, lineHeight: 1.1, mb: 3 }}
        >
          Your family's next great read is on the shelf.
        </Typography>

        <Typography
          variant="body1"
          sx={{ fontSize: 18, lineHeight: 1.6, color: "text.secondary", mb: 4 }}
        >
          Track every book you own, keep a wishlist for what's next, and let
          Pick My Shelf find a story everyone will love.
        </Typography>

        <Box sx={{ display: "flex", gap: 1.75, mb: 4, flexWrap: "wrap" }}>
          <Box
            component={RouterLink}
            to="/bookshelf"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "primary.main",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 16,
              px: 3.25,
              py: 1.75,
              borderRadius: "14px",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <AutoStoriesRoundedIcon fontSize="small" />
            Browse the Bookshelf
          </Box>
          <Box
            component={RouterLink}
            to="/new-book"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "background.paper",
              color: "text.primary",
              border: "1px solid",
              borderColor: "divider",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 16,
              px: 3.25,
              py: 1.75,
              borderRadius: "14px",
              "&:hover": { bgcolor: "#F5F2EC" },
            }}
          >
            <AddRoundedIcon fontSize="small" />
            Add a Book
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {stats.map((stat) => (
            <Box
              key={stat.label}
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "16px",
                px: 2.5,
                py: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minWidth: 130,
              }}
            >
              <Typography sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>
                {stat.value ?? "–"}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.3 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "flex-end",
          gap: 1.25,
          pb: "6px",
          borderBottom: "6px solid #E4D9C4",
        }}
      >
        {SHELF_COLORS.map((color, i) => (
          <Box
            key={color}
            sx={{
              width: 44,
              height: 150 + ((i * 37) % 90),
              borderRadius: "6px 6px 0 0",
              bgcolor: color,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Home;

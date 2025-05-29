import { Box, Typography, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Box
    sx={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "background.default",
      px: 2,
    }}
  >
    <Paper
      elevation={6}
      sx={{
        p: { xs: 3, sm: 6 },
        borderRadius: 4,
        bgcolor: "background.paper",
        boxShadow: (theme) => `0 8px 32px 0 ${theme.palette.primary.main}22`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 420,
        width: "100%",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 900,
          fontSize: { xs: "4rem", sm: "6rem" },
          color: "primary.main",
          mb: 1,
          letterSpacing: 4,
          lineHeight: 1,
        }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 2,
        }}
      >
        Lost in the static.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 4,
          maxWidth: 320,
        }}
      >
        The page you’re looking for isn’t here. Maybe it never was. But the
        story continues—let’s find our way back.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        sx={{
          px: 4,
          py: 1.2,
          fontWeight: 700,
          fontSize: 18,
          borderRadius: 3,
          boxShadow: (theme) => `0 2px 8px 0 ${theme.palette.primary.main}22`,
          background: (theme) =>
            `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          "&:hover": {
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
          },
        }}
      >
        Go Home
      </Button>
    </Paper>
  </Box>
);

export default NotFound;

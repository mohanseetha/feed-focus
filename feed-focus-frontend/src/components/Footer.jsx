import { Box, Typography, Container } from "@mui/material";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 3,
      mt: 5,
      bgcolor: (theme) => theme.palette.background.footer,
      color: (theme) => theme.palette.text.footer,
      borderTop: "1px solid",
      borderColor: (theme) => theme.palette.divider,
      width: "100%",
    }}
  >
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <Typography variant="body2" sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
        © 2025 <strong>FeedFocus</strong> — Your personalized news digest.
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.75rem",
          opacity: 0.7,
          mt: 0.5,
          display: "block",
        }}
      >
        Built with 💜 for curious minds.
      </Typography>
    </Container>
  </Box>
);

export default Footer;

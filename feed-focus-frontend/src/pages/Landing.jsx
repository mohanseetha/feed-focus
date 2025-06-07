import { Box, Button, Typography, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={4} textAlign="center">
          <Box>
            <Typography
              variant="h2"
              fontWeight={700}
              color="primary.main"
              gutterBottom
              sx={{ fontSize: { xs: "2.2rem", md: "3rem" } }}
            >
              Stay Ahead with the News That Matters
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Get curated headlines, trending stories, and real-time updates all
              in one place.
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Whether you're into tech, politics, sports, or lifestyle our smart
            engine brings you the most relevant articles, tailored to your
            interests.
          </Typography>
          <Box>
            <Button
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: 3 }}
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Landing;

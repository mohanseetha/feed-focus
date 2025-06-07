import { useState } from "react";
import { Box, Chip, Container } from "@mui/material";
import ArticleList from "../components/ArticleList";

const topicsList = [
  "All",
  "Top Stories",
  "Your Feed",
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

const Home = () => {
  const [selectedTopic, setSelectedTopic] = useState("All");

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            overflowX: "auto",
            display: "flex",
            gap: 1,
            pb: 2,
            px: 1,
            scrollbarWidth: "none",
            scrollSnapType: "x mandatory",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {topicsList.map((topic) => (
            <Chip
              key={topic}
              label={topic}
              clickable
              variant={selectedTopic === topic ? "filled" : "outlined"}
              color={selectedTopic === topic ? "primary" : "default"}
              onClick={() => setSelectedTopic(topic)}
              sx={{
                textTransform: "capitalize",
                scrollSnapAlign: "start",
                fontWeight: selectedTopic === topic ? 700 : 500,
                letterSpacing: 0.5,
              }}
            />
          ))}
        </Box>
        <ArticleList props={selectedTopic} />
      </Box>
    </Container>
  );
};

export default Home;

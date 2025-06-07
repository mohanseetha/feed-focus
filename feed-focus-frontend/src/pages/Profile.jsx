import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArticleCard from "../components/ArticleCard";
import { getUserProfile, updatePreferences } from "../utils/api";

const allPreferences = [
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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [visibleBookmarks, setVisibleBookmarks] = useState(5);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const response = await getUserProfile();
      setUser(response);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (showEditor && user) {
      setSelectedPrefs((user.preferences || []).map((p) => p.toLowerCase()));
    }
  }, [showEditor, user]);

  const handleEditClick = () => setShowEditor(true);
  const handleCancelEdit = () => setShowEditor(false);

  const handleSavePrefs = async () => {
    if (selectedPrefs.length < 5) {
      setSnackbar({
        open: true,
        message: "Please select at least 5 preferences.",
        type: "error",
      });
      return;
    }
    await updatePreferences(selectedPrefs);
    const response = await getUserProfile();
    setUser(response);
    setShowEditor(false);
    setSnackbar({
      open: true,
      message: "Preferences updated.",
      type: "success",
    });
  };

  const togglePreference = (pref) => {
    const lowerPref = pref.toLowerCase();
    setSelectedPrefs((prev) =>
      prev.includes(lowerPref)
        ? prev.filter((p) => p !== lowerPref)
        : [...prev, lowerPref]
    );
  };

  const handleViewMore = () => setVisibleBookmarks((prev) => prev + 10);
  const handleSnackbarClose = () => setSnackbar((s) => ({ ...s, open: false }));

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          {user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s
          Profile
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Preferences
          </Typography>
          {(!user.preferences || user.preferences.length === 0) && (
            <Typography variant="body2" color="text.secondary">
              No preferences set.
            </Typography>
          )}
          <IconButton
            size="small"
            sx={{ color: "#5e4b8b" }}
            onClick={handleEditClick}
          >
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
        </Box>
        {showEditor ? (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 1,
                mb: 2,
              }}
            >
              {allPreferences.map((pref) => {
                const isSelected = selectedPrefs.includes(pref.toLowerCase());
                return (
                  <Chip
                    key={pref}
                    label={pref}
                    clickable
                    onClick={() => togglePreference(pref)}
                    variant={isSelected ? "filled" : "outlined"}
                    color={isSelected ? "primary" : "default"}
                    sx={{ borderRadius: "16px", fontSize: "0.8rem" }}
                  />
                );
              })}
            </Box>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                size="small"
                sx={{ borderRadius: "20px" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSavePrefs}
                size="small"
                sx={{ borderRadius: "20px", backgroundColor: "#5e4b8b" }}
              >
                OK
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {(user.preferences || []).map((pref) => (
              <Chip
                key={pref}
                label={pref}
                variant="outlined"
                sx={{ textTransform: "capitalize", borderRadius: "16px" }}
              />
            ))}
          </Box>
        )}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, mt: 4 }}>
          Bookmarks
        </Typography>
        {!user.bookmarks || user.bookmarks.length === 0 ? (
          <Typography variant="body2" color="text.secondary" mb={1}>
            You have no bookmarked articles.
          </Typography>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" mb={2}>
              You have {user.bookmarks.length} bookmarked articles.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {user.bookmarks
                .sort(
                  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
                )
                .slice(0, visibleBookmarks)
                .map((article) => (
                  <ArticleCard
                    key={article._id || article.id || article.url}
                    article={article}
                    bookmarks={user.bookmarks}
                    showTopic={true}
                  />
                ))}
            </Box>
            {visibleBookmarks < user.bookmarks.length && (
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button onClick={handleViewMore} sx={{ color: "#5e4b8b" }}>
                  View more
                </Button>
              </Box>
            )}
          </>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
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
      </Box>
    </Container>
  );
};

export default Profile;

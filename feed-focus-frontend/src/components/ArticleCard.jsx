import { memo, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Chip,
  Box,
  Link,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { addBookmark, removeBookmark } from "../utils/api";
import { useSelector } from "react-redux";

const CHAR_LIMIT = 500;

const ArticleCard = memo(({ article, bookmarks = [], showTopic = false }) => {
  const { title, url, source, publishedAt, content = "", topic } = article;
  const { isLoggedIn } = useSelector((state) => state.user);

  const isBookmarked =
    Array.isArray(bookmarks) && bookmarks.some((b) => b && b.url === url);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const isLongContent = content.length > CHAR_LIMIT;
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleBookmarkToggle = useCallback(async () => {
    if (!isLoggedIn) {
      alert("Please login to bookmark articles.");
      return;
    }
    try {
      if (!bookmarked) {
        await addBookmark(article);
        setBookmarked(true);
      } else {
        await removeBookmark(article);
        setBookmarked(false);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error.message);
    }
  }, [isLoggedIn, bookmarked, article]);

  return (
    <Card
      elevation={3}
      sx={{
        width: { xs: "100%", sm: "95%", md: "750px" },
        maxWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3,
        p: { xs: 1, sm: 2 },
        bgcolor: "background.paper",
        position: "relative",
        boxSizing: "border-box",
        m: { xs: 1, sm: 2, md: 2 },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              wordBreak: "break-word",
              whiteSpace: "pre-line",
              flex: 1,
              pr: 1,
            }}
          >
            {title}
          </Typography>
          <Tooltip title={bookmarked ? "Remove Bookmark" : "Add Bookmark"}>
            <IconButton
              onClick={handleBookmarkToggle}
              color="primary"
              sx={{
                color: "secondary.main",
                bgcolor: "background.default",
                p: { xs: 0.75, sm: 1 },
                "&:hover": { bgcolor: "action.hover" },
                mt: "-4px",
              }}
              size="large"
            >
              {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          gutterBottom
          sx={{
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
            mb: { xs: 0.5, sm: 1 },
          }}
        >
          {formattedDate} • {source}
        </Typography>
        {showTopic && topic && (
          <Chip
            label={topic.charAt(0).toUpperCase() + topic.slice(1)}
            size="small"
            color="primary"
            sx={{ mb: { xs: 1, sm: 2 } }}
          />
        )}
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            fontSize: { xs: "0.98rem", sm: "1rem" },
            wordBreak: "break-word",
            whiteSpace: "pre-line",
            display: "inline",
          }}
        >
          {isLongContent && !showFullContent ? (
            <>
              {content.slice(0, CHAR_LIMIT)}
              <Box
                component="span"
                sx={{
                  color: "primary.main",
                  cursor: "pointer",
                  ml: 0.5,
                  fontWeight: 500,
                }}
                onClick={() => setShowFullContent(true)}
              >
                Show More
              </Box>
              {"..."}
            </>
          ) : (
            <>
              {content}
              {isLongContent && (
                <Box
                  component="span"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    textDecoration: "underline",
                    ml: 0.5,
                    fontWeight: 500,
                  }}
                  onClick={() => setShowFullContent(false)}
                >
                  Show Less
                </Box>
              )}
            </>
          )}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: "flex-end",
          p: { xs: 1, sm: 2 },
          pt: 0,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="small"
          endIcon={<OpenInNewIcon />}
          component={Link}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read Full Article
        </Button>
      </CardActions>
    </Card>
  );
});

export default ArticleCard;

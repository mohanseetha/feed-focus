import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import ArticleCard from "./ArticleCard";
import {
  getUserProfile,
  getUserArticles,
  getAllArticles,
  getArticlesByTopic,
} from "../utils/api";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ARTICLES_PER_PAGE = 20;

const ArticleList = ({ props }) => {
  const filterTopic = props?.toLowerCase() || "all";
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [bookmarkError, setBookmarkError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      setLoading(true);
      setError("");
      setPage(1);
      try {
        let response;
        if (filterTopic === "all") {
          response = await getAllArticles();
        } else if (filterTopic === "your feed") {
          if (!user?.username) throw new Error("User not logged in.");
          response = await getUserArticles();
        } else if (filterTopic === "top stories") {
          response = await getArticlesByTopic("general");
        } else {
          response = await getArticlesByTopic(filterTopic);
        }
        if (isMounted) setArticles(response?.data || []);
      } catch (err) {
        if (isMounted) {
          setError(
            err?.message || "Something went wrong while loading articles."
          );
          setArticles([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchArticles();
    return () => {
      isMounted = false;
    };
  }, [filterTopic, user?.username]);

  useEffect(() => {
    let isMounted = true;
    const fetchBookmarks = async () => {
      if (!user?.username) {
        setBookmarks([]);
        return;
      }
      setLoadingBookmarks(true);
      setBookmarkError("");
      try {
        const response = await getUserProfile();
        const profile = response?.data || {};
        if (isMounted) setBookmarks(profile.bookmarks || []);
      } catch (err) {
        if (isMounted) {
          setBookmarkError("Failed to load bookmarks", err?.message || "");
          setBookmarks([]);
        }
      } finally {
        if (isMounted) setLoadingBookmarks(false);
      }
    };
    fetchBookmarks();
    return () => {
      isMounted = false;
    };
  }, [user?.username]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page]);

  const totalPages = Math.max(
    1,
    Math.ceil(articles.length / ARTICLES_PER_PAGE)
  );

  const paginatedArticles = useMemo(() => {
    const startIndex = (page - 1) * ARTICLES_PER_PAGE;
    return articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
  }, [articles, page]);

  const handlePrevPage = useCallback(
    () => setPage((p) => Math.max(p - 1, 1)),
    []
  );
  const handleNextPage = useCallback(
    () => setPage((p) => Math.min(p + 1, totalPages)),
    [totalPages]
  );

  // Pagination logic for modern look: show up to 4 pages, with ellipsis and first/last
  const getPageNumbers = () => {
    if (totalPages <= 4)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 2) return [1, 2, 3, 4];
    if (page >= totalPages - 1)
      return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 1, page, page + 1, page + 2];
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          mt: 6,
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, px: 2 }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (articles.length === 0) {
    return (
      <Box sx={{ mt: 4, px: 2 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          No articles found for "{props}"
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      {bookmarkError && (
        <Typography variant="body2" color="error" align="center" mb={2}>
          {bookmarkError}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
        }}
      >
        {paginatedArticles.map((article) => (
          <ArticleCard
            key={article._id?.$oid || article._id || article.id}
            article={article}
            bookmarks={bookmarks}
            loadingBookmarks={loadingBookmarks}
            showTopic={filterTopic === "all"}
          />
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.5,
          mt: 4,
          flexWrap: "wrap",
        }}
      >
        <IconButton
          onClick={handlePrevPage}
          disabled={page <= 1}
          aria-label="Previous page"
          sx={{
            color: page <= 1 ? "#b0a8c9" : "#5e4b8b",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "#e0e0e0",
            mx: 0.5,
            width: 40,
            height: 40,
          }}
        >
          <ChevronLeftIcon fontSize="medium" />
        </IconButton>

        {page > 3 && totalPages > 4 && (
          <>
            <Box
              component="button"
              onClick={() => setPage(1)}
              aria-label="Go to page 1"
              sx={{
                mx: 0.5,
                px: 2,
                py: 1,
                minWidth: 36,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "#e0e0e0",
                bgcolor: "background.paper",
                color: "#5e4b8b",
                fontWeight: 500,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "#ede7f6",
                  borderColor: "#5e4b8b",
                },
              }}
              disabled={page === 1}
            >
              1
            </Box>
            <Typography sx={{ mx: 0.5, minWidth: 20, textAlign: "center" }}>
              …
            </Typography>
          </>
        )}

        {getPageNumbers().map((p) => (
          <Box
            key={p}
            component="button"
            onClick={() => setPage(p)}
            aria-label={`Go to page ${p}`}
            disabled={page === p}
            sx={{
              mx: 0.5,
              px: 2,
              py: 1,
              minWidth: 36,
              borderRadius: 2,
              border: "1px solid",
              borderColor: page === p ? "#5e4b8b" : "#e0e0e0",
              bgcolor: page === p ? "#5e4b8b" : "background.paper",
              color: page === p ? "#fff" : "#5e4b8b",
              fontWeight: page === p ? 700 : 500,
              cursor: page === p ? "default" : "pointer",
              fontSize: "1rem",
              transition: "all 0.2s",
              "&:hover:not(:disabled)": {
                bgcolor: "#ede7f6",
                borderColor: "#5e4b8b",
              },
            }}
          >
            {p}
          </Box>
        ))}

        {totalPages > 4 && page < totalPages - 1 && (
          <>
            <Typography sx={{ mx: 0.5, minWidth: 20, textAlign: "center" }}>
              …
            </Typography>
            <Box
              component="button"
              onClick={() => setPage(totalPages)}
              aria-label={`Go to page ${totalPages}`}
              sx={{
                mx: 0.5,
                px: 2,
                py: 1,
                minWidth: 36,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "#e0e0e0",
                bgcolor: "background.paper",
                color: "#5e4b8b",
                fontWeight: 500,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "#ede7f6",
                  borderColor: "#5e4b8b",
                },
              }}
              disabled={page === totalPages}
            >
              {totalPages}
            </Box>
          </>
        )}

        <IconButton
          onClick={handleNextPage}
          disabled={page >= totalPages}
          aria-label="Next page"
          sx={{
            color: page >= totalPages ? "#b0a8c9" : "#5e4b8b",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "#e0e0e0",
            mx: 0.5,
            width: 40,
            height: 40,
          }}
        >
          <ChevronRightIcon fontSize="medium" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default React.memo(ArticleList);

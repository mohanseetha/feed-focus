import { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { lightTheme, darkTheme } from "./theme/theme";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./layout/Layout";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("appThemeMode");
    if (saved === "light" || saved === "dark") return saved;
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("appThemeMode", mode);
    document.body.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            element={<Layout toggleColorMode={toggleColorMode} mode={mode} />}
          >
            <Route path="auth" element={<Auth />} />
            <Route path="tryit" element={<Landing />} />
          </Route>
          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout toggleColorMode={toggleColorMode} mode={mode} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

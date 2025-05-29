import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ toggleColorMode, mode }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      bgcolor: "background.default",
    }}
  >
    <Navbar toggleColorMode={toggleColorMode} mode={mode} />
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
    <Footer />
  </Box>
);

export default Layout;

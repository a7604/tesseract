import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Analytics } from "./firebase";

import Navbar from "./components/navbar";
import Home from "./pages/home";
import Tesserex from "./pages/tesserex";
import PastEvents from "./pages/pastEvents";
import Team from "./pages/team";
import Helpdesk from "./pages/helpdesk";
import Register from "./pages/register";
import Login from "./pages/Login";

function App() {
  const location = useLocation();
  
  useEffect(() => {
    // Track page views
    Analytics.logPageView(location.pathname);
  }, [location]);

  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tesserex" element={<Tesserex />} />
        <Route path="/register/:id" element={<Register />} />
        <Route path="/past-events" element={<PastEvents />} />
        <Route path="/team" element={<Team />} />
        <Route path="/helpdesk" element={<Helpdesk />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

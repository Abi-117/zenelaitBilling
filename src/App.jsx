import { Routes, Route, Navigate } from "react-router-dom";
import BillingApp from "./pages/BillingApp";
import ChatbotWidget from "./pages/ChatbotWidget";
import LoginPage from "./components/LoginPage";
import PublicPayPage from "./components/views/Payments/links/PublicPayPage";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Routes>
      {/* Public payment link page */}
      <Route path="/pay/:linkId" element={<PublicPayPage />} />

      {/* Login page */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />}
      />

      {/* Protected app routes */}
      <Route
        path="/*"
        element={
          isLoggedIn ? (
            <>
              <BillingApp />
              <ChatbotWidget />
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;

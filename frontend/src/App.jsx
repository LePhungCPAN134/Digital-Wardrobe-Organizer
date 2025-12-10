import { Routes, Route, Link } from "react-router-dom";
import ClothingList from "./pages/ClothingList";
import ClothingForm from "./pages/ClothingForm";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("pendingEmail");
    window.location.href = "/login";
  }

  const user = JSON.parse(localStorage.getItem("authUser") || "null");
  const isAdmin = user?.roles?.includes("admin");

  return (
    <div>
      <nav>
        <Link to="/clothing">Clothing</Link>{" "}
        <Link to="/clothing/new">Add Clothing</Link>{" "}
        <Link to="/login">Login</Link>{" "}
        {user && (
          <button type="button" onClick={handleLogout}>
            Logout ({user.email})
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />

        <Route
          path="/clothing"
          element={
            <ProtectedRoute>
              <ClothingList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clothing/new"
          element={
            <ProtectedRoute>
              {isAdmin ? (
                <ClothingForm />
              ) : (
                <p>You must be admin to add clothing.</p>
              )}
            </ProtectedRoute>
          }
        />
        {/* add other protected routes here */}
      </Routes>
    </div>
  );
}

export default App;
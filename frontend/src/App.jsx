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
        {/* public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />

        {/* protected routes */}
        <Route
          path="/clothing"
          element={
            <ProtectedRoute>
              <ClothingList />
            </ProtectedRoute>
          }
        />
        {/* reate new clothing */}
        <Route
          path="/clothing/new"
          element={
            <ProtectedRoute>
                <ClothingForm />
            </ProtectedRoute>
          }
        />
        {/* edit existing clothing */}
        <Route
          path="/clothing/:id"
          element={
            <ProtectedRoute>
                <ClothingForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
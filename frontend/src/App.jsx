import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import ClothingList from "./pages/ClothingList";
import ClothingForm from "./pages/ClothingForm";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import ProtectedRoute from "./components/ProtectedRoute";
import OutfitList from "./pages/OutfitList";
import OutfitForm from "./pages/OutfitForm";

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
    <div className="app-shell">
      {/* HEADER */}
      <header className="app-header">
        {/* Row 1: title + logout */}
        <div className="app-header-top">
          <h1 className="app-title">YOUR WARDROBE</h1>

          <div className="app-header-right">
            {user && (
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout ({user.email})
              </button>
            )}
          </div>
        </div>

        {/* Row 2: navigation links */}
        <nav className="app-nav">
          {/* "Closet" = clothing list */}
          <Link to="/clothing" className="nav-link">
            Closet
          </Link>
          <Link to="/clothing/new" className="nav-link">
            Add Clothing
          </Link>
          <Link to="/outfits" className="nav-link">
            Outfits
          </Link>
          <Link to="/outfits/new" className="nav-link">
            Add Outfit
          </Link>
          {!user && (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="app-main">
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
                <ClothingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clothing/:id"
            element={
              <ProtectedRoute>
                <ClothingForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/outfits"
            element={
              <ProtectedRoute>
                <OutfitList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outfits/new"
            element={
              <ProtectedRoute>
                <OutfitForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outfits/:id"
            element={
              <ProtectedRoute>
                <OutfitForm />
              </ProtectedRoute>
            }
          />

          {/* default route → closet */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ClothingList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
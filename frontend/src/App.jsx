import { Routes, Route, Link } from "react-router-dom";
import ClothingList from "./pages/ClothingList";
import ClothingForm from "./pages/ClothingForm";

function App() {
  return (
    <div style={{ padding: "1rem" }}>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/clothing">Clothing Items</Link>{" "}
        | <Link to="/clothing/new">Add Clothing</Link>
      </nav>

      <Routes>
        <Route path="/clothing" element={<ClothingList />} />
        <Route path="/clothing/new" element={<ClothingForm />} />
        <Route path="/clothing/:id" element={<ClothingForm />} />
      </Routes>
    </div>
  );
}

export default App;


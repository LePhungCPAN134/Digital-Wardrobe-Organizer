import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchClothingItems, deleteClothingItem } from "../api/clothingApi";

const getImageSrc = (item) => {
  if (!item.imageUrl) return null;
  if (item.imageUrl.startsWith("http")) return item.imageUrl;
  // for uploaded files like "/uploads/filename.jpg"
  return `http://localhost:3000${item.imageUrl}`;
};

function ClothingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  async function loadItems() {
    try {
      setLoading(true);
      const res = await fetchClothingItems();
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load clothing items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const name = item.name?.toLowerCase() || "";
    const category = item.category?.toLowerCase() || "";

    return name.includes(q) || category.includes(q);
  });  

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteClothingItem(id);
      setMessage("Item deleted successfully.");
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete item.");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Closet</h1>

      {message && <p>{message}</p>}

      {/* Search bar */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "4px 8px", minWidth: "250px" }}
        />
      </div>  

      {/* Results badge */}
      <div style={{ marginBottom: "0.5rem", fontStyle: "italic" }}>
        {search.trim() === "" ? (
          <span>{items.length} total items</span>
        ) : filteredItems.length > 0 ? (
          <span>{filteredItems.length} results</span>
        ) : (
          <span>No results</span>
        )}
      </div>

      {/* Filtered results */}
      {filteredItems.length === 0 ? (
        <p>No items match your search.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Color</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const src = getImageSrc(item);
              return (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.color}</td>
                  <td>
                    {src ? (
                      <img
                        src={src}
                        alt={item.name}
                        style={{ width: "60px" }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <Link to={`/clothing/${item._id}`}>Edit</Link>{" "}
                    <button onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: "1rem" }}>
        <Link to="/clothing/new">+ Add New</Link>
      </p>
    </div>
  );
}

export default ClothingList;
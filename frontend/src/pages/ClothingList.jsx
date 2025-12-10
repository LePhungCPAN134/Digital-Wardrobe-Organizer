import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchClothingItems, deleteClothingItem } from "../api/clothingApi";

function ClothingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteClothingItem(id);
      setMessage("Item deleted successfully.");
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete item.");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Clothing Items</h1>

      {message && <p>{message}</p>}

      {items.length === 0 ? (
        <p>No clothing items yet. <Link to="/clothing/new">Add one</Link></p>
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
            {items.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.color}</td>
                <td>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
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
            ))}
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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOutfits, deleteOutfit } from "../api/outfitApi";

function OutfitList() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadOutfits() {
    try {
      setLoading(true);
      const res = await fetchOutfits();
      setOutfits(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load outfits.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOutfits();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this outfit?")) return;
    try {
      await deleteOutfit(id);
      setOutfits((prev) => prev.filter((o) => o._id !== id));
      setMessage("Outfit deleted.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete outfit.");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Outfits</h1>
      {message && <p>{message}</p>}

      {outfits.length === 0 ? (
        <p>
          No outfits yet. <Link to="/outfits/new">Create one</Link>
        </p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Occasion</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {outfits.map((o) => (
              <tr key={o._id}>
                <td>{o.name}</td>
                <td>{o.occasion}</td>
                <td>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {(o.items || []).map((item) => {
                        // item can be an object (populated) or just an id string
                        const id = item._id || item;
                        const name = item.name || id;
                        const imageUrl = item.imageUrl;

                        return (
                            <div key={id} style={{ textAlign: "center" }}>
                            {imageUrl ? (
                                <img
                                src={imageUrl}
                                alt={name}
                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid #555",
                                    fontSize: "10px",
                                }}
                                >
                                No image
                                </div>
                            )}
                            <div style={{ fontSize: "11px", marginTop: "4px" }}>{name}</div>
                            </div>
                        );
                        })}
                    </div>
                </td>
                <td>
                  <Link to={`/outfits/${o._id}`}>Edit</Link>{" "}
                  <button onClick={() => handleDelete(o._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: "1rem" }}>
        <Link to="/outfits/new">+ Add Outfit</Link>
      </p>
    </div>
  );
}

export default OutfitList;
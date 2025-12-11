import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOutfits, deleteOutfit } from "../api/outfitApi";

const getImageSrc = (imageUrl) => {
  if (!imageUrl) return null;
  return imageUrl.startsWith("http")
    ? imageUrl
    : `http://localhost:3000${imageUrl}`;
};

function OutfitList() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState(""); 

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

  const filteredOutfits = outfits.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const name = o.name?.toLowerCase() || "";
    const occasion = o.occasion?.toLowerCase() || "";

    return name.includes(q) || occasion.includes(q);
  });  

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
      
        {/* Search bar */}
        <div style={{ marginBottom: "1rem" }}>
            <input
            type="text"
            placeholder="Search by name or occasion…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "4px 8px", minWidth: "250px" }}
            />
        </div>  

        {/* Results badge */}
        <div style={{ marginBottom: "0.5rem", fontStyle: "italic" }}>
        {search.trim() === "" ? (
            <span>{outfits.length} total outfits</span>
        ) : filteredOutfits.length > 0 ? (
            <span>{filteredOutfits.length} results</span>
        ) : (
            <span>No results</span>
        )}
        </div>

        {filteredOutfits.length === 0 ? (
            <p>
            No outfits match your search.{" "} <Link to="/outfits/new">Create one</Link>
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
                {filteredOutfits.map((o) => (
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
                                    src={getImageSrc(imageUrl)}
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
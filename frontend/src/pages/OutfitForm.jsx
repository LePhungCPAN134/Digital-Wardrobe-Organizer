import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchClothingItems } from "../api/clothingApi";
import { createOutfit, updateOutfit, fetchOutfit } from "../api/outfitApi";

const initialForm = {
  name: "",
  occasion: "",
  items: [],        // clothing IDs
};

function OutfitForm() {
  const { id } = useParams();             // if editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [clothingOptions, setClothingOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Load all clothing items for multi-select
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchClothingItems();
        setClothingOptions(res.data || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load clothing items.");
      }
    })();
  }, []);

  // If edit mode, load the existing outfit
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        const res = await fetchOutfit(id);
        const data = res.data;
        setForm({
          name: data.name || "",
          occasion: data.occasion || "",
          items: (data.items || []).map((i) => (i._id || i)), // handle populated or ids
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load outfit.");
      }
    })();
  }, [id, isEdit]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    else if (form.name.trim().length < 3)
      e.name = "Name must be at least 3 characters.";

    if (!form.occasion.trim()) e.occasion = "Occasion is required.";
    else if (form.occasion.trim().length < 3)
      e.occasion = "Occasion must be at least 3 characters.";

    if (!form.items.length)
      e.items = "Please select at least one clothing item.";

    setErrors(e);
    return Object.keys(e).length === 0;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function toggleItem(id) {
        setForm((prev) => {
        const exists = prev.items.includes(id);
        return {
            ...prev,
            items: exists
            ? prev.items.filter((x) => x !== id)
            : [...prev.items, id],
        };
        });
    }

    function handleCancel() {
    navigate("/outfits");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        if (!validate()) return;

        try {
        if (isEdit) {
            await updateOutfit(id, form);
            setMessage("Outfit updated.");
        } else {
            await createOutfit(form);
            setMessage("Outfit created.");
            setForm(initialForm);
        }
        setTimeout(() => navigate("/outfits"), 500);
        } catch (err) {
        console.error(err);
        setMessage("Failed to save outfit.");
        }
    }

    return (
        <div>
        <h1>{isEdit ? "Edit Outfit" : "Create Outfit"}</h1>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
            <div>
            <label>
                Name:
                <input
                name="name"
                value={form.name}
                onChange={handleChange}
                />
            </label>
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            </div>

            <div>
            <label>
                Occasion:
                <input
                name="occasion"
                value={form.occasion}
                onChange={handleChange}
                />
            </label>
            {errors.occasion && (
                <p style={{ color: "red" }}>{errors.occasion}</p>
            )}
            </div>

            <div>
            <p>Select clothing items:</p>
            {errors.items && <p style={{ color: "red" }}>{errors.items}</p>}
            {clothingOptions.length === 0 ? (
                <p>No clothing available. Add some first.</p>
            ) : (
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {clothingOptions.map((item) => (
                    <li key={item._id}>
                    <label>
                        <input
                        type="checkbox"
                        checked={form.items.includes(item._id)}
                        onChange={() => toggleItem(item._id)}
                        />
                        {" "}
                        {item.name} ({item.category}, {item.color})
                    </label>
                    </li>
                ))}
                </ul>
            )}
            </div>

            <button type="submit">{isEdit ? "Update Outfit" : "Create Outfit"}</button>
            <button type="button" onClick={handleCancel} style={{ marginLeft: "0.5rem" }}>Cancel</button>
        </form>
    </div>
  );
}

export default OutfitForm;
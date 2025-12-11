import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createClothingItem, updateClothingItem, fetchClothingItem } from "../api/clothingApi";

const initialForm = {
  name: "",
  category: "",
  color: "",
  imageUrl: "",
};

function ClothingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await fetchClothingItem(id);
        setForm({
          name: res.data.name || "",
          category: res.data.category || "",
          color: res.data.color || "",
          imageUrl: res.data.imageUrl || "",
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load clothing item.");
      }
    })();
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCancel() {
    navigate("/clothing");
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (!form.color.trim()) {
      newErrors.color = "Color is required.";
    }

    // Simple URL check for imageUrl
    if (form.imageUrl && !/^https?:\/\//i.test(form.imageUrl)) {
      newErrors.imageUrl = "Image URL should start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleFileChange(e) {
    setFile(e.target.files[0] || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    try {
      if (isEdit) {
        // edit stays JSON-only for now
        await updateClothingItem(id, form);
        setMessage("Item updated successfully.");
      } else {
        const data = new FormData();
        data.append("name", form.name);
        data.append("category", form.category);
        data.append("color", form.color);

        // send either imageUrl or file
        if (file) {
          data.append("image", file); // must match upload.single("image")
        } else if (form.imageUrl) {
          data.append("imageUrl", form.imageUrl);
        }

        await createClothingItem(data);
        setMessage("Item created successfully.");
        setForm(initialForm);
        setFile(null);
      }

      setTimeout(() => navigate("/clothing"), 500);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save clothing item.");
    }
  }

  return (
    <div>
      <h1>{isEdit ? "Edit Clothing Item" : "Add Clothing Item"}</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>
            Name:
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <label>
            Category:
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </label>
          {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
        </div>

        <div>
          <label>
            Color:
            <input name="color" value={form.color} onChange={handleChange} />
          </label>
          {errors.color && <p style={{ color: "red" }}>{errors.color}</p>}
        </div>

        <div>
          <label>
            Image URL:
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </label>
          {errors.imageUrl && (
            <p style={{ color: "red" }}>{errors.imageUrl}</p>
          )}
        </div>

        <div>
          <label>
            Upload image:
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <button type="submit">{isEdit ? "Update" : "Create"}</button>
        <button type="button" onClick={handleCancel} style={{ marginLeft: "0.5rem" }}>Cancel</button>
      </form>
    </div>
  );
}

export default ClothingForm;
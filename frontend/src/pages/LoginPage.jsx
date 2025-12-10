import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function validate() {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    try {
      await login(form);
      // Save email so we can use it on OTP page
      localStorage.setItem("pendingEmail", form.email);
      setMessage("OTP sent to your email.");
      navigate("/verify-otp");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.errorMessage || "Login failed. Please try again."
      );
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div>
      <h1>Login</h1>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email:
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <label>
            Password:
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </label>
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
}

export default LoginPage;
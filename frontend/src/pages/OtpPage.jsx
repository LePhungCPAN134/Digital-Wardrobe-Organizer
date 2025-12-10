import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyLogin } from "../api/authApi";

function OtpPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingEmail") || "";

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Missing email. Please login again.");
      return navigate("/login");
    }
    if (!otp || otp.length !== 6) {
      setMessage("OTP must be 6 digits.");
      return;
    }

    try {
      const res = await verifyLogin({ email, otp });
      const { token, user } = res.data;

      // Store token + user
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.removeItem("pendingEmail");

      setMessage("Login successful!");
      navigate("/clothing"); // go to main page
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.errorMessage ||
          "OTP verification failed. Please try again."
      );
    }
  }

  return (
    <div>
      <h1>Verify OTP</h1>
      <p>OTP sent to: {email}</p>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          OTP:
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
        </label>
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default OtpPage;
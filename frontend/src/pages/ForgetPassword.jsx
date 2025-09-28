import { useState } from "react";
import { Link } from "react-router-dom";
import BgAuth from "../assets/Bg-Auth.png";
import ApplicationLogo from "../components/ApplicationLogo";
import InputForm from "../components/InputForm";
import { apiFetch } from "../lib/api";

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) throw new Error(res.message || "Gagal reset password");

      setSuccess("Kode reset password telah dikirim ke nomor handphone Anda.");
      setPhone("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BgAuth})` }}
    >
      {/* Left Content */}
      <div className="flex-1 flex-col flex justify-center pl-64 text-white bg-black/15">
        <ApplicationLogo className="-ml-2" width={250} />
        <h1 className="text-4xl font-semibold mt-16">Start Your Adventure</h1>
        <p className="text-sm mt-4">
          Log in and prepare your screen for your journey.
        </p>
      </div>

      {/* Right Card */}
      <div className="flex-1 flex justify-center items-center bg-black/15 pr-42">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-12">
          <h1 className="text-xl font-bold mb-4">Forgot Password</h1>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-2 bg-green-100 text-green-600 rounded-md">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputForm
              label="No. Handphone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Reset Password"}
            </button>
          </form>

          <p className="text-center mt-4">
            <Link to="/login" className="text-primary hover:underline">
              Back to Login Page
            </Link>
          </p>

          <div className="flex items-center justify-center mt-8 gap-2">
            <ApplicationLogo width={88} type="black" />
            <p className="text-gray-600 mt-1.5">Alright Reserve</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

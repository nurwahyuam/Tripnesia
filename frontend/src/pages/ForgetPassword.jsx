import { useState } from "react";
import { Link } from "react-router-dom";
import BgAuth from "../assets/Bg-Auth.png";
import ApplicationLogo from "../components/ApplicationLogo";
import InputForm from "../components/InputForm";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // step 1 = kirim OTP, step 2 = reset password, step 3 = selesai
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (step === 1) {
        // Kirim OTP ke email
        await axios.post("http://localhost:4000/api/auth/forgot-password", { email });
        setStep(2);
        setSuccess("OTP sudah dikirim ke email Anda");
      } else if (step === 2) {
        // Reset password
        await axios.post("http://localhost:4000/api/auth/reset-password", {
          email,
          code: otp,
          password,
        });
        setStep(3);
        setSuccess("Password berhasil diubah");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${BgAuth})` }}>
      {/* Left Content */}
      <div className="flex-1 flex-col flex justify-center pl-64 text-white bg-black/15">
        <ApplicationLogo className="-ml-2" width={250} />
        <h1 className="text-4xl font-semibold mt-16">Start Your Adventure</h1>
        <p className="text-sm mt-4">Log in and prepare your screen for your journey.</p>
      </div>

      {/* Right Card */}
      <div className="flex-1 flex justify-center items-center bg-black/15 pr-42">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-12">
          <h1 className="text-xl font-bold mb-4">Forgot Password</h1>

          {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md">{error}</div>}
          {success && <div className="mb-4 p-2 bg-green-100 text-green-600 rounded-md">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <InputForm
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}

            {step === 2 && (
              <>
                <InputForm label="OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                <InputForm
                  label="Password Baru"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            )}

            {step === 3 && (
              <div className="text-center text-green-600 font-semibold">
                Password berhasil diubah.{" "}
                <Link to="/login" className="text-primary underline">
                  Login sekarang
                </Link>
              </div>
            )}

            {step !== 3 && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary transition disabled:opacity-50"
              >
                {loading ? "Loading..." : step === 1 ? "Kirim OTP" : "Reset Password"}
              </button>
            )}
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
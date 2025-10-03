import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BgAuth from "../assets/Bg-Auth.png";
import ApplicationLogo from "../components/ApplicationLogo";
import InputForm from "../components/InputForm";
import { useForgotPassword } from "../hooks/useForgotPassword";
import Button from "../components/Button";

const ForgotPassword = () => {
  const { success, error, setError, handleForgotPassword, handleOtpCheck, handleResetPassword } = useForgotPassword();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill("")); // simpan 6 digit OTP
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // 🔥 countdown untuk OTP
  const [timeLeft, setTimeLeft] = useState(0); // dalam detik

  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  useEffect(() => {
    const savedStep = localStorage.getItem("step");
    const savedExpiresAt = localStorage.getItem("otpExpiresAt");

    if (savedStep) {
      setStep(Number(savedStep));

      if (Number(savedStep) === 2 && savedExpiresAt) {
        const remaining = Math.floor((Number(savedExpiresAt) - Date.now()) / 1000);
        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    }
  }, []);

  // handle perubahan setiap digit OTP
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // hanya angka
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (step === 1) {
        const ok = await handleForgotPassword(email);
        if (ok) {
          const expiresAt = Date.now() + 60 * 1000;
          localStorage.setItem("step", 2);
          localStorage.setItem("otpExpiresAt", expiresAt);

          setStep(2);
          setTimeLeft(60);
        }
      } else if (step === 2) {
        const code = otp.join("");
        const ok = await handleOtpCheck(email, code);
        if (code.length !== 6) {
          setError("Masukkan kode OTP lengkap (6 digit)");
          return;
        }
        if (ok) {
          const expiresAt = Date.now() + 60 * 1000;
          localStorage.setItem("step", 3);
          localStorage.removeItem("otpExpiresAt", expiresAt);
          setStep(3);
        }
      } else if (step === 3) {
        const code = otp.join("");
        const ok = await handleResetPassword(email, code, password);
        if (ok) {
          setStep(4);
          localStorage.removeItem("step");
          localStorage.removeItem("otpExpiresAt");
          navigate("/login");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      localStorage.removeItem("step");
      localStorage.removeItem("otpExpiresAt");
      window.location.reload();
      return;
    }
    setResendLoading(true);
    try {
      await handleForgotPassword(email); // panggil API forgot password
      setOtp(Array(6).fill("")); // reset OTP input

      const expiresAt = Date.now() + 60 * 1000;
      localStorage.setItem("step", 2);
      localStorage.setItem("otpExpiresAt", expiresAt);

      setStep(2);
      setTimeLeft(60);
    } finally {
      setResendLoading(false);
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
            {step === 1 && <InputForm label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />}

            {step === 2 && (
              <>
                <p className="text-sm text-gray-600 mb-2">Masukkan kode OTP (6 digit)</p>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, idx) => (
                    <input key={idx} type="text" value={digit} maxLength="1" onChange={(e) => handleOtpChange(e.target.value, idx)} className="w-10 h-12 text-center border rounded-lg text-lg" />
                  ))}
                </div>

                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    OTP akan kadaluarsa dalam <span className="font-bold text-red-500">{timeLeft}s</span>
                  </p>
                ) : (
                  <p className="text-sm text-red-600 font-semibold text-center">
                    OTP sudah kadaluarsa,{" "}
                    <button onClick={handleResend} type="button" disabled={resendLoading} className="text-red-600 hover:underline disabled:opacity-50">
                      {resendLoading ? "Mengirim ulang..." : "kirim ulang"}
                    </button>
                  </p>
                )}
              </>
            )}

            {step === 3 && <InputForm label="Password Baru" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />}

            {step === 4 && (
              <div className="text-center text-green-600 font-semibold">
                Password berhasil diubah.{" "}
                <Link to="/login" className="text-primary underline">
                  Login sekarang
                </Link>
              </div>
            )}

            {step !== 4 && (
              <Button
                type="submit"
                disabled={loading}
                className={"cursor-pointer"}
              >
                {loading ? "Loading..." : step === 1 ? "Kirim OTP" : step === 2 ? "Verifikasi OTP" : "Reset Password"}
              </Button>
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

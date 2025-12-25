import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BgAuth from "../assets/Bg-Auth.webp";
import ApplicationLogo from "../components/ApplicationLogo";
import InputForm from "../components/InputForm";
import { useForgotPassword } from "../hooks/useForgotPassword";
import Button from "../components/Button";

const ForgotPassword = () => {
  const { success, error, setError, handleForgotPassword, handleOtpCheck, handleResetPassword } = useForgotPassword();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

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

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
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
        if (code.length !== 6) {
          setError("Masukkan kode OTP lengkap (6 digit)");
          return;
        }
        const ok = await handleOtpCheck(email, code);
        if (ok) {
          localStorage.setItem("step", 3);
          localStorage.removeItem("otpExpiresAt");
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
      await handleForgotPassword(email);
      setOtp(Array(6).fill(""));
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
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${BgAuth})` }}>
      {/* Flex container: kolom di mobile, baris di desktop */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Content - Hero */}
        <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:pl-24 xl:pl-32 text-white bg-black/15">
          <div className="max-w-lg">
            <Link to={"/"}>
              <ApplicationLogo className="-ml-1 md:-ml-2" width={200} />
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold mt-8 md:mt-16">Start Your Adventure</h1>
            <p className="text-sm md:text-base mt-4">Log in and prepare your screen for your journey.</p>
          </div>
        </div>

        {/* Right Card - Form */}
        <div className="flex-1 flex justify-center items-center p-6 md:p-12 bg-black/15">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-6 py-8 md:px-8 md:py-8">
            <h1 className="text-xl font-bold mb-4">Forgot Password</h1>

            {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}
            {success && <div className="mb-4 p-2 bg-green-100 text-green-600 rounded-md text-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Email */}
              {step === 1 && <InputForm label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />}

              {/* Step 2: OTP */}
              {step === 2 && (
                <>
                  <p className="text-sm text-gray-600 mb-2">Masukkan kode OTP (6 digit)</p>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, idx) => (
                      <input key={idx} type="text" value={digit} maxLength="1" onChange={(e) => handleOtpChange(e.target.value, idx)} className="w-10 h-12 text-center border rounded-lg text-lg" inputMode="numeric" />
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

              {/* Step 3: New Password */}
              {step === 3 && <InputForm label="Password Baru" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="text-center text-green-600 font-semibold text-sm">
                  Password berhasil diubah.{" "}
                  <Link to="/login" className="text-primary underline">
                    Login sekarang
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              {step !== 4 && (
                <Button type="submit" disabled={loading} className="w-full py-2.5 text-sm" color="bg-primary text-white">
                  {loading ? "Loading..." : step === 1 ? "Kirim OTP" : step === 2 ? "Verifikasi OTP" : "Reset Password"}
                </Button>
              )}
            </form>

            <p className="text-center text-sm mt-4">
              <Link to="/login" className="text-primary hover:underline">
                Back to Login Page
              </Link>
            </p>

            {/* Footer Logo */}
            <div className="flex flex-col sm:flex-row items-center justify-center mt-8 gap-3 sm:gap-2">
              <ApplicationLogo width={72} type="black" />
              <p className="text-gray-600 text-sm">Alright Reserve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

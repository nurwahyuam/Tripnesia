import { useState } from "react";
import { Link } from "react-router-dom";
import BgAuth from "../assets/Bg-Auth.webp";
import ApplicationLogo from "../components/ApplicationLogo";
import InputForm from "../components/InputForm";
import { useSignup } from "../hooks/useSignup";
import Button from "../components/Button";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleSignup, error, setError, success } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    try {
      await handleSignup(name, email, password, phone, subscribe);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            <p className="text-sm md:text-base mt-4">Sign up and prepare your screen for your journey.</p>
          </div>
        </div>

        {/* Right Card - Form */}
        <div className="flex-1 flex justify-center items-center p-6 md:p-12 bg-black/15">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-6 py-8 md:px-8 md:py-8">
            <h1 className="text-xl font-bold mb-4">Register</h1>

            {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md">{error}</div>}
            {success && <div className="mb-4 p-2 bg-green-100 text-green-600 rounded-md">{success}</div>}

            <form onSubmit={handleSubmit}>
              {/* Nama & No HP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <InputForm label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <InputForm label="No. Handphone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <InputForm label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <InputForm label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                  <InputForm label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>

              {/* Subscribe */}
              <div className="flex items-start sm:items-center my-3">
                <input type="checkbox" checked={subscribe} onChange={() => setSubscribe(!subscribe)} id="subs" className="mt-0.5 mr-2 h-4 w-4 rounded" />
                <label htmlFor="subs" className="text-sm text-gray-600">
                  Subscribe to News (optional)
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full py-2.5" color="bg-primary text-white">
                {loading ? "Loading..." : "Register"}
              </Button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login Account
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

export default Signup;
  
import { useState } from "react";
import { Link } from "react-router-dom";
import BgAuth from "../assets/Bg-Auth.png";
import ApplicationLogo from "../components/ApplicationLogo";
import InputForm from "../components/InputForm";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { handleSignup } = useSignup();
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    try {
      handleSignup(name, email, password, phone, subscribe);
    } catch (err) {
      setError(err.message);
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
        <p className="text-sm mt-4">Sign up and prepare your screen for your journey.</p>
      </div>

      {/* Right Card */}
      <div className="flex-1 flex justify-center items-center bg-black/15 pr-42">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl px-11 py-8">
          <h1 className="text-xl font-bold mb-4">Register</h1>

          {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit} className="">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <InputForm label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <InputForm label="No. Handphone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <div className="mb-4">
              <InputForm label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputForm label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div>
                <InputForm label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>

            <div className="flex items-center my-3">
              <input type="checkbox" checked={subscribe} onChange={() => setSubscribe(!subscribe)} className="mr-2" id="subs" />
              <label className="text-sm text-gray-600" htmlFor="subs">
                Subscribe to News (optional)
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary transition disabled:opacity-50">
              {loading ? "Loading..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login Account
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

export default Signup;

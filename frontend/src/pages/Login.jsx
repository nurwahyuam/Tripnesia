import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";
import BgAuth from "../assets/Bg-Auth.png";
import ApplicationLogo from "../components/ApplicationLogo";
import InputForm from "../components/InputForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { handleLogin, error } = useLogin();
  // const { user } = useAuthContext();
  // useEffect(() => {
  //   if (user) {
  //     navigate("/user/dashboard");
  //   }
  // }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      handleLogin(email, password);
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
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-12 py-8">
          <h1 className="text-xl font-bold mb-4">Login</h1>

          {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit} className="">
            <div className="mb-4">
              <InputForm
                label={"Email"}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>

            <div>
              <InputForm
                label={"Password"}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>

            <div className="my-2">
              <p>
                Forgot your password?{" "}
                <Link to="/forget-password" className="text-primary hover:underline">
                  Reset it now.
                </Link>
              </p>
            </div>

            <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-primary text-white rounded-lg disabled:opacity-50 transition">
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-2">
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up now.
            </Link>
          </p>

          <div className="flex items-center justify-center mt-10 gap-2">
            <ApplicationLogo width={88} type="black" />
            <p className="text-gray-600 mt-1.5">Alright Reserve</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";
import BgAuth from "../assets/Bg-Auth.webp";
import ApplicationLogo from "../components/ApplicationLogo";
import InputForm from "../components/InputForm";
import Button from "../components/Button";

const Login = () => {
  const { handleLogin, error, success } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleLogin(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${BgAuth})` }}>
      {/* Konten Flex - Kolom di mobile, baris di desktop */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Content - Hero */}
        <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:pl-24 xl:pl-32 text-white bg-black/15">
          <div className="max-w-lg">
            <Link to={"/"}>
              <ApplicationLogo className="-ml-1 md:-ml-2" width={200} mdWidth={250} />
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold mt-8 md:mt-16">Start Your Adventure</h1>
            <p className="text-sm md:text-base mt-4">Log in and prepare your screen for your journey.</p>
          </div>
        </div>

        {/* Right Card - Form */}
        <div className="flex-1 flex justify-center items-center p-6 md:p-12 bg-black/15">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-6 py-8 md:px-12 md:py-8">
            <h1 className="text-xl font-bold mb-4">Login</h1>

            {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md">{error}</div>}
            {success && <div className="mb-4 p-2 bg-green-100 text-green-600 rounded-md">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <InputForm
                  label={"Email"}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <InputForm
                  label={"Password"}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="my-2 text-sm">
                <p>
                  Forgot your password?{" "}
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Reset it now.
                  </Link>
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5"
                color="bg-primary text-white"
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>

            <p className="text-center text-sm mt-4">
              Don't have an account yet?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up now.
              </Link>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center mt-8 gap-3 sm:gap-2">
              <ApplicationLogo width={72} smWidth={88} type="black" />
              <p className="text-gray-600 text-sm">Alright Reserve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
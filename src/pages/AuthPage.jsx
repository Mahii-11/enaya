import { useState } from "react";
import { Eye, EyeOff, User, Lock, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "../services/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await loginApi(email, password);
      if (res?.status) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        navigate("/dashboard");
      } else {
        setError(res?.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("All fields required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await registerApi({
        name,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
      });

       if (res?.status) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } else {
      setError(res?.message || "Registration failed");
    }
  } catch (err) {
    setError("Something went wrong");
  } finally {
    setLoading(false);


  }

  }













  return (
    <div className="min-h-screen flex  justify-center pt-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md min-h-[520px] ">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin
              ? "Login to continue shopping"
              : "Register to start your journey"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm rounded-full font-medium transition ${
              isLogin
                ? "bg-gray-700 text-white shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm rounded-full font-medium transition ${
              !isLogin
                ? "bg-gray-700 text-white shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>

          {!isLogin && (
            <InputField icon={<User size={18} />} placeholder="Full Name" value={name}   onChange={(e) => setName(e.target.value)} />
          )}

          {!isLogin && (
            <InputField icon={<Phone size={18} />} placeholder="Phone Number" value={phone}
              onChange={(e) => setPhone(e.target.value)} />
          )}

          <InputField icon={<Mail size={18} />} placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />

          {/* Password */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isLogin && (
            <InputField
              icon={<Lock size={18} />}
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          {isLogin && (
            <div className="text-right">
              <button className="text-blue-600 text-sm hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
            </div>
              )}

          {/* Button */}
           <button
             type="submit"
             disabled={loading}
             className={`w-full py-3 rounded-xl font-semibold transition shadow-md text-white ${
             loading
             ? "bg-gray-400 cursor-not-allowed"
             : "bg-gray-700 hover:bg-gray-800"
         }`}
         >
            {loading
            ? "Loading..."
            : isLogin
            ? "Log In"
            : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-medium hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function InputField({ icon, placeholder, type = "text",  value, onChange  }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-gray-400">{icon}</div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetMyProfileQuery, useLoginMutation } from "../../../redux/features/auth/authApi";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const {data:userData} = useGetMyProfileQuery()
  console.log(userData?.data?._id)

  // submit e form data collect
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Sign in data:", data);
    setIsLoading(true);
    const result = await login(data);

    if (result?.data) {
      console.log("Login success:", result.data);
      const token = result.data?.token || result.data?.data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userData?.data?._id);
      }

      setIsLoading(false);
      navigate("/");
    } else {
      console.error("Login error:", result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-10 text-center">
        <div className="flex flex-col text-3xl font-semibold items-center mb-6">
          Welcome Back
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="mostain@gmail.com"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-black pr-10"
              />
              <span
                className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </span>
            </div>
          </div>

          {/* Remember + Forgot Password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-black"
              />
              <span className="text-gray-600">Remember password</span>
            </label>
            <a
              href="/auth/forgot-password"
              className="text-gray-600 hover:text-black hover:underline transition-all"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-md font-semibold transition-all ${
              isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-gray-900"
            }`}
          >
            {isLoading ? (
              <>
                <LoadingOutlined spin />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

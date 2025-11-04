import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is Required");
      return;
    }
    console.log("Email Sent:", email);
    navigate(`/auth/otp/${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-10 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email address to get a verification code for resetting your
          password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="mostain@gmail.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-black"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition-all"
          >
            Send Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

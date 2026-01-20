"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post("/api/user/login", {
      email,
      password,
    });

    // 🔥 STORE TOKEN
    localStorage.setItem("token", res.data.token);

    // redirect
    router.push("/home");
  } catch (err: any) {
    setError(err.response?.data?.message || "Login failed");
  }
};

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     const res = await axios.post(
  //       "/api/user/login",
  //       { email, password },
  //       { withCredentials: true } // 🔴 IMPORTANT
  //     );

  //     if (res.data?.success) {
  //       router.push("/home"); // ✅ LOGIN SUCCESS
  //     } else {
  //       setError(res.data?.message || "Invalid credentials");
  //     }
  //   } catch (err: any) {
  //     setError(err.response?.data?.message || "Login failed");
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Glass Card */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Welcome Back
        </h1>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
            required
          />

          {/* 🔥 DARK BUTTON (distinct from inputs) */}
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white py-3 font-medium transition border border-white/10"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-white hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}


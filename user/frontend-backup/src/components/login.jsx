
import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleUserLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("/login", { email, password }, { withCredentials: true });

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                navigate("/home");
            } else {
                setError(response.data.message || "Login failed.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 w-80">
                <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                <form onSubmit={handleUserLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border p-2 rounded-md"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border p-2 rounded-md"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                        Login
                    </button>
                </form>
                <button onClick={() => navigate("/signup")} className="w-full text-blue-500 mt-4 text-center">
                    Go to Signup
                </button>
            </div>
        </div>
    );
};

export default Login;



import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleUserSignup = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post("/signup", { name, email, password });

            if (response.data.success) {
                setMessage("Signup successful! Redirecting...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage(response.data.message || "Signup failed.");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 w-80">
                <h2 className="text-2xl font-semibold text-center mb-4">Signup</h2>
                {message && <p className="text-red-500 text-sm text-center mb-2">{message}</p>}
                <form onSubmit={handleUserSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border p-2 rounded-md"
                            autoComplete="off"
                            required
                        />
                    </div>
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
                    <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600">
                        Signup
                    </button>
                </form>
                <button onClick={() => navigate("/login")} className="w-full text-blue-500 mt-4 text-center">
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default Signup;

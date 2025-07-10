import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FaCamera, FaUpload } from "react-icons/fa";
import img from "../assets/profile.webp";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const defaultImage = img;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err.message);
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto border-gray-500 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-black">Signup</h2>

      <div className="flex flex-col items-center p-4 space-y-2">
        <div className="flex flex-col items-center p-4 space-y-2">
          <div className="relative group">
            {/* Profile Image Preview or Default */}
            <img
              src={preview || defaultImage}
              alt="profile preview"
              className="w-24 h-24 object-cover rounded-full border border-gray-400 shadow-md"
            />

            {/* Upload Icon Overlapping */}
            <label htmlFor="fileInput">
              <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer border border-white shadow-md">
                <FaUpload className="text-white text-xs" />
              </div>
            </label>

            {/* Hidden File Input */}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500">
            Upload profile picture (optional)
          </p>
        </div>

        
      </div>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full p-2 border text-black border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border text-black border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="w-full p-2 border text-black border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
        Signup
      </button>
    </form>
  );
};

export default Signup;

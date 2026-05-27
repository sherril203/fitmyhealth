"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    // validation
    if (
      !form.username ||
      !form.email ||
      !form.password
    ) {

      toast.error("All fields are required");

      return;

    }

    try {

      setLoading(true);

      const res = await fetch(
        `${API}/${isAdmin ? "adminRegister" : "userRegister"}`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),

        }
      );

      const result = await res.json();

      if (!res.ok) {

        toast.error(result.message);

        return;

      }

      toast.success(
        `${isAdmin ? "Admin" : "User"} signup successful!`
      );

      // redirect after success
      setTimeout(() => {

        router.push("/login");

      }, 1500);

    } catch (err) {

      console.error(err);

      toast.error("Signup failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      {/* Toastify */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-[400px] space-y-4"
      >

        <h2 className="text-xl font-bold text-center">
          Sign Up
        </h2>

        <div className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />

          <label>Register as Admin</label>

        </div>

        <div>

          <label>Username</label>

          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          />

        </div>

        <div>

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          />

        </div>

        <div>

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="border w-full p-2 rounded mt-1"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >

          {loading ? "Signing up..." : "Sign Up"}

        </button>

        <p>

          Already Registered?{" "}

          <Link
            href="/login"
            className="text-blue-500 hover:underline"
          >
            Login
          </Link>

        </p>

      </form>

    </div>

  );

};

export default SignUp;
"use client";

import React, { useState } from "react";
import Link from "next/link";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.email || !form.password) {

      toast.error("All fields are required");

      return;

    }

    try {

      setLoading(true);

      const endpoint = isAdmin
        ? "/adminlogin"
        : "/userlogin";

      const res = await fetch(`${API}${endpoint}`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),

      });

      const result = await res.json();

      if (!res.ok) {

        toast.error(result.message);

        return;

      }

      // token
      const token = result?.data?.token;

      // user/admin data
      const userData = isAdmin
        ? result?.data?.admin
        : result?.data?.user;

      // save token
      localStorage.setItem("token", token);

      // save role
      localStorage.setItem("role", userData.role);

      // save data
      if (isAdmin) {

        localStorage.setItem(
          "admin",
          JSON.stringify(userData)
        );

      } else {

        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );

      }

      toast.success(
        `${isAdmin ? "Admin" : "User"} login successful!`
      );

      // redirect
      setTimeout(() => {

        window.location.href = isAdmin
          ? "/admin"
          : "/dashboard";

      }, 1500);

    } catch (err) {

      console.log(err);

      toast.error("Login failed");

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
          Login
        </h2>

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

        <div className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />

          <label>Login as Admin</label>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >

          {loading ? "Logging in..." : "Login"}

        </button>

        <p>

          New Account?{" "}
          <Link
            href="/signup"
            className="text-blue-500 hover:underline"> Sign Up</Link>
        </p>
      </form>
    </div>
  );

};

export default Login;
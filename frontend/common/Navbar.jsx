"use client";
import { PiSignInBold } from "react-icons/pi";
import {
  CgProfile,
} from "react-icons/cg";
import { VscFeedback } from "react-icons/vsc";
import {
  IoDocumentTextOutline,
  IoLogOutOutline,
} from "react-icons/io5";

import { LuLayoutDashboard } from "react-icons/lu";
import { GrHomeRounded } from "react-icons/gr";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {

  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {

    const savedRole = localStorage.getItem("role");

    if (savedRole) {
      setRole(savedRole);
    } else {
      setRole("normal");
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");

    setRole("normal");

    window.location.href = "/login";

  };

  // prevent hydration issue
  if (role === null) {
    return null;
  }

  return (
    <div className="bg-green-500 text-white px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <div>
        <Link
          href="/"
          className="font-bold text-2xl"
        >
          FitMyHealth
        </Link>
      </div>

      {/* NORMAL NAVBAR */}
      {role === "normal" && (
        <>

          <nav>
            <ul className="flex gap-6 text-lg items-center">

              <li>
                <Link
                  href="/"
                  className="font-bold flex items-center gap-2 hover:text-green-100"
                >
                  <GrHomeRounded className="text-lg" />
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/records"
                  className="font-bold flex items-center gap-2 hover:text-green-100"
                >
                  <IoDocumentTextOutline className="text-2xl" />
                  Records
                </Link>
              </li>

              <li>
                <Link
                  href="/feedback"
                  className="font-bold flex items-center gap-2 hover:text-green-100"
                >
                <VscFeedback className="text-2xl"/>  FeedBack
                </Link>
              </li>

            </ul>
          </nav>

          <div className="flex gap-3">

            <Link href="/signup">
              <button className="border-2 px-4 py-2 rounded-xl hover:bg-white hover:text-green-600 duration-300 flex items-center gap-2">
               Sign Up
              </button>
            </Link>

            <Link href="/login">
              <button className="border-2 px-4 py-2 rounded-xl hover:bg-white hover:text-green-600 duration-300 flex items-center gap-2">
               <PiSignInBold className="text-2xl"/> Login
              </button>
            </Link>

          </div>

        </>
      )}

      {/* USER NAVBAR */}
      {role === "user" && (
        <>

          <nav>
            <ul className="flex gap-6 text-lg items-center">

              <li>
                <Link
                  href="/dashboard"
                  className="font-bold flex items-center gap-2 hover:text-green-100"
                >
                  <LuLayoutDashboard className="text-2xl" />
                  DashBoard
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/MyRecords"
                  className="font-bold flex items-center gap-2 hover:text-green-100"
                >
                  <IoDocumentTextOutline className="text-2xl" />
                  Records
                </Link>
              </li>

              <li>
                <Link
                  href="/feedback"
                  className="font-bold flex items-center gap-2 hover:text-green-100"
                >
                <VscFeedback className="text-2xl"/>   FeedBack
                </Link>
              </li>

            </ul>
          </nav>

          {/* Hamburger */}
          <div className="relative">

            <button
              onClick={() => setOpen(!open)}
              className="text-3xl"
            >
              ☰
            </button>

            {open && (

              <div className="absolute right-0 mt-3 bg-white text-black rounded-xl shadow-lg w-52 overflow-hidden z-50">

                <Link
                  href="/dashboard/profile"
                  className="px-5 py-3 hover:bg-gray-100 flex items-center gap-3 font-medium"
                >
                  <CgProfile className="text-2xl" />
                  Profile
                </Link>

                <Link
                  href="/dashboard/MyRecords"
                  className="px-5 py-3 hover:bg-gray-100 flex items-center gap-3 font-medium"
                >
                  <IoDocumentTextOutline className="text-2xl" />
                  My Records
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100 flex items-center gap-3 font-medium"
                >
                  <IoLogOutOutline className="text-2xl" />
                  Logout
                </button>

              </div>

            )}

          </div>

        </>
      )}

      {/* ADMIN NAVBAR */}
      {role === "admin" && (
        <>

          <nav>
            <ul className="flex gap-6 text-lg items-center">

              <li>
                <Link
                  href="/admin"
                  className="font-bold flex items-center gap-2 hover:text-green-100"
                >
                  <LuLayoutDashboard className="text-2xl" />
                  DashBoard
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/records"
                  className="font-bold flex items-center gap-2 hover:text-green-100"
                >
                  <IoDocumentTextOutline className="text-2xl" />
                  Records
                </Link>
              </li>

            </ul>
          </nav>

          {/* Hamburger */}
          <div className="relative">

            <button
              onClick={() => setOpen(!open)}
              className="text-3xl"
            >
              ☰
            </button>

            {open && (

              <div className="absolute right-0 mt-3 bg-white text-black rounded-xl shadow-lg w-52 overflow-hidden z-50">

                <Link
                  href="/admin/profile"
                  className="px-5 py-3 hover:bg-gray-100 flex items-center gap-3 font-medium"
                >
                  <CgProfile className="text-2xl" />
                  Profile
                </Link>

                <Link
                  href="/admin/records"
                  className="px-5 py-3 hover:bg-gray-100 flex items-center gap-3 font-medium"
                >
                  <IoDocumentTextOutline className="text-2xl" />
                  Records
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 hover:bg-gray-100 flex items-center gap-3 font-medium"
                >
                  <IoLogOutOutline className="text-2xl" />
                  Logout
                </button>

              </div>

            )}

          </div>

        </>
      )}

    </div>
  );
};

export default Navbar;
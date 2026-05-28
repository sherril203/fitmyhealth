"use client";

import { TiDocumentAdd } from "react-icons/ti";
import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import { AiOutlineDownload } from "react-icons/ai";
import { FaRegTrashCan } from "react-icons/fa6";

const Profile = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openDropdown, setOpenDropdown] =
    useState(null);

  const dropdownRef = useRef(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API}/getrecord`
        );

        const result = await response.json();

        if (response.ok) {
          setData(result.data || []);
        }

        const token =
          localStorage.getItem("token");

        const userResponse = await fetch(
          `${API}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userResult =
          await userResponse.json();

        if (userResponse.ok) {
          setUser(userResult.user);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API]);

  // CLOSE DROPDOWN
  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const deleteRecord = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this record?"
      )
    )
      return;

    try {
      const response = await fetch(
        `${API}/deleterecord/${id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (response.ok) {
        setData((prev) =>
          prev.filter(
            (record) =>
              record._id !== id
          )
        );

        alert(
          "Record deleted successfully"
        );
      } else {
        alert(
          result.message ||
            "Failed to delete"
        );
      }
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert("Error connecting to server");
    }
  };

  // DOWNLOAD
  const handleDownload = async (
    record,
    type
  ) => {
    try {
      const response = await fetch(
        `${API}/getdata/${record._id}`
      );

      const result = await response.json();

      const tableData =
        result.data || [];

      if (!tableData.length) {
        alert("No data available");
        return;
      }

      const headers =
        record.column_name;

      if (type === "csv") {
        const csvContent = [
          headers.join(","),

          ...tableData.map((row) =>
            row.row_data
              .map(
                (item) => `"${item}"`
              )
              .join(",")
          ),
        ].join("\n");

        const blob = new Blob(
          [csvContent],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.setAttribute(
          "download",
          `${record.title}.csv`
        );

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      }

      if (type === "excel") {
        const excelContent = [
          headers.join("\t"),

          ...tableData.map((row) =>
            row.row_data.join("\t")
          ),
        ].join("\n");

        const blob = new Blob(
          [excelContent],
          {
            type:
              "application/vnd.ms-excel",
          }
        );

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.setAttribute(
          "download",
          `${record.title}.xls`
        );

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      }

      setOpenDropdown(null);
    } catch (error) {
      console.log(error);

      alert("Download failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* PROFILE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-2xl font-bold">
            Profile
          </p>

          <p className="mt-4 text-gray-600 font-medium">
            {user?.username ||
              "Loading..."}
          </p>

          <button
            onClick={handleLogout}
            className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            Logout
          </button>
        </div>

        {/* DASHBOARD */}
        <div className="lg:col-span-3">
          <div className="p-5 bg-white rounded-2xl shadow">

            <p className="font-bold text-2xl">
              Records
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

              <div className="bg-blue-100 p-5 rounded-xl">
                <p>Total Records</p>

                <h1 className="text-3xl font-bold">
                  {data.length}
                </h1>
              </div>

              <div className="bg-yellow-100 p-5 rounded-xl">
                <p>Status</p>

                <h1 className="text-2xl font-bold">
                  Active
                </h1>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* RECORDS */}
      <div className="mt-6">
        <div className="p-5 bg-white rounded-2xl shadow">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

            <p className="font-bold text-2xl">
              My Records
            </p>

            <div className="flex gap-3 flex-wrap">

              <Link href="/records">
                <button className="px-5 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-semibold">
                  More Records
                </button>
              </Link>

              <Link href="/records/recordform">
                <button className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2">
                  <TiDocumentAdd className="text-2xl" />
                  Create Record
                </button>
              </Link>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">

            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-400">
                Loading records...
              </div>
            ) : data.length > 0 ? (
              data.map((record) => (
                <div
                  key={record._id}
                  className="bg-gray-50 p-5 rounded-xl border shadow-sm hover:shadow-md hover:-translate-y-1 duration-300 transition"
                >
                  <Link
                    href={`/records/${record._id}`}
                    className="text-xl font-bold text-gray-800 hover:text-blue-600"
                  >
                    {record.title}
                  </Link>

                  <p className="text-sm text-gray-500 mt-2">
                    Columns:{" "}
                    {record.no_of_columns}
                  </p>

                  <div className="flex gap-3 mt-5 flex-wrap">

                    {/* DOWNLOAD */}
                    <div
                      className="relative"
                      ref={dropdownRef}
                    >
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown ===
                              record._id
                              ? null
                              : record._id
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <AiOutlineDownload className="text-2xl" />
                        Download
                      </button>

                      {openDropdown ===
                        record._id && (
                        <div className="absolute left-0 mt-2 w-44 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                          <button
                            onClick={() =>
                              handleDownload(
                                record,
                                "csv"
                              )
                            }
                            className="w-full text-left px-4 py-3 hover:bg-gray-100"
                          >
                            Download CSV
                          </button>

                          <button
                            onClick={() =>
                              handleDownload(
                                record,
                                "excel"
                              )
                            }
                            className="w-full text-left px-4 py-3 hover:bg-gray-100"
                          >
                            Download Excel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        deleteRecord(
                          record._id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <FaRegTrashCan className="text-xl" />
                      Delete
                    </button>

                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full border-2 border-dashed rounded-2xl p-12 text-center bg-gray-50">
                <p className="text-gray-400 text-lg">
                  No records found.
                  Start by creating one!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
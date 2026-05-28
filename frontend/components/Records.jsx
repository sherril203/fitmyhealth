"use client";

import { TiDocumentAdd } from "react-icons/ti";
import { AiOutlineDownload } from "react-icons/ai";
import { FaRegTrashCan } from "react-icons/fa6";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const Records = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownRef = useRef(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API}/getrecord`);
        const result = await response.json();

        if (response.ok) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

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

      if (response.ok) {
        setData(
          data.filter((record) => record._id !== id)
        );

        alert("Record deleted successfully");
      } else {
        const result = await response.json();

        alert("Failed to delete: " + result.message);
      }
    } catch (error) {
      console.error("Delete error:", error);

      alert("Error connecting to server");
    }
  };

  // DOWNLOAD FUNCTION
  const handleDownload = async (record, type) => {
    try {
      const response = await fetch(
        `${API}/getdata/${record._id}`
      );

      const result = await response.json();

      const tableData = result.data || [];

      if (!tableData.length) {
        alert("No data available");
        return;
      }

      const headers = record.column_name;

      if (type === "csv") {
        const csvContent = [
          headers.join(","),

          ...tableData.map((row) =>
            row.row_data
              .map((item) => `"${item}"`)
              .join(",")
          ),
        ].join("\n");

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

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

        const blob = new Blob([excelContent], {
          type: "application/vnd.ms-excel",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

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

  return (
    <div className="p-5">
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded">
        <p className="font-bold text-2xl">
          Records
        </p>

        <Link href="/records/recordform">
          <button className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2">
            <TiDocumentAdd className="text-2xl" />
            Create Record
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-gray-400">
            Loading records...
          </div>
        ) : data.length > 0 ? (
          data.map((record) => (
            <div
              key={record._id}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center gap-4 flex-wrap">

  {/* LEFT SIDE */}
  <div className="flex-1 min-w-[200px]">
    <Link
      href={`/records/${record._id}`}
      className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
    >
      {record.title}
    </Link>

    <p className="text-sm text-gray-500 mt-1">
      Columns: {record.no_of_columns}
    </p>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex gap-3 flex-wrap items-center">

    {/* DOWNLOAD */}
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        onClick={() =>
          setOpenDropdown(
            openDropdown === record._id
              ? null
              : record._id
          )
        }
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-md font-semibold transition-all active:scale-95 shadow-sm flex items-center gap-2"
      >
        <AiOutlineDownload className="text-2xl" />
        Download
      </button>

      {openDropdown === record._id && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg overflow-hidden z-50">

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
        deleteRecord(record._id)
      }
      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-md font-semibold transition-all active:scale-95 shadow-sm flex items-center gap-2"
    >
      <FaRegTrashCan className="text-2xl" />
      Delete
    </button>

  </div>
</div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-lg">
              No records found. Start by creating a
              new one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Records;
"use client";

import { TiDocumentAdd } from "react-icons/ti";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import { AiOutlineDownload } from "react-icons/ai";

import { ToastContainer, toast } from "react-toastify";

import { FaRegTrashCan } from "react-icons/fa6";

import "react-toastify/dist/ReactToastify.css";

const Records = () => {
  const [data, setData] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [openDropdown, setOpenDropdown] =
    useState(null);

  const dropdownRef = useRef(null);

  const API =
    process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(
          `${API}/getrecord`
        );

        const result =
          await response.json();

        if (response.ok) {
          setData(result.data);
        } else {
          toast.error(
            "Failed to fetch records"
          );
        }
      } catch (error) {
        console.error(
          "Error fetching records:",
          error
        );

        toast.error("Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

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

      if (response.ok) {
        setData(
          data.filter(
            (record) =>
              record._id !== id
          )
        );

        toast.success(
          "Record deleted successfully"
        );
      } else {
        const result =
          await response.json();

        toast.error(
          "Failed to delete: " +
            result.message
        );
      }
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      toast.error(
        "Error connecting to server"
      );
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
        toast.error(
          "No data available"
        );

        return;
      }

      const headers =
        record.column_name;

      // CSV
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

        toast.success(
          "CSV downloaded successfully"
        );
      }

      // EXCEL
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

        toast.success(
          "Excel downloaded successfully"
        );
      }

      setOpenDropdown(null);
    } catch (error) {
      console.log(error);

      toast.error("Download failed");
    }
  };

  return (
    <div className="p-5">

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      {/* HEADER */}
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

      {/* RECORDS */}
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

              <div className="flex justify-between items-center">

                <div className="flex-1">

                  <Link
                    href={`/records/${record._id}`}
                    className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {record.title}
                  </Link>

                  <p className="text-sm text-gray-500 mt-1">
                    Columns:{" "}
                    {record.no_of_columns}
                  </p>

                </div>

                {/* DOWNLOAD */}
                <div
                  className="relative ml-4"
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-md font-semibold transition-all active:scale-95 shadow-sm flex items-center gap-2"
                  >

                    <AiOutlineDownload className="text-2xl" />

                    Download

                  </button>

                  {openDropdown ===
                    record._id && (
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
                    deleteRecord(
                      record._id
                    )
                  }
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-md font-semibold transition-all active:scale-95 shadow-sm flex items-center gap-2"
                >

                  <FaRegTrashCan className="text-2xl" />

                  Delete

                </button>

              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">

            <p className="text-gray-400 text-lg">
              No records found. Start by
              creating a new one!
            </p>

          </div>
        )}
      </div>
    </div>
  );
};

export default Records;
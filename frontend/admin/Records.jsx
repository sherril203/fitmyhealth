"use client";
import { TiDocumentAdd } from "react-icons/ti";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineDownload } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Records = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {

    const fetchRecords = async () => {

      try {

        const response = await fetch(`${API}/getrecord`);

        const result = await response.json();

        if (response.ok) {

          setData(result.data);

        } else {

          toast.error("Failed to fetch records");

        }

      } catch (error) {

        console.error("Error fetching records:", error);

        toast.error("Server Error");

      } finally {

        setLoading(false);

      }

    };

    fetchRecords();

  }, []);

  const deleteRecord = async (id) => {

    if (!window.confirm("Are you sure you want to delete this record?"))
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

        toast.success("Record deleted successfully");

      } else {

        const result = await response.json();

        toast.error(
          "Failed to delete: " + result.message
        );

      }

    } catch (error) {

      console.error("Delete error:", error);

      toast.error("Error connecting to server");

    }

  };

  return (
    <div className="p-5">


      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center bg-gray-100 p-4 rounded">

        <p className="font-bold text-2xl">
          Records
        </p>

        <Link href="/records/recordform">
          <button className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2">
            <TiDocumentAdd className="text-2xl"/>  Create Record
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

              <div className="flex justify-between items-center">

                <div className="flex-1">

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

                <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-md font-semibold transition-all active:scale-95 shadow-sm flex items-center gap-2">

                 <AiOutlineDownload className="text-2xl"/> Download

                </button>

                <button
                  onClick={() => deleteRecord(record._id)}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-md font-semibold transition-all active:scale-95 shadow-sm flex items-center gap-2"
                >

        Delete

                </button>

              </div>

            </div>

          ))

        ) : (

          <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">

            <p className="text-gray-400 text-lg">

              No records found. Start by creating a new one!

            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default Records;
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {

  const API = process.env.NEXT_PUBLIC_API_URL;

  const params = useParams();

  const [record, setRecord] = useState(null);

  const [tableData, setTableData] = useState([]);


  useEffect(() => {

    if (params?.id) {
      fetchRecord();
      fetchData();
    }

  }, [params.id]);


  // FETCH RECORD STRUCTURE
  const fetchRecord = async () => {

    try {

      const response = await fetch(
        `${API}/getrecord/${params.id}`
      );

      const data = await response.json();

      if (response.ok) {
        setRecord(data.data || data);
      }

    } catch (error) {

      console.log("Fetch Record Error:", error);

    }

  };


  // FETCH TABLE ROWS
  const fetchData = async () => {

    try {

      const response = await fetch(
        `${API}/getdata/${params.id}`
      );

      const data = await response.json();

      if (response.ok) {
        setTableData(data.data);
      }

    } catch (error) {

      console.log("Fetch Data Error:", error);

    }

  };


  if (!record) {
    return <p className="p-10">Loading...</p>;
  }


  return (
    <div className="p-10">

      <div className="border rounded-xl shadow-md overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">

          <h1 className="text-2xl font-bold">
            {record.title}
          </h1>

          <Link
            href={`/records/${params.id}/data`}
            className="bg-white text-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
          >
            + Add Data
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {record.column_name?.map((col, i) => (
                  <th
                    key={i}
                    className="border p-3 text-left">{col}</th>
                ))}

              </tr>
            </thead>
            <tbody>
              {tableData?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {item.row_data?.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border p-3"
                    >
                      {cell}
                    </td>

                  ))}
                </tr>
              ))}
              {!tableData?.length && (
                <tr>
                  {record.column_name?.map((_, i) => (
                    <td
                      key={i}
                      className="border p-3 text-gray-400">No Data</td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
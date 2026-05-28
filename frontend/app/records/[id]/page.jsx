"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TiDocumentAdd } from "react-icons/ti";
import { AiOutlineDownload } from "react-icons/ai";
const page = () => {
  const API =
    process.env.NEXT_PUBLIC_API_URL;

  const params = useParams();

  const [record, setRecord] =
    useState(null);

  const [tableData, setTableData] =
    useState([]);

  const [showDownload, setShowDownload] =
    useState(false);

  const downloadRef = useRef(null);

  useEffect(() => {
    if (params?.id) {
      fetchRecord();
      fetchData();
    }
  }, [params.id]);

  // CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        downloadRef.current &&
        !downloadRef.current.contains(
          event.target
        )
      ) {
        setShowDownload(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // FETCH RECORD
  const fetchRecord = async () => {
    try {
      const response = await fetch(
        `${API}/getrecord/${params.id}`
      );

      const data =
        await response.json();

      if (response.ok) {
        setRecord(data.data || data);
      }
    } catch (error) {
      console.log(
        "Fetch Record Error:",
        error
      );
    }
  };

  // FETCH TABLE DATA
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API}/getdata/${params.id}`
      );

      const data =
        await response.json();

      if (response.ok) {
        setTableData(data.data);
      }
    } catch (error) {
      console.log(
        "Fetch Data Error:",
        error
      );
    }
  };

  // DOWNLOAD FUNCTION
  const handleDownload = (type) => {
    if (!tableData?.length) {
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

    setShowDownload(false);
  };

  if (!record) {
    return (
      <p className="p-10">
        Loading...
      </p>
    );
  }

  return (
    <div className="p-10">
      <div className="border rounded-xl shadow-md overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-500 text-white p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          <h1 className="text-2xl font-bold">
            {record.title}
          </h1>

          <div className="flex gap-3 flex-wrap">

            {/* ADD DATA */}
            <Link
              href={`/records/${params.id}/data`}
              className="bg-white text-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2 transition"
            >
              <TiDocumentAdd className="text-2xl shrink-0" />

              <span>Add Data</span>
            </Link>

            {/* DOWNLOAD */}
            <div
              className="relative"
              ref={downloadRef}
            >
              <button
                onClick={() =>
                  setShowDownload(
                    !showDownload
                  )
                }
                className="bg-white text-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2 transition"
              >
                <AiOutlineDownload className="text-2xl shrink-0" />

                <span>Download</span>
              </button>

              {showDownload && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg overflow-hidden z-50">

                  <button
                    onClick={() =>
                      handleDownload(
                        "csv"
                      )
                    }
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 text-black"
                  >
                    Download CSV
                  </button>

                  <button
                    onClick={() =>
                      handleDownload(
                        "excel"
                      )
                    }
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 text-black"
                  >
                    Download Excel
                  </button>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">

            <thead className="bg-gray-100">
              <tr>
                {record.column_name?.map(
                  (col, i) => (
                    <th
                      key={i}
                      className="border p-3 text-left"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {tableData?.map(
                (item, rowIndex) => (
                  <tr key={rowIndex}>
                    {item.row_data?.map(
                      (
                        cell,
                        cellIndex
                      ) => (
                        <td
                          key={
                            cellIndex
                          }
                          className="border p-3"
                        >
                          {cell}
                        </td>
                      )
                    )}
                  </tr>
                )
              )}

              {!tableData?.length && (
                <tr>
                  {record.column_name?.map(
                    (_, i) => (
                      <td
                        key={i}
                        className="border p-3 text-gray-400"
                      >
                        No Data
                      </td>
                    )
                  )}
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default page;
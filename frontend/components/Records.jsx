"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);
 
 const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
        const response = await fetch(`${API}/deleterecord/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            setData(data.filter((record) => record._id !== id));
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

  return (
    <div className="p-5">
      <div className='flex justify-between items-center bg-gray-100 p-4 rounded'>
        <p className='font-bold text-2xl'>Records</p>
        <Link href="/records/recordform">
          <button className='p-3  border-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600'>
            Create Record
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-gray-400">Loading records...</div>
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
        >{record.title}</Link>
        <p className="text-sm text-gray-500 mt-1">
          Columns: {record.no_of_columns}</p>
      </div>
      <button 
        onClick={() => deleteRecord(record._id)}
        className="ml-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-md font-semibold transition-all active:scale-95 shadow-sm"
      >Delete</button>
    </div>
  </div>
        ))
        ) : (
          <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-lg">No records found. Start by creating a new one!</p>
          </div>
        )}
      </div>
    </div>
  );

};

export default Records;
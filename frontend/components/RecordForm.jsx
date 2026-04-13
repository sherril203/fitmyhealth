"use client";
import React, { useState } from "react";

const RecordForm = () => {

    const [title, setTitle] = useState("");
    const [columnNo, setColumnNo] = useState(0);
    const [columns, setColumns] = useState([]);

const API = process.env.NEXT_PUBLIC_API_URL;

    const handleColumnNumber = (e) => {
        const value = Number(e.target.value);
        setColumnNo(value);

        const newColumns = Array(value).fill("");
        setColumns(newColumns);
    };

    const handleColumnName = (index, value) => {
        const updated = [...columns];
        updated[index] = value;
        setColumns(updated);
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
        title: title,
        no_of_columns: columnNo, 
        column_name: columns     
    };

    try {
     
        const response = await fetch(`${API}/postrecord`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData), 
        });

        const result = await response.json();

        if (response.ok) {
            alert("Record created successfully!");
            setTitle("");
            setColumnNo(0);
            setColumns([]);
        } else {
            alert("Record creation failed: " + result.message);
        }
    } catch (error) {
        console.error("Connection Error:", error);
    }
};

    return (
        <div className="flex justify-center items-center p-10 bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-xl p-8 w-[400px] space-y-4"
            >

                <h2 className="text-xl font-bold text-center">Record Form</h2>

                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        className="border w-full p-2 rounded mt-1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label>No of Columns</label>
                    <input
                        type="number"
                        className="border w-full p-2 rounded mt-1"
                        value={columnNo}
                        onChange={handleColumnNumber}
                    />
                </div>

                {columns.map((col, index) => (
                    <div key={index}>
                        <label>Column Name {index + 1}</label>
                        <input
                            type="text"
                            className="border w-full p-2 rounded mt-1"
                            value={col}
                            onChange={(e) => handleColumnName(index, e.target.value)}
                        />
                    </div>
                ))}

                <button className="w-full bg-blue-500 text-white p-2 rounded-2xl hover:bg-blue-600">
                    Create Record
                </button>

            </form>
        </div>
    );
};

export default RecordForm;
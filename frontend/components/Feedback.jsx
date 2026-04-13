"use client";
import React, { useState } from "react";

const Feedback = () => {
    const initialstate=
        {
            name:"",
            email:"",
            message:""
        }
    const [form, setform] = useState(initialstate);
    const API = process.env.NEXT_PUBLIC_API_URL;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setform({
      ...form,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`${API}/feedpost`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form), 
        });

        const result = await response.json();

        if (response.ok) {
            alert("Feedback submitted successfully!");
            console.log("Success:", result);
            setform(initialstate); 
        } else {
            alert("Submission failed: " + result.message);
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

                <h2 className="text-xl font-bold text-center">Feedback</h2>

                <div>
                    <label>Name</label>
                    <input
                    name="name"
                        type="text"
                        className="border w-full p-2 rounded mt-1"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Email address</label>
                    <input
                        type="email"
                        name="email"
                        className="border w-full p-2 rounded mt-1"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>
                 <div>
                    <label>Message</label>
                    <textarea 
                    className="border w-full p-2 rounded mt-1"
                    name="message"
                        value={form.message}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Send feedback
                </button>

            </form>
        </div>
    );
};

export default Feedback;
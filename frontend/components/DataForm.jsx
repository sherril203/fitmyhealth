"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"

const DataForm = () => {
  const API = process.env.NEXT_PUBLIC_API_URL
  const params = useParams()
  const [record, setRecord] = useState(null)
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    if (params?.id) fetchRecord()
  }, [params.id])

  const fetchRecord = async () => {
    try {
      const res = await fetch(`${API}/getrecord/${params.id}`)
      const data = await res.json()
      if (res.ok) {
        const rec = data.data || data
        setRecord(rec)
        setRowData(Array(rec.column_name.length).fill(""))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (i, val) => {
    const updated = [...rowData]
    updated[i] = val
    setRowData(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/postdata/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row_data: rowData })
      })
      const data = await res.json()
      if (res.ok) {
        alert("Added")
        setRowData(Array(record.column_name.length).fill(""))
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (!record) return <p>Loading...</p>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-[500px] space-y-4">
        <h1 className="text-2xl font-bold text-center">{record.title}</h1>
        {record.column_name.map((col, i) => (
          <div key={i}>
            <label>{col}</label>
            <input type="text" value={rowData[i]} onChange={(e) => handleChange(i, e.target.value)} className="w-full border p-2 rounded mt-1" />
          </div>
        ))}
        <button className="w-full bg-blue-500 text-white p-3 rounded-xl">Save</button>
      </form>
    </div>
  )
}

export default DataForm
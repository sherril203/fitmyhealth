const { dataModel } = require('../models/data.model')

const postdata = async (req, res) => {
    try {
        const { id } = req.params
        const saved = await dataModel.create({
            record_id: id,
            row_data: req.body.row_data
        })
        res.status(201).send({ message: "Data submitted", data: saved })
    } catch (err) {
        res.status(500).send({ message: "Error submitting data" })
    }
}
const getdata = async (req, res) => {
    try {
        const { id } = req.params
        const showrecord = await dataModel.find({ record_id: id }).sort({ _id: -1 })
        res.status(200).send({ data: showrecord })
    } catch (err) {
        res.status(500).send({ message: "Error fetching data" })
    }
}

const getsingledata = async (req, res) => {
    try {
        const { id } = req.params
        const single = await dataModel.findById(id)
        if (!single) return res.status(404).send({ message: "Not found" })
        res.status(200).send({ data: single })
    } catch (err) {
        res.status(500).send({ message: "Error" })
    }
}

const updatedata = async (req, res) => {
    try {
        const { id } = req.params
        const updated = await dataModel.findByIdAndUpdate(id, req.body, { new: true })
        if (!updated) return res.status(404).send({ message: "Not found" })
        res.status(200).send({ message: "Updated", data: updated })
    } catch (err) {
        res.status(500).send({ message: "Error updating" })
    }
}

const deletedata = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await dataModel.findByIdAndDelete(id)
        if (!deleted) return res.status(404).send({ message: "Not found" })
        res.status(200).send({ message: "Deleted" })
    } catch (err) {
        res.status(500).send({ message: "Error deleting" })
    }
}

module.exports = { postdata, getdata, getsingledata, updatedata, deletedata }
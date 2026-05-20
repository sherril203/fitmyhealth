const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
  record_id: {type: mongoose.Schema.Types.ObjectId,ref: "records"},
  row_data: {type: [String]}
});
const dataModel=mongoose.model("datas", dataSchema)
module.exports={dataModel}
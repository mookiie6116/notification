const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotifySchema = new Schema(
  { 
    id:{
      type: String
    },
    ref_no:{
      type: String
    },
    msg:{
      type: String
    },
    to:{
      type: String
    },
    read:{
      type: Boolean,
      default: false
    },
    createdBy:{
      type: String,
      default: "system"
    },
    createdAt:{
      type: Date
    },
    updatedBy:{
      type: String,
      default: "system"
    }
  },
  {
    timestamps: true
  }
);

let notify = mongoose.model("notify", NotifySchema);

module.exports = notify;
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

// const url = "mongodb://192.168.51.103:27017/notify";
const url = "mongodb://localhost:27017/notify";

const connect = mongoose.connect(url, { useNewUrlParser: true });

module.exports = connect;
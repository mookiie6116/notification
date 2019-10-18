const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const url = "mongodb://172.18.60.3:27017/notify";
// const url = "mongodb://localhost:27017/notify";
// const url = "mongodb://10.11.6.49:27017/notify";

const connect = mongoose.connect(url, { useNewUrlParser: true });

module.exports = connect;
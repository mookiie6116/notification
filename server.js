const express = require("express");
const path = require('path')
const cors = require('cors')
const app = express();
const bodyParser = require("body-parser");
const http = require("http").Server(app);
const port = process.env.PORT || 9003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// api
app.use('/api/v1', require('./api/api.js'));

// html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/html/index.html');
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
const express = require("express");
const path = require('path')
const cors = require('cors')
const app = express();
const bodyParser = require("body-parser");
const connectdb = require("./dbconnect");
const notify = require("./models/Notify");
const http = require("http").Server(app);
const port = process.env.PORT || 9003;
const io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// api
app.use('/api/v1', require('./api/api_v1'));
// html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/html/index.html');
});
app.get('/notify', function (req, res) {
  res.sendFile(__dirname + '/public/html/notify.html');
});
io.on("connection",(socket) => {
  socket.on("a-ping", (msg)=>{
    socket.emit("a-pong", msg+"pong");
  });
  socket.on("a-connected-notify",(data)=>{
    connectdb.then(db => {
      notify
        .aggregate([{
          $match: {
            $and: [
              {
                to: data
              },
              {
                read: false
              }
            ]
          }
        }, { $count: "read" }])
        .then(notify => {
          if (notify.length) {
            socket.emit("a-notify-notify",notify[0].read);
          }else{
            socket.emit("a-notify-notify",0);
          }
        });
    })
  })
})

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
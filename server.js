const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const server = require("http").Server(app);

const fs = require("fs");
const five = require("johnny-five");
const board = new five.Board();
const io = require("socket.io")(server);

app.listen(process.env.PORT || 8080, () => {
  console.log("Listening to requests on port 8080...");
});

let timeCounter = 0;

app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function(req, res) {
  board.on("ready", function() {
    console.log("We are in the board.on function");
    const mySensor = new five.Sensor("A0");
    io.on("connection", function(socket) {
      mySensor.on("change", function(event) {
        const currentTime = Date.now();
        //console.log("the time is", Date.now());
        const scaledData = this.scaleTo(0, 100);
        const output = scaledData + " " + currentTime + "\n";
        const timeObj = { x: timeCounter++, y: scaledData };
        socket.emit("emg", timeObj);
        console.log(timeObj);
        fs.appendFile("test.txt", output, function(err) {
          if (err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        });
      });
    });
  });

  //return res.send("pong");
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/test", function(req, res) {
  res.sendFile(path.join(__dirname, "test.txt"));
});

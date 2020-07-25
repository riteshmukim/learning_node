const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

const dbUrl =
  "mongodb+srv://admin:admin@cluster0.eqenz.mongodb.net/cluster0-shard-00-01?retryWrites=true&w=majority";

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Message = mongoose.model("Message", {
  name: String,
  message: String,
});

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  const message = new Message(req.body);

  message.save((err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }

    io.emit("message", req.body);
    res.sendStatus(200);
  });
});

io.on("connection", (socket) => {
  console.log("user connected");
});

mongoose.connect(
  dbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("mongoose connection", err);
  }
);

const server = http.listen(3000, () =>
  console.log("server is listening on port:", server.address().port)
);

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

  message
    .save()
    .then(() => {
      console.log("saved");
      return Message.findOne({ message: "badwords" });
    })
    .then((censored) => {
      if (censored) {
        console.log("censored message found", censored);
        return Message.deleteOne({ _id: censored.id });
      }

      io.emit("message", req.body);
      res.sendStatus(200);
    })
    .then(() => {
      console.log("deleted");
    })
    .catch((err) => {
      res.sendStatus(500);
      return console.error(err);
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

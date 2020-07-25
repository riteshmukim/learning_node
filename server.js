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

app.get("/messages/:user", (req, res) => {
  const user = req.params.user;
  Message.find({ name: user }, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    console.log("saved");
    const censored = await Message.findOne({ message: "badwords" });

    if (censored) {
      console.log("censored message found", censored);
      await Message.deleteOne({ _id: censored.id });
    } else {
      io.emit("message", req.body);
    }
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    return console.error(err);
  } finally {
    // logger.log('message successfully savef');
  }
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

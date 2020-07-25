const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const messages = [
  {
    name: "Tim",
    message: "hello",
  },
  {
    name: "Bob",
    message: "hi",
  },
];

app.get("/messages", (req, res) => {
  res.send(messages);
});

app.post("/messages", (req, res) => {
  messages.push(req.body);
  io.emit("message", req.body);
  res.sendStatus(200);
});

io.on("connection", (socket) => {
  console.log("user connected");
});

const server = http.listen(3000, () =>
  console.log("server is listening on port:", server.address().port)
);

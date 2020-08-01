var app = require("express")();
var static = require("express-static");
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use("/", static(__dirname + "/"));
var names = [
  "钦玉宸",
  "宋俊焱",
  "闪铭轩",
  "城浩奇",
  "区梓睿",
  "仵哲",
  "紫志达",
  "谢逸龙",
  "节旭东",
  "杭艺童",
  "冷卿硕",
  "谈博泽",
  "唐文轩",
  "衣树恺",
  "文光磊",
  "盈涵博",
  "都浩轩",
  "殷逸",
  "翔綦恩",
  "硕迟",
  "子斌",
  "况家豪",
];
var users = ["沙桐", "方子培", "何宸风", "王智慧"];
var user = [];
io.on("connection", (socket) => {
  console.log("用户已连接", socket.handshake.address.slice(7, -1));
  let nip = socket.handshake.address.slice(7, -1);
  let name = "";
  let isName = false;
  let isImg = false;
  socket.on("cmsg", ({ uname, msg }) => {
    user.forEach((i) => {
      if (i.ip == nip) {
        name = i.name;
        isName = true;
      }
    });
    if (uname && !isName) {
      name = uname;
      user.push({ name, ip: nip });
    } else if (!uname && !isName) {
      name = names[0];
      names.shift();
      user.push({ name, ip: nip });
    }
    users.forEach((i) => {
      if (i == name) {
        isImg = true;
      }
    });
    socket.broadcast.emit("smsg", {
      msg,
      name,
      id: socket.id,
      time: new Date().getTime(),
      isImg,
    });
    socket.emit("mmsg", {
      msg,
      name,
      id: socket.id,
      time: new Date().getTime(),
      isImg,
    });
  });
  socket.on("disconnect", () => {
    console.log("用户已断开");
  });
});

http.listen(80, () => {
  console.log("http://localhost:80");
});

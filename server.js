const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const filtere = require("./public/js/filter")
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const Filter = require('bad-words');
const fs = require('fs');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const redis = require("redis");
const { spawn } = require("child_process");


 
require("dotenv").config();
const { createClient } = redis;
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "";

// Start Redis server
const redisServer = spawn("redis-server");

redisServer.on("error", (err) => {
  console.error("Failed to start Redis server", err);
});

redisServer.on("exit", (code, signal) => {
  console.error(
    `Redis server exited with code ${code} and signal ${signal}`
  );
});

(async () => {
  pubClient = createClient({ url: "redis://127.0.0.69:6379" });
  //pubClient = createClient({ url: "redis://127.0.0.1:6379" });
  await pubClient.connect();
  subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
})();

// Run when client connects
io.on("connection", (socket) => {
  // console.log(io.of("/").adapter);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    
    
    
    
    // console.log(username)
    // console.log(room)
    // console.log(getRoomUsers(user.room))
    
    // getRoomUsers(user.room).forEach((user) => {
    //   if (username === user) {
    //     allow = false;
    //   }
    // });

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, `${user.username} has joined the chat`));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    
  function deffilter() {
  return {
    
  };
}
module.exports = formatMessage;

    const filter = new Filter({ placeHolder: "*"});
    //filter = new Filter();             
    filter.removeWords("Fuck");
    filter.removeWords("Fucking");
    filter.removeWords("shit");
    
    
    $.getScript("/js/filter.js");
    try { // idk if this will work
      io.to(user.room).emit("message", formatMessage(user.username, filter.clean(msg)));
      console.log(`(${user.room}) <${user.username}> ${msg}`);
      let log = `${user.room},${user.username},${msg}\n`;      
      fs.appendFileSync('log.csv', log);
      
    } catch (error) {
      console.log('A user tried typing but is disconnected!')
    }
    // Logs Chat messages also I I think I can filter it  leave log chat so we can read what people type 
    // I fixed the crashing bug
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

var port = ["80","8069","8080","443"]
const Port = Math.floor(Math.random() * port.length);

const PORT = process.env.PORT || port[Port];

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

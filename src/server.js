// import WebSocket from "ws";
import SocketIO from "socket.io";
import http from "http";
import express from "express";
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname +"/views" );
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));



const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        // console.log(`Socket Event:${event}`);
        console.log(socket.rooms);
    });
    socket.on("enter_room", (roomName, showRoom) => {
        socket.join(roomName);
        showRoom();
        socket.to(roomName).emit("welcome", socket.nickname); 
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => 
          socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => socket["nickname"] = nickname)
});

/* 
const wss = new WebSocket.Server({ server });

function onSocketClose() {
    console.log("Disconnected from the Browser 😂");
}

const sockets = [];

    wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser 🤞");
    socket.on("close", onSocketClose);
    socket.on("message", (msg)=> {
        const message = JSON.parse(msg)
        switch(message.type){
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
            case "nickname":
                socket["nickname"] = message.payload;

        }       
    });
});   */

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);
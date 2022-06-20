import express from "express";
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
export const io = new Server(server);
const PORT: string | number = process.env.PORT || 4561;

app.use(express.static("client/build"));
app.use(express.json());

io.on("connection", (socket) => {
    socket.on("user-join", (roomId: string) => {
        if (roomId) {
            socket.join(roomId)
            console.log(`connecte user to room ${roomId}`)
        }
    })

    socket.on("chat-user", ({ roomNumber, msg }) => {
        console.log('message: ' + msg);
        io.to(roomNumber).emit('user-message', msg);
    })

    socket.on("user-leave", (roomId: string) => {
        if (roomId) {
            socket.leave(roomId);
            console.log(`leaved user to room ${roomId}`)
        }
    });
})


server.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});
const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket)=> {
  // console.log(`${socket.id} Connected`);
  socket.on("registerUser", ({ userId })=> {
    userSockets[userId] = socket.id
    socket.join("users")
    // console.log(userSockets)
  })

  socket.on("registerMagasin", ({ userId })=> {
    userSockets[userId] = socket.id
    socket.join("magasins")
    console.log(userSockets)
  })
})



io.listen(3000, () => {
  console.log('listening on *:3000');
});

const userSockets = {}

module.exports = {io, userSockets}
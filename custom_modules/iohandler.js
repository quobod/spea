import User from "../models/UserModel.js";
let userManager;

const handleIo = (io, um) => {
  userManager = um;
  io.on("connection", (socket) => {
    userManager.addUser(socket.id);
    logPeers();

    socket.on("preoffer", (data) => {
      const { calleePersonalCode, callType, callerRmtUid } = data;

      User.findById({ _id: `${callerRmtUid}` })
        .then((user) => {
          console.log(
            `\n\tPreoffer sent by ${user.fname} ${
              user.lname
            } to ${calleePersonalCode}\n\tData:\t${JSON.stringify(data)}`
          );

          const connectedPeer = userManager.getUser(calleePersonalCode);
          const caller = {
            fname: user.fname,
            lname: user.lname,
            email: user.email,
          };

          if (connectedPeer) {
            const data = {
              callerSocketId: socket.id,
              caller,
              callType,
            };

            io.to(calleePersonalCode).emit("preoffer", data);
          } else {
            const data = { preOfferAnswer: "CALLEE_NOT_FOUND" };
            io.to(socket.id).emit("preofferanswer", data);
          }
        })
        .catch((err) => {
          log(err);
          return;
        });
    });

    socket.on("preofferanswer", (data) => {
      console.log(`\n\tPre offer answer came\n\tData: ${JSON.stringify(data)}`);

      const { callerSocketId, preOfferAnswer } = data;

      const connectedPeer = userManager.getUser(callerSocketId);

      if (connectedPeer) {
        io.to(callerSocketId).emit("preofferanswer", data);
      }
    });

    socket.on("disconnect", () => {
      console.log(`\n\tUser ${socket.id} disconnected`);
      userManager.removeUserById(socket.id);
      logPeers();
    });

    socket.on("webrtcsignaling", (data) => {
      const { connectedUserSocketId } = data;

      console.log(
        `\n\tReceived web rtc signaling event from ${socket.id}\n\tSending data to ${connectedUserSocketId}`
      );

      const connectedPeer = userManager.getUser(connectedUserSocketId);

      if (connectedPeer) {
        io.to(connectedUserSocketId).emit("webrtcsignaling", data);
      } else {
        console.log(
          `\n\tError within the io server webrtcsignaling event handler\n\tReceived data: ${JSON.stringify(
            data
          )}`
        );
      }
    });
  });
};

function logPeers() {
  const users = userManager.getUsers();
  console.log(infoMessage(`\n\tConnected Peers: ${users.length}`));
  if (users.length > 0) {
    users.forEach((p) => log(`\t\t${p.uid}`));
  }
}

export default handleIo;

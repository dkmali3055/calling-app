//add socket server and create function for socket connection to handle incoming call, accept call, reject call,start call
// Compare this snippet from src/screens/call/index.js:
//     const handleCall = () => {
//     //call user
//     socket.emit("call-user", {
//       userToCall: receiverId,
//       signalData: peer.signal,
//       from: socket.id,
//     });
//   };
//
//   const handleAcceptCall = () => {
//     //accept call
//     socket.emit("accept-call", {
//       signal: peer.signal,
//       to: callerId,
//     });
//   };
//
//   const handleRejectCall = () => {
//     //reject call
//     socket.emit("reject-call", {
//       signal: peer.signal,
//       to: callerId,
//     });
//   };
//
//   const handleStartCall = () => {
//     //start call
//     socket.emit("start-call", {
//       signal: peer.signal,
//       to: callerId,
//     });
//   };
//
//   //incoming call
//   useEffect(() => {
//     if (socket) {
//       socket.on("incoming-call", (data) => {
//         console.log("incoming-call", data);
//         setCallerId(data.from);
//       });
//     }
//   }, [socket]);
//

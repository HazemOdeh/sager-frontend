import { io } from "socket.io-client";

const socket = io("http://localhost:9013", {
  transports: ["polling"],
});

export default socket;

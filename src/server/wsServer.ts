import WebSocket from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./router";
const wss = new WebSocket.Server({ port: 3001 });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: () => null,
});

wss.on("connection", (ws) => {
  console.log(`Connection (${wss.clients.size})`);
  wss.once("close", () => {
    console.log(`Disconnection (${wss.clients.size})`);
  });
});

console.log(`Listening on port ${wss.address}:${wss.options.port}`);

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received.");
  handler.broadcastReconnectNotification();
  wss.close();
});

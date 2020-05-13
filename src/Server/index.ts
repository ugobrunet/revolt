import { Server } from "boardgame.io/server";
import { Game as ReVolt } from "../ReVoltCore";
// const server = Server({ games: [] });
const server = Server({ games: [ReVolt] });
const PORT = process.env.PORT || 5000;
server.run(+PORT);

export {};

import { Server } from "boardgame.io/server";
import { Game as FlammeRouge } from "../FlammeRougeCore";
// const server = Server({ games: [] });
const server = Server({ games: [FlammeRouge] });
const PORT = process.env.PORT || 5000;
server.run(+PORT);

export {};

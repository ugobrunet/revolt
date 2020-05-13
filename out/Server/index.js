import { Server } from "boardgame.io/server";
import { Game as ReVolt } from "../ReVoltCore";
// const server = Server({ games: [] });
var server = Server({ games: [ReVolt] });
var PORT = process.env.PORT || 5000;
server.run(+PORT);
//# sourceMappingURL=index.js.map
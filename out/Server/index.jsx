import { Server } from "boardgame.io/server";
import { Game as FlammeRouge } from "../FlammeRougeCore";
// const server = Server({ games: [] });
var server = Server({ games: [FlammeRouge] });
var PORT = process.env.PORT || 5000;
server.run(+PORT);
//# sourceMappingURL=index.jsx.map
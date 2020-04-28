import React from "react";
import intl from "react-intl-universal";
import { Lobby } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import OnlineLobby from "../OnlineLobby";
import { Game as FlammeRouge } from "../FlammeRougeCore";
import FlammeRougeUI from "../FlammeRougeCore/UI";
import Config from "../FlammeRougeCore/config";
var url = Config && Config.REACT_APP_API_URL
    ? Config.REACT_APP_API_URL
    : "localhost:8000";
var http = Config && Config.HTTP ? Config.HTTP : "http://";
// const hostname = window.location.hostname;
var importedGames = [
    {
        game: FlammeRouge,
        board: FlammeRougeUI,
        multiplayer: SocketIO({ server: url }),
        loading: function () { return <div>{intl.get("online.connecting")}</div>; },
    },
];
var OnlineLobbyPage = function () { return (<Lobby gameServer={http + url} lobbyServer={http + url} gameComponents={importedGames} renderer={function (_a) {
    var errorMsg = _a.errorMsg, gameComponents = _a.gameComponents, rooms = _a.rooms, phase = _a.phase, playerName = _a.playerName, runningGame = _a.runningGame, handleEnterLobby = _a.handleEnterLobby, handleExitLobby = _a.handleExitLobby, handleCreateRoom = _a.handleCreateRoom, handleJoinRoom = _a.handleJoinRoom, handleLeaveRoom = _a.handleLeaveRoom, handleExitRoom = _a.handleExitRoom, handleRefreshRooms = _a.handleRefreshRooms, handleStartGame = _a.handleStartGame;
    return (<OnlineLobby errorMsg={errorMsg} gameComponents={gameComponents} gameInstances={rooms} phase={phase} playerName={playerName} runningGame={runningGame} onEnterLobby={handleEnterLobby} onExitLobby={handleExitLobby} onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} onLeaveRoom={handleLeaveRoom} onExitRoom={handleExitRoom} onStartGame={handleStartGame}/>);
}}/>); };
export default OnlineLobbyPage;
//# sourceMappingURL=index.js.map
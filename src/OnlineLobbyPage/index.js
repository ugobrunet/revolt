import React from "react";
import intl from "react-intl-universal";
import { Lobby } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import OnlineLobby from "../OnlineLobby";
import { Game as FlammeRouge } from "../FlammeRougeCore";
import FlammeRougeUI from "../FlammeRougeCore/UI";
import Config from "../FlammeRougeCore/config";

const url =
  Config && Config.REACT_APP_API_URL
    ? Config.REACT_APP_API_URL
    : "localhost:8000";
const http = Config && Config.HTTP ? Config.HTTP : "http://";
// const hostname = window.location.hostname;
const importedGames = [
  {
    game: FlammeRouge,
    board: FlammeRougeUI,
    multiplayer: SocketIO({ server: url }),
    loading: () => <div>{intl.get("online.connecting")}</div>,
  },
  // {
  //   game: Game,
  //   board: UI,
  //   multiplayer: SocketIO({ server: url }),
  //   loading: () => <div>{intl.get("online.connecting")}</div>,
  // },
];

const OnlineLobbyPage = () => (
  <Lobby
    gameServer={http + url}
    lobbyServer={http + url}
    gameComponents={importedGames}
    renderer={({
      errorMsg,
      gameComponents,
      rooms,
      phase,
      playerName,
      runningGame,
      handleEnterLobby,
      handleExitLobby,
      handleCreateRoom,
      handleJoinRoom,
      handleLeaveRoom,
      handleExitRoom,
      handleRefreshRooms,
      handleStartGame,
    }) => (
      <OnlineLobby
        errorMsg={errorMsg}
        gameComponents={gameComponents}
        gameInstances={rooms}
        phase={phase}
        playerName={playerName}
        runningGame={runningGame}
        onEnterLobby={handleEnterLobby}
        onExitLobby={handleExitLobby}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onLeaveRoom={handleLeaveRoom}
        onExitRoom={handleExitRoom}
        onStartGame={handleStartGame}
      />
    )}
  />
);

export default OnlineLobbyPage;

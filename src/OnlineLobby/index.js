import React, { Component, Fragment } from "react";
import intl from "react-intl-universal";

import Error from "../Error";
import OnlineLogin from "../OnlineLogin";
import OnlineRooms from "../OnlineRooms";
import OnlineExit from "../OnlineExit";

const selectAllPlayersNames = props => {
  const playersNames = [];

  if (!Array.isArray(props.gameInstances)) {
    return playersNames;
  }

  props.gameInstances.forEach(gameInstance => {
    gameInstance.players.forEach(player => {
      if (player.name) {
        playersNames.push(player.name);
      }
    });
  });

  return playersNames;
};

class OnlineLobby extends Component {
  componentDidMount() {}

  handleLoginClick = name => {
    this.props.onEnterLobby(name);
  };

  handleLogoutClick = () => {
    const { gameInstances, playerName } = this.props;
    const currentPlayerGames = gameInstances.filter(gameInstance =>
      gameInstance.players.some(player => player.name === playerName)
    );
    currentPlayerGames.forEach(game => this.handleLeaveRoomClick(game.gameID));
    this.props.onExitLobby();
  };

  handleCreateRoomClick = (game, player) => {
    this.props.onCreateRoom(game, player);
  };

  handleJoinRoomClick = (gameName, gameId, playerId) => {
    this.props.onJoinRoom(gameName, gameId, playerId);
  };

  handleLeaveRoomClick = (gameName, gameId) => {
    this.props.onLeaveRoom(gameName, gameId);
  };

  handlePlayClick = (gameName, gameId, playerId, numPlayers) => {
    this.props.onStartGame(gameName, {
      gameID: gameId,
      playerID: playerId,
      numPlayers
    });
  };

  handleSpectateClick = (gameName, gameId, numPlayers) => {
    this.props.onStartGame(gameName, {
      gameID: gameId,
      numPlayers
    });
  };

  handleExitRoomClick = () => {
    this.props.onExitRoom();
  };

  render() {
    const {
      errorMsg,
      phase,
      playerName,
      gameInstances,
      gameComponents,
      runningGame
    } = this.props;

    if (errorMsg) {
      return (
        <Error>
          {intl.get("error")}: {errorMsg}
        </Error>
      );
    }

    if (phase === "enter") {
      return (
        <OnlineLogin
          playerName={playerName}
          playersNames={selectAllPlayersNames(this.props)}
          onLogin={this.handleLoginClick}
        />
      );
    }

    if (phase === "list") {
      return (
        <Fragment>
          <OnlineExit
            exitButtonLabel={intl.get("online.logout")}
            playerName={playerName}
            onExit={this.handleLogoutClick}
          />
          <OnlineRooms
            gameComponents={gameComponents}
            gameInstances={gameInstances}
            playerName={playerName}
            alreadyJoined={selectAllPlayersNames(this.props).includes(
              playerName
            )}
            onCreate={this.handleCreateRoomClick}
            onJoin={this.handleJoinRoomClick}
            onLeave={this.handleLeaveRoomClick}
            onPlay={this.handlePlayClick}
            onSpectate={this.handleSpectateClick}
            onLogout={this.handleLogoutClick}
          />
        </Fragment>
      );
    }

    if (phase === "play") {
      return (
        <Fragment>
          <OnlineExit
            exitButtonLabel={intl.get("online.exit")}
            playerName={playerName}
            playerID={runningGame.playerID}
            onExit={this.handleExitRoomClick}
          />
          {runningGame && (
            <runningGame.app
              gameID={runningGame.gameID}
              playerID={runningGame.playerID}
              credentials={runningGame.credentials}
            />
          )}
        </Fragment>
      );
    }

    return "Phase is unknown...";
  }
}

export default OnlineLobby;

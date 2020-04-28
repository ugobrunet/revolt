var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { Component, Fragment } from "react";
import intl from "react-intl-universal";
import Error from "../Error";
import OnlineLogin from "../OnlineLogin";
import OnlineRooms from "../OnlineRooms";
import OnlineExit from "../OnlineExit";
var selectAllPlayersNames = function (props) {
    var playersNames = [];
    if (!Array.isArray(props.gameInstances)) {
        return playersNames;
    }
    props.gameInstances.forEach(function (gameInstance) {
        gameInstance.players.forEach(function (player) {
            if (player.name) {
                playersNames.push(player.name);
            }
        });
    });
    return playersNames;
};
var OnlineLobby = /** @class */ (function (_super) {
    __extends(OnlineLobby, _super);
    function OnlineLobby() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleLoginClick = function (name) {
            _this.props.onEnterLobby(name);
        };
        _this.handleLogoutClick = function () {
            var _a = _this.props, gameInstances = _a.gameInstances, playerName = _a.playerName;
            var currentPlayerGames = gameInstances.filter(function (gameInstance) {
                return gameInstance.players.some(function (player) { return player.name === playerName; });
            });
            currentPlayerGames.forEach(function (game) { return _this.handleLeaveRoomClick(game.gameID); });
            _this.props.onExitLobby();
        };
        _this.handleCreateRoomClick = function (game, player) {
            _this.props.onCreateRoom(game, player);
        };
        _this.handleJoinRoomClick = function (gameName, gameId, playerId) {
            _this.props.onJoinRoom(gameName, gameId, playerId);
        };
        _this.handleLeaveRoomClick = function (gameName, gameId) {
            _this.props.onLeaveRoom(gameName, gameId);
        };
        _this.handlePlayClick = function (gameName, gameId, playerId, numPlayers) {
            _this.props.onStartGame(gameName, {
                gameID: gameId,
                playerID: playerId,
                numPlayers: numPlayers
            });
        };
        _this.handleSpectateClick = function (gameName, gameId, numPlayers) {
            _this.props.onStartGame(gameName, {
                gameID: gameId,
                numPlayers: numPlayers
            });
        };
        _this.handleExitRoomClick = function () {
            _this.props.onExitRoom();
        };
        return _this;
    }
    OnlineLobby.prototype.componentDidMount = function () { };
    OnlineLobby.prototype.render = function () {
        var _a = this.props, errorMsg = _a.errorMsg, phase = _a.phase, playerName = _a.playerName, gameInstances = _a.gameInstances, gameComponents = _a.gameComponents, runningGame = _a.runningGame;
        if (errorMsg) {
            return (<Error>
          {intl.get("error")}: {errorMsg}
        </Error>);
        }
        if (phase === "enter") {
            return (<OnlineLogin playerName={playerName} playersNames={selectAllPlayersNames(this.props)} onLogin={this.handleLoginClick}/>);
        }
        if (phase === "list") {
            return (<Fragment>
          <OnlineExit exitButtonLabel={intl.get("online.logout")} playerName={playerName} onExit={this.handleLogoutClick}/>
          <OnlineRooms gameComponents={gameComponents} gameInstances={gameInstances} playerName={playerName} alreadyJoined={selectAllPlayersNames(this.props).includes(playerName)} onCreate={this.handleCreateRoomClick} onJoin={this.handleJoinRoomClick} onLeave={this.handleLeaveRoomClick} onPlay={this.handlePlayClick} onSpectate={this.handleSpectateClick} onLogout={this.handleLogoutClick}/>
        </Fragment>);
        }
        if (phase === "play") {
            return (<Fragment>
          <OnlineExit exitButtonLabel={intl.get("online.exit")} playerName={playerName} playerID={runningGame.playerID} onExit={this.handleExitRoomClick}/>
          {runningGame && (<runningGame.app gameID={runningGame.gameID} playerID={runningGame.playerID} credentials={runningGame.credentials}/>)}
        </Fragment>);
        }
        return "Phase is unknown...";
    };
    return OnlineLobby;
}(Component));
export default OnlineLobby;
//# sourceMappingURL=index.js.map
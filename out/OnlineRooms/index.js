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
import { prettify } from "../Utils";
import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import IconAdd from "@material-ui/icons/AddCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import OnlineRoom from "../OnlineRoom";
import Tooltip from "@material-ui/core/Tooltip";
import { Layout } from "./elements";
import CreateRoomDialog from "../CreateRoomDialog";
// const findDuplicates = (arr) =>
//   arr.filter((item, index) =>
//     arr.filter((it, id) => id !== index).some((el) => el.gameID === item.gameID)
//   );
var removeDuplicates = function (myArr, prop) {
    return myArr.filter(function (obj, pos, arr) {
        return arr.map(function (mapObj) { return mapObj[prop]; }).indexOf(obj[prop]) === pos;
    });
};
var OnlineRooms = /** @class */ (function (_super) {
    __extends(OnlineRooms, _super);
    function OnlineRooms() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            openCreateRoomDialog: false,
        };
        _this.handleOpenCreateRoomDialog = function () {
            _this.setState({ openCreateRoomDialog: true });
        };
        _this.handleCloseCreateRoomDialog = function () {
            _this.setState({ openCreateRoomDialog: false });
        };
        _this.handleValidateCreateRoomDialog = function (_game, _player) {
            _this.props.onCreate(_game, _player);
        };
        _this.handleCreateRoomClick = function () {
            _this.handleOpenCreateRoomDialog();
            // this.props.onCreate();
        };
        _this.handleJoinRoomClick = function (gameName, gameId, playerId) {
            _this.props.onJoin(gameName, gameId, playerId);
        };
        _this.handleLeaveRoomClick = function (gameName, gameId) {
            _this.props.onLeave(gameName, gameId);
        };
        _this.handlePlayClick = function (gameName, gameId, playerId, numPlayers) {
            _this.props.onPlay(gameName, gameId, playerId, numPlayers);
        };
        _this.handleSpectateClick = function (gameName, gameId, numPlayers) {
            _this.props.onSpectate(gameName, gameId, numPlayers);
        };
        return _this;
    }
    OnlineRooms.prototype.render = function () {
        var _this = this;
        var _a = this.props, gameInstances = _a.gameInstances, gameComponents = _a.gameComponents, playerName = _a.playerName, alreadyJoined = _a.alreadyJoined;
        var openCreateRoomDialog = this.state.openCreateRoomDialog;
        var gameInstancesFiltered = removeDuplicates(gameInstances, "gameID");
        // const duplicates = findDuplicates(gameInstances);
        // if (duplicates.length > 0) {
        //   console.log("Duplicates found in gameInstances:", gameInstances);
        // }
        return (<Layout>
        <Card>
          <CardHeader title={intl.get("online.rooms_title")} subheader={intl.get("online.rooms_subtitle")} action={<Fragment>
                <Tooltip title={intl.get("online.new_room")}>
                  <IconButton color="primary" disabled={gameInstancesFiltered.length > 4} onClick={this.handleCreateRoomClick}>
                    <IconAdd />
                  </IconButton>
                </Tooltip>
              </Fragment>}/>
        </Card>
        {gameInstancesFiltered.map(function (gameInstance) { return (<OnlineRoom key={"game-" + gameInstance.gameID} name={prettify(gameInstance.gameName) +
            ("  " + gameInstance.gameID.substring(0, 3))} roomId={gameInstance.gameID} roomName={gameInstance.gameName} players={gameInstance.players} playerName={playerName} alreadyJoined={alreadyJoined} onJoin={_this.handleJoinRoomClick} onLeave={_this.handleLeaveRoomClick} onPlay={_this.handlePlayClick} onSpectate={_this.handleSpectateClick}/>); })}
        <CreateRoomDialog open={openCreateRoomDialog} onClose={this.handleCloseCreateRoomDialog} onValidate={this.handleValidateCreateRoomDialog} gameList={gameComponents}/>
      </Layout>);
    };
    return OnlineRooms;
}(Component));
export default OnlineRooms;
//# sourceMappingURL=index.js.map
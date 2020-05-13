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
import React, { Component } from "react";
import intl from "react-intl-universal";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { AlignCenterItem, 
// AlignLeftItem,
AlignRightItem, DetachedContainer, VersusTag, } from "./elements";
var styles = function (theme) { return ({
    card: {
        marginTop: 12,
    },
    title: {
        fontSize: 14,
    },
}); };
var findPlayerSeat = function (players, playerName) {
    return players.find(function (player) { return player.name === playerName; });
};
var findFreeSeat = function (players) { return players.find(function (player) { return !player.name; }); };
var StyledRoom = /** @class */ (function (_super) {
    __extends(StyledRoom, _super);
    function StyledRoom() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleJoinClick = function () {
            var _a = _this.props, roomName = _a.roomName, roomId = _a.roomId, players = _a.players;
            _this.props.onJoin(roomName, roomId, findFreeSeat(players).id);
        };
        _this.handleLeaveClick = function () {
            var _a = _this.props, roomName = _a.roomName, roomId = _a.roomId;
            _this.props.onLeave(roomName, roomId);
        };
        _this.handlePlayClick = function () {
            var _a = _this.props, roomName = _a.roomName, roomId = _a.roomId, players = _a.players, playerName = _a.playerName;
            _this.props.onPlay(roomName, roomId, "" + findPlayerSeat(players, playerName).id, players.length);
        };
        _this.handleSpectateClick = function () {
            var _a = _this.props, roomName = _a.roomName, roomId = _a.roomId, players = _a.players;
            _this.props.onSpectate(roomName, roomId, players.length);
        };
        return _this;
    }
    StyledRoom.prototype.render = function () {
        var _a = this.props, name = _a.name, playerName = _a.playerName, players = _a.players, alreadyJoined = _a.alreadyJoined, classes = _a.classes;
        var playerSeat = findPlayerSeat(players, playerName);
        var freeSeat = findFreeSeat(players);
        var playerTags = [];
        for (var i = 0; i < players.length; i++) {
            playerTags.push(<AlignCenterItem key={2 * i} flex={2}>
          {players[i].name || "..."}
        </AlignCenterItem>);
            playerTags.push(<VersusTag key={2 * i + 1}/>);
        }
        if (playerTags.length > 0)
            playerTags.pop();
        return (<Card variant="outlined" className={classes.card}>
        <CardContent style={{
            paddingBottom: "12px",
        }}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {name}
          </Typography>
          <DetachedContainer alignItems="center">
            {playerTags}
          </DetachedContainer>
          <AlignRightItem>
            {playerSeat && (<Button color="primary" onClick={this.handleLeaveClick}>
                {intl.get("online.room_leave")}
              </Button>)}
            {freeSeat && !playerSeat && !alreadyJoined && (<Button color="primary" onClick={this.handleJoinClick}>
                {intl.get("online.room_join")}
              </Button>)}
            {!freeSeat && playerSeat && (<Button color="primary" onClick={this.handlePlayClick}>
                {intl.get("online.room_play")}
              </Button>)}
            {!freeSeat && !playerSeat && (<Button color="primary" onClick={this.handleSpectateClick}>
                {intl.get("online.room_spectate")}
              </Button>)}
          </AlignRightItem>
        </CardContent>
      </Card>);
    };
    return StyledRoom;
}(Component));
StyledRoom.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(StyledRoom);
//# sourceMappingURL=index.js.map
import React, { Component } from "react";
import intl from "react-intl-universal";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import {
  AlignCenterItem,
  AlignLeftItem,
  AlignRightItem,
  DetachedContainer,
  VersusTag
} from "./elements";

const styles = theme => ({
  card: {
    marginTop: 12
  },
  title: {
    fontSize: 14
  }
});

const findPlayerSeat = (players, playerName) =>
  players.find(player => player.name === playerName);
const findFreeSeat = players => players.find(player => !player.name);

class StyledRoom extends Component {
  handleJoinClick = () => {
    const { roomName, roomId, players } = this.props;
    this.props.onJoin(roomName, roomId, findFreeSeat(players).id);
  };

  handleLeaveClick = () => {
    const { roomName, roomId } = this.props;
    this.props.onLeave(roomName, roomId);
  };

  handlePlayClick = () => {
    const { roomName, roomId, players, playerName } = this.props;
    this.props.onPlay(
      roomName,
      roomId,
      `${findPlayerSeat(players, playerName).id}`,
      players.length
    );
  };

  handleSpectateClick = () => {
    const { roomName, roomId, players } = this.props;
    this.props.onSpectate(roomName, roomId, players.length);
  };

  render() {
    const { name, playerName, players, alreadyJoined, classes } = this.props;
    const playerSeat = findPlayerSeat(players, playerName);
    const freeSeat = findFreeSeat(players);

    let playerTags = [];
    for (let i = 0; i < players.length; i++) {
      playerTags.push(
        <AlignCenterItem key={2 * i} flex={2}>
          {players[i].name || "..."}
        </AlignCenterItem>
      );
      playerTags.push(<VersusTag key={2 * i + 1} />);
    }
    if (playerTags.length > 0) playerTags.pop();

    return (
      <Card variant="outlined" className={classes.card}>
        <CardContent
          style={{
            paddingBottom: "12px"
          }}
        >
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {name}
          </Typography>
          <DetachedContainer alignItems="center">
            {playerTags}
          </DetachedContainer>
          <AlignRightItem>
            {playerSeat && (
              <Button color="primary" onClick={this.handleLeaveClick}>
                {intl.get("online.room_leave")}
              </Button>
            )}
            {freeSeat && !playerSeat && !alreadyJoined && (
              <Button color="primary" onClick={this.handleJoinClick}>
                {intl.get("online.room_join")}
              </Button>
            )}
            {!freeSeat && playerSeat && (
              <Button color="primary" onClick={this.handlePlayClick}>
                {intl.get("online.room_play")}
              </Button>
            )}
            {!freeSeat && !playerSeat && (
              <Button color="primary" onClick={this.handleSpectateClick}>
                {intl.get("online.room_spectate")}
              </Button>
            )}
          </AlignRightItem>
        </CardContent>
      </Card>
    );
  }
}
StyledRoom.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StyledRoom);

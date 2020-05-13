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

const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

class OnlineRooms extends Component {
  state = {
    openCreateRoomDialog: false,
  };

  handleOpenCreateRoomDialog = () => {
    this.setState({ openCreateRoomDialog: true });
  };

  handleCloseCreateRoomDialog = () => {
    this.setState({ openCreateRoomDialog: false });
  };

  handleValidateCreateRoomDialog = (_game, _player) => {
    this.props.onCreate(_game, _player);
  };

  handleCreateRoomClick = () => {
    this.handleOpenCreateRoomDialog();
    // this.props.onCreate();
  };

  handleJoinRoomClick = (gameName, gameId, playerId) => {
    this.props.onJoin(gameName, gameId, playerId);
  };

  handleLeaveRoomClick = (gameName, gameId) => {
    this.props.onLeave(gameName, gameId);
  };

  handlePlayClick = (gameName, gameId, playerId, numPlayers) => {
    this.props.onPlay(gameName, gameId, playerId, numPlayers);
  };

  handleSpectateClick = (gameName, gameId, numPlayers) => {
    this.props.onSpectate(gameName, gameId, numPlayers);
  };

  render() {
    const {
      gameInstances,
      gameComponents,
      playerName,
      alreadyJoined,
    } = this.props;
    const { openCreateRoomDialog } = this.state;

    const gameInstancesFiltered = removeDuplicates(gameInstances, "gameID");
    // const duplicates = findDuplicates(gameInstances);
    // if (duplicates.length > 0) {
    //   console.log("Duplicates found in gameInstances:", gameInstances);
    // }

    return (
      <Layout>
        <Card>
          <CardHeader
            title={intl.get("online.rooms_title")}
            subheader={intl.get("online.rooms_subtitle")}
            action={
              <Fragment>
                <Tooltip title={intl.get("online.new_room")}>
                  <IconButton
                    color="primary"
                    disabled={gameInstancesFiltered.length > 4}
                    onClick={this.handleCreateRoomClick}
                  >
                    <IconAdd />
                  </IconButton>
                </Tooltip>
              </Fragment>
            }
          />
        </Card>
        {gameInstancesFiltered.map((gameInstance) => (
          <OnlineRoom
            key={`game-${gameInstance.gameID}`}
            name={
              prettify(gameInstance.gameName) +
              `  ${gameInstance.gameID.substring(0, 3)}`
            }
            roomId={gameInstance.gameID}
            roomName={gameInstance.gameName}
            players={gameInstance.players}
            playerName={playerName}
            alreadyJoined={alreadyJoined}
            onJoin={this.handleJoinRoomClick}
            onLeave={this.handleLeaveRoomClick}
            onPlay={this.handlePlayClick}
            onSpectate={this.handleSpectateClick}
          />
        ))}
        <CreateRoomDialog
          open={openCreateRoomDialog}
          onClose={this.handleCloseCreateRoomDialog}
          onValidate={this.handleValidateCreateRoomDialog}
          gameList={gameComponents}
        />
      </Layout>
    );
  }
}

export default OnlineRooms;

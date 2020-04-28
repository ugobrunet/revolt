import React, { Component } from "react";
import axios from "axios";
import intl from "react-intl-universal";

import BoardUI from "./BoardUI";
import HandUI from "./HandUI";
import CardsRemainingUI from "./CardsRemainingUI";
import ButtonUI from "./ButtonUI";
import SelectMapUI from "./SelectMapUI";
import PlaceRunnerUI from "./PlaceRunnerUI";
import Congratulations from "./Congratulations";
import LinearProgress from "@material-ui/core/LinearProgress";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";

import { Item, DetachedItem, Container } from "./elements";
import { Board } from "../Board";
import {
  getPlayersWhoShouldPickCard,
  getPlayersWhoShouldShoot,
  getPlayersFromGPlayers,
} from "../BoardUtilities";

import { Player, Deck } from "../Deck";
import Game from "../game";
import { MAX_NUMBER_OF_RUNNERS, NUMBER_OF_CARDS } from "../Settings";

import { prettify } from "../Utils";

import PlayersNamesContext from "../playersNamesContext";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import Config from "../config";

const Maps = require("../MapData/maps.json");
const MapsKeys = Object.keys(Maps);

const CELL_RADIUS = 40;

const styles = (theme) => ({
  players_container: {
    textAlign: "left",
    width: "100%",
    maxWidth: "800px",
  },
  message_container_sticky: {
    position: "sticky",
    top: "64px",
  },
  message_container: {
    textAlign: "center",
    height: "65px",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  controls_container_sticky: {
    position: "sticky",
    top: "129px",
  },
  controls_container: {
    paddingBottom: "24px",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  board_container: {
    zIndex: "-1",
    padding: "0px 20px",
  },
  select_map_container: {
    textAlign: "center",
    maxWidth: "400px",
    margin: "0 auto",
  },
  map_title: {
    height: "105px",
  },
  select_map_button: {
    minWidth: "160px",
    margin: "8px",
  },
});

class FlammeRougeUI extends Component {
  state = {
    isLoadingNames: false,
    message: null,
    animationRunning: false,
    playersNames: {},
  };

  handleStartingBlockSpotsChanged = (event) => {
    this.props.moves.setStartingBlockSpots(event.target.value);
  };

  handleRunnersPerPlayerChanged = (event) => {
    this.props.moves.setNumberOfRunnersPerPlayer(event.target.value);
  };

  handlePreviousMap = () => {
    this.props.moves.previousMap();
  };

  handleNextMap = () => {
    this.props.moves.nextMap();
  };

  handleSelectMap = () => {
    this.props.moves.selectMap();
  };

  handlePlaceRunner = (type) => {
    this.props.moves.placeRunner(type);
  };

  handleSelectRunner = (id) => {
    this.props.moves.selectRunner(id);
  };

  handlePickCard = (id) => {
    this.props.moves.pickCard(id);
  };

  handleSelectShootingRunner = (id) => {
    this.props.moves.selectShootingRunner(id);
  };

  handleSelectShootingVelocity = (velocity) => {
    this.props.moves.shoot(velocity);
  };

  handleDisplayMessage = (msg) => {
    this.setState({ message: msg });
  };

  handleAnimationStarted = () => {
    this.setState({ animationRunning: true });
  };

  handleAnimationEnded = () => {
    this.setState({ animationRunning: false });
  };

  transformGameMetadata = (gameMetadata) => {
    const _playersName = {};
    for (let i = 0; i < gameMetadata.length; i++) {
      const player = gameMetadata[i];
      _playersName[player.id] = player.name;
    }
    return _playersName;
  };

  render() {
    const {
      G: {
        board,
        players,
        selectedMap,
        startingBlockSpots,
        mapString,
        numOfRunnersPerPlayer,
      },
      ctx: { gameover, phase, currentPlayer },
      isActive,
      playerID,
      classes,
      gameMetadata,
    } = this.props;
    const { isLoadingNames, message, animationRunning } = this.state;

    if (isLoadingNames) {
      return <LinearProgress color="primary" />;
    }

    const playersNames = this.transformGameMetadata(gameMetadata);

    const readOnly = !isActive;

    const _players = getPlayersFromGPlayers(players);

    const player = _players[playerID];
    const _board = new Board(board);

    const selectedRunner =
      player.selectedRunner !== null
        ? player.runners.find((runner) => runner.id === player.selectedRunner)
        : null;
    const spotType = _board.getSpotTypeForRunner(
      playerID,
      player.selectedRunner
    );

    const hand = selectedRunner ? selectedRunner.deck.hand : [];
    const heartBeatVariation = selectedRunner
      ? selectedRunner.deck.getHeartBeatVariationForHand(spotType)
      : [];
    const remainingCards = selectedRunner
      ? selectedRunner.deck.getRemainingCards()
      : {};
    const heartBeats = player.getHeartBeats();

    let Controls = null;
    let tips = null;

    let controlsShouldBeSticky = true;

    if (phase === "SelectMap" || phase === "ManualMap") {
      const isSelectMap = phase === "SelectMap";
      tips = intl.get("flamme_rouge.tips_select_map");
      const buttons = [
        {
          text: intl.get("flamme_rouge.select"),
          handleClick: this.handleSelectMap,
        },
      ];
      const availableSpotList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const availableRunnersPerPlayerList = Array(MAX_NUMBER_OF_RUNNERS);
      for (let i = 0; i < availableRunnersPerPlayerList.length; i++) {
        availableRunnersPerPlayerList[i] = i + 1;
      }
      // const startingBlockSpots = 3;
      const label_existing_map = intl.get("flamme_rouge.existing_map");
      const label_manual_map = intl.get("flamme_rouge.manual_map");
      const label_map = intl.get("flamme_rouge.map");

      const label_starting_block_spots = intl.get(
        "flamme_rouge.starting_block_spots"
      );
      const label_runners_per_player = intl.get(
        "flamme_rouge.runners_per_player"
      );
      const boardDifficulty = _board.getDifficulty();
      const label_difficulty = `${boardDifficulty * 100}m - ${
        5 * NUMBER_OF_CARDS(boardDifficulty)
      } ${intl.get("flamme_rouge.cards")}`;
      Controls = (
        <Item className={classes.select_map_container}>
          <ButtonGroup
            variant="contained"
            aria-label="contained primary button group"
          >
            <Button
              color={isSelectMap && "primary"}
              onClick={() => this.props.moves.enterSelectMapMode()}
            >
              {label_existing_map}
            </Button>
            <Button
              color={!isSelectMap && "primary"}
              onClick={() => this.props.moves.enterManualMapMode()}
            >
              {label_manual_map}
            </Button>
          </ButtonGroup>
          {isSelectMap && (
            <Grid
              container
              spacing={1}
              alignItems="center"
              className={classes.map_title}
            >
              <Grid item xs={2}>
                <NavigateBeforeIcon onClick={() => this.handlePreviousMap()} />
              </Grid>
              <Grid item xs={8}>
                <h2>{`${prettify(
                  MapsKeys[selectedMap]
                )} (${label_difficulty})`}</h2>
              </Grid>
              <Grid item xs={2}>
                <NavigateNextIcon onClick={() => this.handleNextMap()} />
              </Grid>
            </Grid>
          )}
          {!isSelectMap && (
            <Grid
              container
              spacing={1}
              alignItems="center"
              justify="center"
              className={classes.map_title}
            >
              <Grid item>
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField
                    id="standard-basic"
                    label={`${label_map} (${label_difficulty})`}
                    multiline
                    rowsMax={4}
                    value={mapString}
                    onChange={(event) =>
                      this.props.moves.setMapString(event.target.value)
                    }
                  />
                </form>
              </Grid>
            </Grid>
          )}
          <SelectMapUI
            // choice={3}
            choice={startingBlockSpots}
            choices={availableSpotList}
            label={label_starting_block_spots}
            selectorID={"starting_block_spots"}
            handleChoiceChanged={this.handleStartingBlockSpotsChanged}
          />
          <SelectMapUI
            // choice={3}
            choice={numOfRunnersPerPlayer}
            choices={availableRunnersPerPlayerList}
            label={label_runners_per_player}
            selectorID={"runners_per_player"}
            handleChoiceChanged={this.handleRunnersPerPlayerChanged}
          />

          <ButtonUI buttons={buttons} />
        </Item>
      );
    } else if (phase === "PlaceRunner") {
      controlsShouldBeSticky = false;
      if (currentPlayer === playerID) {
        tips = intl.get("flamme_rouge.tips_place_runner");
      } else {
        tips = intl.get("flamme_rouge.waiting_for", {
          name: playersNames[currentPlayer],
        });
      }
      const runners = [];
      Player.RunnerTypes.forEach((type) =>
        runners.push({
          name: intl.get("flamme_rouge." + type.toString().toLowerCase()),
          info: intl.get("flamme_rouge.info_" + type.toString().toLowerCase()),
          handleClick: () => {
            this.handlePlaceRunner(type);
          },
        })
      );
      Controls = (
        <PlaceRunnerUI active={currentPlayer === playerID} runners={runners} />
      );
      // if (currentPlayer === playerID) {

      // }
    } else if (phase === "Shoot") {
      const playersWhoShouldShoot = getPlayersWhoShouldShoot(_board, _players);
      const runners = playersWhoShouldShoot[playerID].runners;

      if (runners.length > 0) {
        if (selectedRunner !== null) {
          tips = intl.get("flamme_rouge.tips_shooting_select_velocity");
        } else {
          tips = intl.get("flamme_rouge.tips_shooting_select_type");
        }
      } else {
        const keys = Object.keys(playersWhoShouldShoot);
        const playersAwaited = keys
          .filter((id) => playersWhoShouldShoot[id].runners.length > 0)
          .map((id) => playersNames[id]);

        tips = intl.get("flamme_rouge.waiting_for_players", {
          players: playersAwaited.join(", "),
        });
      }
      const buttons = [];
      if (selectedRunner === null) {
        runners.forEach((runner) =>
          buttons.push({
            text: intl.get(
              "flamme_rouge." + runner.type.toString().toLowerCase()
            ),
            handleClick: () => {
              this.handleSelectShootingRunner(runner.id);
            },
          })
        );
      } else {
        const velocities = [-1, 0, 1];
        velocities.forEach((velocity) => {
          let text = "";
          let penalty = Deck.getShootingVelocityPenalty(velocity);
          if (penalty > 0) {
            penalty = "+" + penalty;
          }
          const probability = selectedRunner.deck.getShootLevel(velocity) + "%";
          switch (velocity) {
            case -1:
              text = intl.get("flamme_rouge.shooting_slowly_choice", {
                penalty: penalty,
                probability: probability,
              });
              break;
            case 0:
              text = intl.get("flamme_rouge.shooting_normally_choice", {
                probability: probability,
              });
              break;
            case 1:
              text = intl.get("flamme_rouge.shooting_quickly_choice", {
                penalty: penalty,
                probability: probability,
              });
              break;
            default:
              break;
          }
          buttons.push({
            text: text,
            handleClick: () => {
              this.handleSelectShootingVelocity(velocity);
            },
          });
        });
      }

      Controls = <ButtonUI buttons={buttons} />;
    } else {
      const playersWhoShouldPickCard = getPlayersWhoShouldPickCard(
        _board,
        _players
      );
      const runners = playersWhoShouldPickCard[playerID].runners;

      if (runners.length > 0) {
        if (selectedRunner !== null) {
          tips = intl.get("flamme_rouge.tips_select_card");
        } else {
          tips = intl.get("flamme_rouge.tips_select_type");
        }
      } else {
        const keys = Object.keys(playersWhoShouldPickCard);
        const playersAwaited = keys
          .filter((id) => playersWhoShouldPickCard[id].runners.length > 0)
          .map((id) => playersNames[id]);

        tips = intl.get("flamme_rouge.waiting_for_players", {
          players: playersAwaited.join(", "),
        });
      }
      const buttons = [];
      runners.forEach((runner) =>
        buttons.push({
          text: intl.get(
            "flamme_rouge." + runner.type.toString().toLowerCase()
          ),
          handleClick: () => {
            this.handleSelectRunner(runner.id);
          },
        })
      );
      Controls =
        selectedRunner !== null ? (
          <Item>
            <HandUI
              handleClick={this.handlePickCard}
              cards={hand}
              heartBeatVariation={heartBeatVariation}
            />
            <CardsRemainingUI cards={remainingCards} />
          </Item>
        ) : (
          <ButtonUI buttons={buttons} />
        );
    }

    let opponents = "";
    const playersNamesKeys = Object.keys(playersNames);
    for (let i = 0; i < playersNamesKeys.length; i++) {
      if (i.toString() !== playerID) {
        const playerName = playersNames[i];
        opponents += playerName + "(#" + i.toString() + "), ";
      }
    }
    if (opponents.length > 2) {
      opponents = opponents.slice(0, -2);
    }

    return (
      <PlayersNamesContext.Provider value={playersNames}>
        <Container column>
          <Item center className={classes.players_container}>
            <h3>
              {intl.get("online.youare", {
                id: playerID,
                opponents: opponents,
              })}
            </h3>
          </Item>
          <Item
            center
            className={`${classes.message_container} ${
              controlsShouldBeSticky && classes.message_container_sticky
            }`}
          >
            <h2>{message === null ? tips : message}</h2>
          </Item>
          <Item
            center
            className={`${classes.controls_container} ${
              controlsShouldBeSticky && classes.controls_container_sticky
            }`}
          >
            {animationRunning && phase !== "PlaceRunner" ? null : Controls}
          </Item>
          <Item center className={classes.board_container}>
            <BoardUI
              playersNames={playersNames}
              playerID={playerID}
              selectedRunner={player.selectedRunner}
              heartBeats={heartBeats}
              displayMessage={this.handleDisplayMessage}
              animationStarted={this.handleAnimationStarted}
              animationEnded={this.handleAnimationEnded}
              disabled={readOnly}
              cellRadius={CELL_RADIUS}
              board={board}
            />
          </Item>
          {/* Win or Draw  modal */}
          <Congratulations
            playerID={playerID}
            winner={board.winner}
            gameover={gameover}
          />
        </Container>
      </PlayersNamesContext.Provider>
    );
  }
}

FlammeRougeUI.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FlammeRougeUI);

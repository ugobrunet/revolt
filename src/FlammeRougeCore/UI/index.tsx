import React, { useState } from "react";
import intl from "react-intl-universal";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Ctx } from "boardgame.io";

import BoardUI from "./BoardUI";
import HandUI from "./HandUI";
import CardsRemainingUI from "./CardsRemainingUI";
import ButtonUI from "./ButtonUI";
import SelectMapUI from "./SelectMapUI";
import PlaceRunnerUI from "./PlaceRunnerUI";
import Congratulations from "./Congratulations";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";

import { Item, Container } from "./elements";
import { Board, PlayerDictionnary } from "../Board";
import {
  getPlayersWhoShouldPickCard,
  getPlayersWhoShouldShoot,
  getPlayersFromGPlayers,
} from "../BoardUtilities";

import { Player, Deck } from "../Deck";
import { MAX_NUMBER_OF_RUNNERS, NUMBER_OF_CARDS } from "../Settings";

import { prettify } from "../Utils";
import Maps from "../MapData/maps";
const MapsKeys = Object.keys(Maps);

export type ButtonContent = { text: string; handleClick: () => void };
export type RunnerContent = {
  name: string;
  info: string;
  handleClick: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      zIndex: -1,
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
  })
);

const FlammeRougeUI = ({
  G,
  ctx,
  isActive,
  playerID,
  gameMetadata,
  moves,
}: {
  G: any;
  ctx: Ctx;
  isActive: boolean;
  playerID: number;
  gameMetadata: any;
  moves: any;
}) => {
  const classes = useStyles();
  const {
    board,
    players,
    selectedMap,
    startingBlockSpots,
    mapString,
    numOfRunnersPerPlayer,
  } = G;
  const { gameover, phase, currentPlayer } = ctx;

  const _currentPlayer: number = +currentPlayer;

  const _playerID: number = +playerID;

  const [message, setMessage] = useState<string | null>(null);
  const [animationRunning, setAnimationRunning] = useState(false);

  const [boardActionIndex, setBoardActionIndex] = useState(0);

  const handleStartingBlockSpotsChanged = (
    value: number,
    setStartingBlockSpots: (value: number) => void
  ): void => {
    setStartingBlockSpots(value);
  };

  const handleRunnersPerPlayerChanged = (
    value: number,
    setNumberOfRunnersPerPlayer: (value: number) => void
  ): void => {
    setNumberOfRunnersPerPlayer(value);
  };

  const handlePreviousMap = (previousMap: () => void): void => {
    previousMap();
  };

  const handleNextMap = (nextMap: () => void): void => {
    nextMap();
  };

  const handleSelectMap = (selectMap: () => void): void => {
    selectMap();
  };

  const handlePlaceRunner = (
    type: string,
    placeRunner: (type: string) => void
  ): void => {
    placeRunner(type);
  };

  const handleSelectRunner = (
    id: number,
    selectRunner: (id: number) => void
  ): void => {
    selectRunner(id);
  };

  const handlePickCard = (id: number, pickCard: (id: number) => void): void => {
    pickCard(id);
  };

  const handleSelectShootingRunner = (
    id: number,
    selectShootingRunner: (id: number) => void
  ): void => {
    selectShootingRunner(id);
  };

  const handleSelectShootingVelocity = (
    velocity: number,
    shoot: (velocity: number) => void
  ): void => {
    shoot(velocity);
  };

  const handleDisplayMessage = (message: string | null): void => {
    setMessage(message);
  };

  const handleAnimationStarted = (): void => {
    setAnimationRunning(true);
  };

  const handleAnimationEnded = (): void => {
    setAnimationRunning(false);
  };

  const boardActionIndexChanged = (index: number): void => {
    setBoardActionIndex(index);
  };

  const transformGameMetadata = (
    gameMetadata: any
  ): PlayerDictionnary<string> => {
    const _playersName: PlayerDictionnary<string> = {};
    for (let i = 0; i < gameMetadata.length; i++) {
      const player = gameMetadata[i];
      _playersName[player.id] = player.name;
    }
    return _playersName;
  };

  const playersNames = transformGameMetadata(gameMetadata);

  const _players = getPlayersFromGPlayers(players);

  const player = _players[_playerID];
  const _board = new Board(board);

  const selectedRunner =
    player.selectedRunner !== null
      ? player.runners.find((runner) => runner.id === player.selectedRunner)
      : null;
  const spotType = _board.getSpotTypeForRunner(
    _playerID,
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
        handleClick: () => handleSelectMap(moves.selectMap),
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
            color={isSelectMap ? "primary" : undefined}
            onClick={() => moves.enterSelectMapMode()}
          >
            {label_existing_map}
          </Button>
          <Button
            color={!isSelectMap ? "primary" : undefined}
            onClick={() => moves.enterManualMapMode()}
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
              <NavigateBeforeIcon
                onClick={() => handlePreviousMap(moves.previousMap)}
              />
            </Grid>
            <Grid item xs={8}>
              <h2>{`${prettify(
                MapsKeys[selectedMap]
              )} (${label_difficulty})`}</h2>
            </Grid>
            <Grid item xs={2}>
              <NavigateNextIcon onClick={() => handleNextMap(moves.nextMap)} />
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
              <form noValidate autoComplete="off">
                <TextField
                  id="standard-basic"
                  label={`${label_map} (${label_difficulty})`}
                  multiline
                  rowsMax={4}
                  value={mapString}
                  onChange={(event) => moves.setMapString(event.target.value)}
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
          handleChoiceChanged={(value: number) =>
            handleStartingBlockSpotsChanged(value, moves.setStartingBlockSpots)
          }
        />
        <SelectMapUI
          // choice={3}
          choice={numOfRunnersPerPlayer}
          choices={availableRunnersPerPlayerList}
          label={label_runners_per_player}
          selectorID={"runners_per_player"}
          handleChoiceChanged={(value: number) =>
            handleRunnersPerPlayerChanged(
              value,
              moves.setNumberOfRunnersPerPlayer
            )
          }
        />

        <ButtonUI buttons={buttons} />
      </Item>
    );
  } else if (phase === "PlaceRunner") {
    controlsShouldBeSticky = false;
    if (+_currentPlayer === _playerID) {
      tips = intl.get("flamme_rouge.tips_place_runner");
    } else {
      tips = intl.get("flamme_rouge.waiting_for", {
        name: playersNames[+_currentPlayer],
      });
    }
    const runners: RunnerContent[] = [];
    Player.RunnerTypes.forEach((type) =>
      runners.push({
        name: intl.get("flamme_rouge." + type.toString().toLowerCase()),
        info: intl.get("flamme_rouge.info_" + type.toString().toLowerCase()),
        handleClick: () => {
          handlePlaceRunner(type, moves.placeRunner);
        },
      })
    );
    Controls = (
      <PlaceRunnerUI active={+_currentPlayer === _playerID} runners={runners} />
    );
    // if (currentPlayer === playerID) {

    // }
  } else if (phase === "Shoot") {
    const playersWhoShouldShoot = getPlayersWhoShouldShoot(_board, _players);
    const runners = playersWhoShouldShoot[_playerID].runners;

    if (runners.length > 0) {
      if (selectedRunner !== null) {
        tips = intl.get("flamme_rouge.tips_shooting_select_velocity");
      } else {
        tips = intl.get("flamme_rouge.tips_shooting_select_type");
      }
    } else {
      const keys = Object.keys(playersWhoShouldShoot);
      const playersAwaited = keys
        .filter((id) => playersWhoShouldShoot[+id].runners.length > 0)
        .map((id) => playersNames[+id]);

      tips =
        playersAwaited.length === 0
          ? null
          : intl.get("flamme_rouge.waiting_for_players", {
              players: playersAwaited.join(", "),
            });
    }
    const buttons: ButtonContent[] = [];
    if (selectedRunner === null) {
      runners.forEach((runner) =>
        buttons.push({
          text: intl.get(
            "flamme_rouge." + runner.type.toString().toLowerCase()
          ),
          handleClick: () => {
            handleSelectShootingRunner(runner.id, moves.selectShootingRunner);
          },
        })
      );
    } else {
      if (selectedRunner !== undefined) {
        const velocities = [-1, 0, 1];
        velocities.forEach((velocity) => {
          const shootingVelocityPenalty = Deck.getShootingVelocityPenalty(
            velocity
          );

          const penalty: string =
            shootingVelocityPenalty > 0
              ? "+" + shootingVelocityPenalty.toString()
              : shootingVelocityPenalty.toString();
          const probability = selectedRunner.deck.getShootLevel(velocity) + "%";

          let text = "";
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
            handleClick: () =>
              handleSelectShootingVelocity(velocity, moves.shoot),
          });
        });
      }
    }

    Controls = <ButtonUI buttons={buttons} />;
  } else {
    const playersWhoShouldPickCard = getPlayersWhoShouldPickCard(
      _board,
      _players
    );
    const runners = playersWhoShouldPickCard[_playerID].runners;

    if (runners.length > 0) {
      if (selectedRunner !== null) {
        tips = intl.get("flamme_rouge.tips_select_card");
      } else {
        tips = intl.get("flamme_rouge.tips_select_type");
      }
    } else {
      const keys = Object.keys(playersWhoShouldPickCard);
      const playersAwaited = keys
        .filter((id) => playersWhoShouldPickCard[+id].runners.length > 0)
        .map((id) => playersNames[+id]);

      tips =
        playersAwaited.length === 0
          ? null
          : intl.get("flamme_rouge.waiting_for_players", {
              players: playersAwaited.join(", "),
            });
    }
    const buttons: ButtonContent[] = [];
    runners.forEach((runner) =>
      buttons.push({
        text: intl.get("flamme_rouge." + runner.type.toString().toLowerCase()),
        handleClick: () => {
          handleSelectRunner(runner.id, moves.selectRunner);
        },
      })
    );
    Controls =
      selectedRunner !== null ? (
        <Item>
          <HandUI
            handleClick={(index: number) =>
              handlePickCard(index, moves.pickCard)
            }
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
  playersNamesKeys.forEach((i) => {
    if (+i !== _playerID) {
      const playerName = playersNames[+i];
      opponents += playerName + "(#" + i + "), ";
    }
  });
  if (opponents.length > 2) {
    opponents = opponents.slice(0, -2);
  }

  if (boardActionIndex === _board.actions.length) {
    console.log("Equal:", _board.actions.length, boardActionIndex);
  } else {
    console.log("Not Equal:", _board.actions.length, boardActionIndex);
  }
  return (
    <Container column>
      <Item center className={classes.players_container}>
        <h3>
          {intl.get("online.youare", {
            id: _playerID,
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
        <h2>
          {message === null && boardActionIndex === _board.actions.length
            ? tips
            : message}
        </h2>
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
          playerID={_playerID}
          selectedRunner={player.selectedRunner}
          heartBeats={heartBeats}
          displayMessage={handleDisplayMessage}
          animationStarted={handleAnimationStarted}
          animationEnded={handleAnimationEnded}
          board={_board}
          actionIndexChanged={boardActionIndexChanged}
        />
      </Item>
      {/* Win or Draw  modal */}
      <Congratulations
        playerID={_playerID}
        winner={_board.winner || []}
        gameover={gameover}
        playersNames={playersNames}
      />
    </Container>
  );
};

export default FlammeRougeUI;

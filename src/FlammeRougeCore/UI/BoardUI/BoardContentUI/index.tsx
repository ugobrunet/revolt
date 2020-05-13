import React from "react";
import { Board, MapStep, MapSpot, Move } from "../../../Board";
import { HeartBeat } from "../../../Deck";
import intl from "react-intl-universal";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import FavoriteIcon from "@material-ui/icons/Favorite";
import _ from "lodash";
import TargetIcon from "./target";

const BORDER_WIDTH = 5;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      padding: "20px 0px",
    },
    default: {
      border: `${BORDER_WIDTH}px solid lightgray`,
    },
    start: {
      border: `${BORDER_WIDTH}px dashed GreenYellow`,
    },
    end: {
      border: `${BORDER_WIDTH}px solid lightgray`,
      backgroundColor: "white",
      backgroundImage:
        "linear-gradient(45deg, lightgray 25%, transparent 25%, transparent 75%, lightgray 75%), linear-gradient(45deg, lightgray 25%, transparent 25%, transparent 75%, lightgray 75%)",
      backgroundPosition: "0 0, 5px 5px",
      backgroundSize: "10px 10px",
    },
    up: {
      border: `${BORDER_WIDTH}px solid red`,
    },
    down: {
      border: `${BORDER_WIDTH}px solid cyan`,
    },
    shoot: {
      border: `${BORDER_WIDTH}px solid gray`,
    },
    lap: {
      border: `${BORDER_WIDTH}px solid LemonChiffon`,
    },
    paper_current: {
      fontWeight: "bold",
      color: "black !important",
    },
    paper: {
      textAlign: "center",
      color: theme.palette.text.secondary,
      height: "40px",
      width: "40px",
      lineHeight: "30px",
      padding: "0px",
      fontSize: "18px",
      position: "relative",
      // fontWeight: "bold"
    },
    paper_selected: {
      backgroundColor: "yellow",
    },
    icon: {
      color: "red",
      height: "30px",
    },
    heartBeat_icon: {
      height: "30px",
      width: "30px",
      position: "absolute",
      top: "-15px",
      right: "-15px",
    },
    heartBeat_text: {
      position: "absolute",
      top: "-17px",
      right: "-15px",
      fontSize: "12px",
      textAlign: "center",
      width: "30px",
      height: "30px",
      color: "white",
    },
    target_icon: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "30px",
      height: "30px",
    },
  })
);

const HEARTBEAT_COLORS = [
  "#2E7F18",
  "#45731E",
  "#675E24",
  "#8D472B",
  "#B13433",
  "#C82538",
];

const renderSpot = (
  spot: MapSpot,
  type: string | null,
  key: number,
  playerID: number,
  animating: boolean,
  heartBeats: (HeartBeat | null)[],
  selectedRunner: number | null,
  fatigues: Move[],
  classes: any
) => {
  const _symbol = spot.content
    ? intl
        .get("flamme_rouge." + spot.content.type.toString().toLowerCase())
        .substr(0, 2) + spot.content.playerID
    : null;

  let hasFatigue = false;
  if (spot.content) {
    hasFatigue = fatigues.some(
      (move: Move) =>
        spot.content !== null &&
        move.player.playerID === spot.content.playerID &&
        move.player.runnerID === spot.content.runnerID
    );
  }

  const typeClass = type === null ? classes.default : classes[type];
  const currentClass =
    spot.content && spot.content.playerID === playerID
      ? classes.paper_current
      : "";
  const content = hasFatigue ? (
    <ErrorOutlineIcon className={classes.icon} />
  ) : (
    _symbol
  );

  const target_icon =
    type === "shoot" ? (
      <TargetIcon class={classes.target_icon} fill={"gray"} />
    ) : null;

  let heartBeat_icon_color = "red";
  let heartBeat_icon = null;
  if (
    !animating &&
    spot.content !== null &&
    spot.content.playerID === playerID
  ) {
    const heartbeat = heartBeats[spot.content.runnerID];
    if (heartbeat !== null) {
      let hb_coor_index = Math.round(
        ((HEARTBEAT_COLORS.length - 1) * heartbeat.ratio) / 100
      );
      heartBeat_icon_color = HEARTBEAT_COLORS[hb_coor_index];
      heartBeat_icon = (
        <div>
          <FavoriteIcon
            className={classes.heartBeat_icon}
            style={{ color: heartBeat_icon_color }}
          />
          <span className={classes.heartBeat_text}>{heartbeat.value}</span>
        </div>
      );
    }
  }

  let selectedRunnerClass =
    selectedRunner !== null &&
    spot.content &&
    spot.content.playerID === playerID &&
    spot.content.runnerID === selectedRunner
      ? classes.paper_selected
      : null;

  return (
    <Grid key={key} item>
      <Paper
        className={`${classes.paper} ${typeClass} ${currentClass} ${selectedRunnerClass}`}
      >
        {target_icon}
        {content}
        {heartBeat_icon}
      </Paper>
    </Grid>
  );
};

const renderStep = (
  step: MapStep,
  key: number,
  playerID: number,
  animating: boolean,
  heartBeats: (HeartBeat | null)[],
  selectedRunner: number | null,
  fatigues: Move[],
  classes: any
) => {
  return (
    <Grid key={key} item>
      <Grid
        container
        className={classes.container}
        direction="column"
        spacing={1}
      >
        {step.spots
          .reverse()
          .map((spot, i) =>
            renderSpot(
              spot,
              step.type,
              i,
              playerID,
              animating,
              heartBeats,
              selectedRunner,
              fatigues,
              classes
            )
          )}
      </Grid>
    </Grid>
  );
};

const BoardContentUI = ({
  actionIndex,
  animating,
  board,
  fatigues,
  heartBeats,
  playerID,
  selectedRunner,
}: {
  actionIndex: number;
  animating: boolean;
  board: Board;
  fatigues: Move[];
  heartBeats: (HeartBeat | null)[];
  playerID: number;
  selectedRunner: number | null;
}) => {
  const classes = useStyles();

  return (
    <Grid container direction="row" alignItems="center" spacing={1}>
      {board
        .renderWithoutUnusedLaps(actionIndex)
        .map((e, i) =>
          renderStep(
            e,
            i,
            playerID,
            animating,
            heartBeats,
            selectedRunner,
            fatigues,
            classes
          )
        )}
    </Grid>
  );
};

export default BoardContentUI;

import React, { Component } from "react";
import { Board } from "../../Board";
import intl from "react-intl-universal";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import FavoriteIcon from "@material-ui/icons/Favorite";
import _ from "lodash";
import TargetIcon from "./target.js";
import { yellow } from "@material-ui/core/colors";
import ShotsUI from "../ShotsUI";

const BORDER_WIDTH = 5;
const emptyFunction = () => {};

const styles = (theme) => ({
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
});

const HEARTBEAT_COLORS = [
  "#2E7F18",
  "#45731E",
  "#675E24",
  "#8D472B",
  "#B13433",
  "#C82538",
];

class BoardUI extends Component {
  state = {
    board: new Board(),
    fatigue: [],
    actionIndex: 0,
    shots: null,
    shootVelocity: 0,
    shootingTitle: null,
    animating: false,
  };

  timer = null;

  componentDidMount() {
    const { board } = this.props;
    const _board = new Board(board);
    this.setState({ board: _board });
    this.setState({ actionIndex: _board.moves.length });
  }

  componentDidUpdate = (prevProps) => {
    const { board } = this.props;
    if (!_.isEqual(board, prevProps.board)) {
      this.setState({ board: new Board(board) }, this.handleNewAction);
    }
  };

  setAnimationStatus = (running) => {
    let { animationStarted, animationEnded } = this.props;
    animationStarted = animationStarted || emptyFunction;
    animationEnded = animationEnded || emptyFunction;

    this.setState({ animating: running });

    if (running) {
      animationStarted();
    } else {
      animationEnded();
    }
  };

  handleAction = (action) => {
    let { displayMessage, playersNames } = this.props;
    displayMessage = displayMessage || emptyFunction;
    if (!action) {
      displayMessage(null);
      this.setState({ fatigue: [] });
    } else {
      const firstMove = action.moves[0];
      const firstPlayer = firstMove.player;
      const name = playersNames[firstPlayer.playerID];
      const type = intl.get(
        "flamme_rouge." + firstPlayer.type.toString().toLowerCase()
      );
      let message;

      switch (action.name) {
        case "initial":
          message = intl.get("flamme_rouge.doing_initial_position", {
            name: name,
            type: type,
          });
          displayMessage(message);
          break;
        case "played":
          message = intl.get("flamme_rouge.doing_played_card", {
            name: name,
            type: type,
            card: firstMove.metadata.pickedCard,
            distance: firstMove.distance,
          });
          displayMessage(message);
          break;
        case "shooting":
          let shootVelocity = "";
          switch (firstMove.metadata.shootVelocity) {
            case -1:
              shootVelocity = intl.get("flamme_rouge.shooting_slowly");
              break;
            case 0:
              shootVelocity = intl.get("flamme_rouge.shooting_normally");
              break;
            case 1:
              shootVelocity = intl.get("flamme_rouge.shooting_quickly");
              break;
            default:
              break;
          }
          const shootingTitle = intl.get("flamme_rouge.shooting", {
            name: name,
            type: type,
            style: shootVelocity,
          });
          this.setState({
            shots: firstMove.metadata.shots,
            shootVelocity: firstMove.metadata.shootVelocity,
            shootingTitle: shootingTitle,
          });
          break;
        case "shot":
          const shotsRatio =
            firstMove.metadata.shots.reduce(
              (a, c) => a + (c.success ? 1 : 0),
              0
            ) +
            "/" +
            firstMove.metadata.shots.length;
          message = intl.get("flamme_rouge.did_shot", {
            name: name,
            type: type,
            shots: shotsRatio,
          });
          displayMessage(message);
          break;
        case "enterShootingRange":
          message = intl.get("flamme_rouge.enter_shooting_range");
          displayMessage(message);
          break;
        case "finished":
          message = intl.get("flamme_rouge.finished", {
            name: name,
            type: type,
          });
          displayMessage(message);
          break;
        case "suction":
          displayMessage(intl.get("flamme_rouge.doing_suction"));
          break;
        case "fatigue":
          displayMessage(intl.get("flamme_rouge.doing_fatigue"));
          this.setState({ fatigue: action.moves });
          break;
        default:
          break;
      }
    }
  };

  handleNewAction() {
    const { board, actionIndex, shots } = this.state;

    if (actionIndex === board.moves.length) {
      setTimeout(() => {
        this.setAnimationStatus(false);
        this.handleAction(null);
      }, 2000);
    } else {
      if (this.timer === null) {
        this.timer = setTimeout(() => {
          this.timer = null;
          this.handleNewAction();
        }, 1000);
        if (shots === null) {
          this.setAnimationStatus(true);
          const _actionIndex = Math.min(actionIndex + 1, board.moves.length);
          const action = board.moves[_actionIndex - 1];
          this.setState({ actionIndex: _actionIndex });
          this.handleAction(action);
        }
      }
    }
  }

  handleShotDone = () => {
    this.setState({ shots: null });
  };

  renderSpot = (
    spot,
    key,
    playerID,
    animating,
    heartBeats,
    selectedRunner,
    classes
  ) => {
    const { fatigue } = this.state;

    const _symbol = spot.content
      ? intl
          .get("flamme_rouge." + spot.content.type.toString().toLowerCase())
          .substr(0, 2) + spot.content.playerID
      : null;

    let hasFatigue = false;
    if (spot.content) {
      hasFatigue = fatigue.some(
        (move) =>
          move.player.playerID === spot.content.playerID &&
          move.player.runnerID === spot.content.runnerID
      );
    }

    const typeClass = spot.type === null ? classes.default : classes[spot.type];
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
      spot.type === "shoot" ? (
        <TargetIcon class={classes.target_icon} fill={"gray"} />
      ) : null;

    let heartBeat_icon_color = "red";
    let heartBeat_icon = null;
    if (
      !animating &&
      spot.content &&
      spot.content.playerID === playerID &&
      heartBeats[spot.content.runnerID]
    ) {
      let hb_coor_index = Math.round(
        ((HEARTBEAT_COLORS.length - 1) *
          heartBeats[spot.content.runnerID].ratio) /
          100
      );
      heartBeat_icon_color = HEARTBEAT_COLORS[hb_coor_index];
      heartBeat_icon = (
        <div>
          <FavoriteIcon
            className={classes.heartBeat_icon}
            style={{ color: heartBeat_icon_color }}
          />
          <span className={classes.heartBeat_text}>
            {heartBeats[spot.content.runnerID].value}
          </span>
        </div>
      );
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

  renderStep = (
    step,
    key,
    playerID,
    animating,
    heartBeats,
    selectedRunner,
    classes
  ) => {
    return (
      <Grid key={key} item>
        <Grid
          container
          className={classes.container}
          direction="column"
          spacing={1}
        >
          {step
            .reverse()
            .map((e, i) =>
              this.renderSpot(
                e,
                i,
                playerID,
                animating,
                heartBeats,
                selectedRunner,
                classes
              )
            )}
        </Grid>
      </Grid>
    );
  };

  render() {
    const {
      board,
      actionIndex,
      shots,
      shootVelocity,
      shootingTitle,
      animating,
    } = this.state;
    const { classes, playerID, heartBeats, selectedRunner } = this.props;

    return (
      <div>
        <Grid container direction="row" alignItems="center" spacing={1}>
          {board
            .renderWithoutUnusedLaps(actionIndex)
            .map((e, i) =>
              this.renderStep(
                e,
                i,
                playerID,
                animating,
                heartBeats,
                selectedRunner,
                classes
              )
            )}
        </Grid>
        {shots && (
          <ShotsUI
            title={shootingTitle}
            openning={true}
            shots={shots}
            velocity={shootVelocity}
            onClose={this.handleShotDone}
          />
        )}
      </div>
    );
  }
}

BoardUI.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BoardUI);

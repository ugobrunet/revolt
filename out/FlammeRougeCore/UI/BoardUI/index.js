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
import ShotsUI from "../ShotsUI";
var BORDER_WIDTH = 5;
var emptyFunction = function () { };
var styles = function (theme) { return ({
    root: {
        flexGrow: 1,
    },
    container: {
        padding: "20px 0px",
    },
    default: {
        border: BORDER_WIDTH + "px solid lightgray",
    },
    start: {
        border: BORDER_WIDTH + "px dashed GreenYellow",
    },
    end: {
        border: BORDER_WIDTH + "px solid lightgray",
        backgroundColor: "white",
        backgroundImage: "linear-gradient(45deg, lightgray 25%, transparent 25%, transparent 75%, lightgray 75%), linear-gradient(45deg, lightgray 25%, transparent 25%, transparent 75%, lightgray 75%)",
        backgroundPosition: "0 0, 5px 5px",
        backgroundSize: "10px 10px",
    },
    up: {
        border: BORDER_WIDTH + "px solid red",
    },
    down: {
        border: BORDER_WIDTH + "px solid cyan",
    },
    shoot: {
        border: BORDER_WIDTH + "px solid gray",
    },
    lap: {
        border: BORDER_WIDTH + "px solid LemonChiffon",
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
}); };
var HEARTBEAT_COLORS = [
    "#2E7F18",
    "#45731E",
    "#675E24",
    "#8D472B",
    "#B13433",
    "#C82538",
];
var BoardUI = /** @class */ (function (_super) {
    __extends(BoardUI, _super);
    function BoardUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            board: new Board(),
            fatigue: [],
            actionIndex: 0,
            shots: null,
            shootVelocity: 0,
            shootingTitle: null,
            animating: false,
        };
        _this.timer = null;
        _this.componentDidUpdate = function (prevProps) {
            var board = _this.props.board;
            if (!_.isEqual(board, prevProps.board)) {
                _this.setState({ board: new Board(board) }, _this.handleNewAction);
            }
        };
        _this.setAnimationStatus = function (running) {
            var _a = _this.props, animationStarted = _a.animationStarted, animationEnded = _a.animationEnded;
            animationStarted = animationStarted || emptyFunction;
            animationEnded = animationEnded || emptyFunction;
            _this.setState({ animating: running });
            if (running) {
                animationStarted();
            }
            else {
                animationEnded();
            }
        };
        _this.handleAction = function (action) {
            var _a = _this.props, displayMessage = _a.displayMessage, playersNames = _a.playersNames;
            displayMessage = displayMessage || emptyFunction;
            if (!action) {
                displayMessage(null);
                _this.setState({ fatigue: [] });
            }
            else {
                var firstMove = action.moves[0];
                var firstPlayer = firstMove.player;
                var name_1 = playersNames[firstPlayer.playerID];
                var type = intl.get("flamme_rouge." + firstPlayer.type.toString().toLowerCase());
                var message = void 0;
                switch (action.name) {
                    case "initial":
                        message = intl.get("flamme_rouge.doing_initial_position", {
                            name: name_1,
                            type: type,
                        });
                        displayMessage(message);
                        break;
                    case "played":
                        message = intl.get("flamme_rouge.doing_played_card", {
                            name: name_1,
                            type: type,
                            card: firstMove.metadata.pickedCard,
                            distance: firstMove.distance,
                        });
                        displayMessage(message);
                        break;
                    case "shooting":
                        var shootVelocity = "";
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
                        var shootingTitle = intl.get("flamme_rouge.shooting", {
                            name: name_1,
                            type: type,
                            style: shootVelocity,
                        });
                        _this.setState({
                            shots: firstMove.metadata.shots,
                            shootVelocity: firstMove.metadata.shootVelocity,
                            shootingTitle: shootingTitle,
                        });
                        break;
                    case "shot":
                        var shotsRatio = firstMove.metadata.shots.reduce(function (a, c) { return a + (c.success ? 1 : 0); }, 0) +
                            "/" +
                            firstMove.metadata.shots.length;
                        message = intl.get("flamme_rouge.did_shot", {
                            name: name_1,
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
                            name: name_1,
                            type: type,
                        });
                        displayMessage(message);
                        break;
                    case "suction":
                        displayMessage(intl.get("flamme_rouge.doing_suction"));
                        break;
                    case "fatigue":
                        displayMessage(intl.get("flamme_rouge.doing_fatigue"));
                        _this.setState({ fatigue: action.moves });
                        break;
                    default:
                        break;
                }
            }
        };
        _this.handleShotDone = function () {
            _this.setState({ shots: null });
        };
        _this.renderSpot = function (spot, key, playerID, animating, heartBeats, selectedRunner, classes) {
            var fatigue = _this.state.fatigue;
            var _symbol = spot.content
                ? intl
                    .get("flamme_rouge." + spot.content.type.toString().toLowerCase())
                    .substr(0, 2) + spot.content.playerID
                : null;
            var hasFatigue = false;
            if (spot.content) {
                hasFatigue = fatigue.some(function (move) {
                    return move.player.playerID === spot.content.playerID &&
                        move.player.runnerID === spot.content.runnerID;
                });
            }
            var typeClass = spot.type === null ? classes.default : classes[spot.type];
            var currentClass = spot.content && spot.content.playerID === playerID
                ? classes.paper_current
                : "";
            var content = hasFatigue ? (<ErrorOutlineIcon className={classes.icon}/>) : (_symbol);
            var target_icon = spot.type === "shoot" ? (<TargetIcon class={classes.target_icon} fill={"gray"}/>) : null;
            var heartBeat_icon_color = "red";
            var heartBeat_icon = null;
            if (!animating &&
                spot.content &&
                spot.content.playerID === playerID &&
                heartBeats[spot.content.runnerID]) {
                var hb_coor_index = Math.round(((HEARTBEAT_COLORS.length - 1) *
                    heartBeats[spot.content.runnerID].ratio) /
                    100);
                heartBeat_icon_color = HEARTBEAT_COLORS[hb_coor_index];
                heartBeat_icon = (<div>
          <FavoriteIcon className={classes.heartBeat_icon} style={{ color: heartBeat_icon_color }}/>
          <span className={classes.heartBeat_text}>
            {heartBeats[spot.content.runnerID].value}
          </span>
        </div>);
            }
            var selectedRunnerClass = selectedRunner !== null &&
                spot.content &&
                spot.content.playerID === playerID &&
                spot.content.runnerID === selectedRunner
                ? classes.paper_selected
                : null;
            return (<Grid key={key} item>
        <Paper className={classes.paper + " " + typeClass + " " + currentClass + " " + selectedRunnerClass}>
          {target_icon}
          {content}
          {heartBeat_icon}
        </Paper>
      </Grid>);
        };
        _this.renderStep = function (step, key, playerID, animating, heartBeats, selectedRunner, classes) {
            return (<Grid key={key} item>
        <Grid container className={classes.container} direction="column" spacing={1}>
          {step
                .reverse()
                .map(function (e, i) {
                return _this.renderSpot(e, i, playerID, animating, heartBeats, selectedRunner, classes);
            })}
        </Grid>
      </Grid>);
        };
        return _this;
    }
    BoardUI.prototype.componentDidMount = function () {
        var board = this.props.board;
        var _board = new Board(board);
        this.setState({ board: _board });
        this.setState({ actionIndex: _board.moves.length });
    };
    BoardUI.prototype.handleNewAction = function () {
        var _this = this;
        var _a = this.state, board = _a.board, actionIndex = _a.actionIndex, shots = _a.shots;
        if (actionIndex === board.moves.length) {
            setTimeout(function () {
                _this.setAnimationStatus(false);
                _this.handleAction(null);
            }, 2000);
        }
        else {
            if (this.timer === null) {
                this.timer = setTimeout(function () {
                    _this.timer = null;
                    _this.handleNewAction();
                }, 1000);
                if (shots === null) {
                    this.setAnimationStatus(true);
                    var _actionIndex = Math.min(actionIndex + 1, board.moves.length);
                    var action = board.moves[_actionIndex - 1];
                    this.setState({ actionIndex: _actionIndex });
                    this.handleAction(action);
                }
            }
        }
    };
    BoardUI.prototype.render = function () {
        var _this = this;
        var _a = this.state, board = _a.board, actionIndex = _a.actionIndex, shots = _a.shots, shootVelocity = _a.shootVelocity, shootingTitle = _a.shootingTitle, animating = _a.animating;
        var _b = this.props, classes = _b.classes, playerID = _b.playerID, heartBeats = _b.heartBeats, selectedRunner = _b.selectedRunner;
        return (<div>
        <Grid container direction="row" alignItems="center" spacing={1}>
          {board
            .renderWithoutUnusedLaps(actionIndex)
            .map(function (e, i) {
            return _this.renderStep(e, i, playerID, animating, heartBeats, selectedRunner, classes);
        })}
        </Grid>
        {shots && (<ShotsUI title={shootingTitle} openning={true} shots={shots} velocity={shootVelocity} onClose={this.handleShotDone}/>)}
      </div>);
    };
    return BoardUI;
}(Component));
BoardUI.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(BoardUI);
//# sourceMappingURL=index.js.map
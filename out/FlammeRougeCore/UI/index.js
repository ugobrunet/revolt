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
import { Item, Container } from "./elements";
import { Board } from "../Board";
import { getPlayersWhoShouldPickCard, getPlayersWhoShouldShoot, getPlayersFromGPlayers, } from "../BoardUtilities";
import { Player, Deck } from "../Deck";
import { MAX_NUMBER_OF_RUNNERS, NUMBER_OF_CARDS } from "../Settings";
import { prettify } from "../Utils";
import PlayersNamesContext from "../playersNamesContext";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
var Maps = require("../MapData/maps.json");
var MapsKeys = Object.keys(Maps);
var CELL_RADIUS = 40;
var styles = function (theme) { return ({
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
}); };
var FlammeRougeUI = /** @class */ (function (_super) {
    __extends(FlammeRougeUI, _super);
    function FlammeRougeUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isLoadingNames: false,
            message: null,
            animationRunning: false,
            playersNames: {},
        };
        _this.handleStartingBlockSpotsChanged = function (event) {
            _this.props.moves.setStartingBlockSpots(event.target.value);
        };
        _this.handleRunnersPerPlayerChanged = function (event) {
            _this.props.moves.setNumberOfRunnersPerPlayer(event.target.value);
        };
        _this.handlePreviousMap = function () {
            _this.props.moves.previousMap();
        };
        _this.handleNextMap = function () {
            _this.props.moves.nextMap();
        };
        _this.handleSelectMap = function () {
            _this.props.moves.selectMap();
        };
        _this.handlePlaceRunner = function (type) {
            _this.props.moves.placeRunner(type);
        };
        _this.handleSelectRunner = function (id) {
            _this.props.moves.selectRunner(id);
        };
        _this.handlePickCard = function (id) {
            _this.props.moves.pickCard(id);
        };
        _this.handleSelectShootingRunner = function (id) {
            _this.props.moves.selectShootingRunner(id);
        };
        _this.handleSelectShootingVelocity = function (velocity) {
            _this.props.moves.shoot(velocity);
        };
        _this.handleDisplayMessage = function (msg) {
            _this.setState({ message: msg });
        };
        _this.handleAnimationStarted = function () {
            _this.setState({ animationRunning: true });
        };
        _this.handleAnimationEnded = function () {
            _this.setState({ animationRunning: false });
        };
        _this.transformGameMetadata = function (gameMetadata) {
            var _playersName = {};
            for (var i = 0; i < gameMetadata.length; i++) {
                var player = gameMetadata[i];
                _playersName[player.id] = player.name;
            }
            return _playersName;
        };
        return _this;
    }
    FlammeRougeUI.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.G, board = _b.board, players = _b.players, selectedMap = _b.selectedMap, startingBlockSpots = _b.startingBlockSpots, mapString = _b.mapString, numOfRunnersPerPlayer = _b.numOfRunnersPerPlayer, _c = _a.ctx, gameover = _c.gameover, phase = _c.phase, currentPlayer = _c.currentPlayer, isActive = _a.isActive, playerID = _a.playerID, classes = _a.classes, gameMetadata = _a.gameMetadata;
        var _d = this.state, isLoadingNames = _d.isLoadingNames, message = _d.message, animationRunning = _d.animationRunning;
        if (isLoadingNames) {
            return <LinearProgress color="primary"/>;
        }
        var playersNames = this.transformGameMetadata(gameMetadata);
        var readOnly = !isActive;
        var _players = getPlayersFromGPlayers(players);
        var player = _players[playerID];
        var _board = new Board(board);
        var selectedRunner = player.selectedRunner !== null
            ? player.runners.find(function (runner) { return runner.id === player.selectedRunner; })
            : null;
        var spotType = _board.getSpotTypeForRunner(playerID, player.selectedRunner);
        var hand = selectedRunner ? selectedRunner.deck.hand : [];
        var heartBeatVariation = selectedRunner
            ? selectedRunner.deck.getHeartBeatVariationForHand(spotType)
            : [];
        var remainingCards = selectedRunner
            ? selectedRunner.deck.getRemainingCards()
            : {};
        var heartBeats = player.getHeartBeats();
        var Controls = null;
        var tips = null;
        var controlsShouldBeSticky = true;
        if (phase === "SelectMap" || phase === "ManualMap") {
            var isSelectMap = phase === "SelectMap";
            tips = intl.get("flamme_rouge.tips_select_map");
            var buttons = [
                {
                    text: intl.get("flamme_rouge.select"),
                    handleClick: this.handleSelectMap,
                },
            ];
            var availableSpotList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var availableRunnersPerPlayerList = Array(MAX_NUMBER_OF_RUNNERS);
            for (var i = 0; i < availableRunnersPerPlayerList.length; i++) {
                availableRunnersPerPlayerList[i] = i + 1;
            }
            // const startingBlockSpots = 3;
            var label_existing_map = intl.get("flamme_rouge.existing_map");
            var label_manual_map = intl.get("flamme_rouge.manual_map");
            var label_map = intl.get("flamme_rouge.map");
            var label_starting_block_spots = intl.get("flamme_rouge.starting_block_spots");
            var label_runners_per_player = intl.get("flamme_rouge.runners_per_player");
            var boardDifficulty = _board.getDifficulty();
            var label_difficulty = boardDifficulty * 100 + "m - " + 5 * NUMBER_OF_CARDS(boardDifficulty) + " " + intl.get("flamme_rouge.cards");
            Controls = (<Item className={classes.select_map_container}>
          <ButtonGroup variant="contained" aria-label="contained primary button group">
            <Button color={isSelectMap && "primary"} onClick={function () { return _this.props.moves.enterSelectMapMode(); }}>
              {label_existing_map}
            </Button>
            <Button color={!isSelectMap && "primary"} onClick={function () { return _this.props.moves.enterManualMapMode(); }}>
              {label_manual_map}
            </Button>
          </ButtonGroup>
          {isSelectMap && (<Grid container spacing={1} alignItems="center" className={classes.map_title}>
              <Grid item xs={2}>
                <NavigateBeforeIcon onClick={function () { return _this.handlePreviousMap(); }}/>
              </Grid>
              <Grid item xs={8}>
                <h2>{prettify(MapsKeys[selectedMap]) + " (" + label_difficulty + ")"}</h2>
              </Grid>
              <Grid item xs={2}>
                <NavigateNextIcon onClick={function () { return _this.handleNextMap(); }}/>
              </Grid>
            </Grid>)}
          {!isSelectMap && (<Grid container spacing={1} alignItems="center" justify="center" className={classes.map_title}>
              <Grid item>
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField id="standard-basic" label={label_map + " (" + label_difficulty + ")"} multiline rowsMax={4} value={mapString} onChange={function (event) {
                return _this.props.moves.setMapString(event.target.value);
            }}/>
                </form>
              </Grid>
            </Grid>)}
          <SelectMapUI 
            // choice={3}
            choice={startingBlockSpots} choices={availableSpotList} label={label_starting_block_spots} selectorID={"starting_block_spots"} handleChoiceChanged={this.handleStartingBlockSpotsChanged}/>
          <SelectMapUI 
            // choice={3}
            choice={numOfRunnersPerPlayer} choices={availableRunnersPerPlayerList} label={label_runners_per_player} selectorID={"runners_per_player"} handleChoiceChanged={this.handleRunnersPerPlayerChanged}/>

          <ButtonUI buttons={buttons}/>
        </Item>);
        }
        else if (phase === "PlaceRunner") {
            controlsShouldBeSticky = false;
            if (currentPlayer === playerID) {
                tips = intl.get("flamme_rouge.tips_place_runner");
            }
            else {
                tips = intl.get("flamme_rouge.waiting_for", {
                    name: playersNames[currentPlayer],
                });
            }
            var runners_1 = [];
            Player.RunnerTypes.forEach(function (type) {
                return runners_1.push({
                    name: intl.get("flamme_rouge." + type.toString().toLowerCase()),
                    info: intl.get("flamme_rouge.info_" + type.toString().toLowerCase()),
                    handleClick: function () {
                        _this.handlePlaceRunner(type);
                    },
                });
            });
            Controls = (<PlaceRunnerUI active={currentPlayer === playerID} runners={runners_1}/>);
            // if (currentPlayer === playerID) {
            // }
        }
        else if (phase === "Shoot") {
            var playersWhoShouldShoot_1 = getPlayersWhoShouldShoot(_board, _players);
            var runners = playersWhoShouldShoot_1[playerID].runners;
            if (runners.length > 0) {
                if (selectedRunner !== null) {
                    tips = intl.get("flamme_rouge.tips_shooting_select_velocity");
                }
                else {
                    tips = intl.get("flamme_rouge.tips_shooting_select_type");
                }
            }
            else {
                var keys = Object.keys(playersWhoShouldShoot_1);
                var playersAwaited = keys
                    .filter(function (id) { return playersWhoShouldShoot_1[id].runners.length > 0; })
                    .map(function (id) { return playersNames[id]; });
                tips = intl.get("flamme_rouge.waiting_for_players", {
                    players: playersAwaited.join(", "),
                });
            }
            var buttons_1 = [];
            if (selectedRunner === null) {
                runners.forEach(function (runner) {
                    return buttons_1.push({
                        text: intl.get("flamme_rouge." + runner.type.toString().toLowerCase()),
                        handleClick: function () {
                            _this.handleSelectShootingRunner(runner.id);
                        },
                    });
                });
            }
            else {
                var velocities = [-1, 0, 1];
                velocities.forEach(function (velocity) {
                    var text = "";
                    var penalty = Deck.getShootingVelocityPenalty(velocity);
                    if (penalty > 0) {
                        penalty = "+" + penalty;
                    }
                    var probability = selectedRunner.deck.getShootLevel(velocity) + "%";
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
                    buttons_1.push({
                        text: text,
                        handleClick: function () {
                            _this.handleSelectShootingVelocity(velocity);
                        },
                    });
                });
            }
            Controls = <ButtonUI buttons={buttons_1}/>;
        }
        else {
            var playersWhoShouldPickCard_1 = getPlayersWhoShouldPickCard(_board, _players);
            var runners = playersWhoShouldPickCard_1[playerID].runners;
            if (runners.length > 0) {
                if (selectedRunner !== null) {
                    tips = intl.get("flamme_rouge.tips_select_card");
                }
                else {
                    tips = intl.get("flamme_rouge.tips_select_type");
                }
            }
            else {
                var keys = Object.keys(playersWhoShouldPickCard_1);
                var playersAwaited = keys
                    .filter(function (id) { return playersWhoShouldPickCard_1[id].runners.length > 0; })
                    .map(function (id) { return playersNames[id]; });
                tips = intl.get("flamme_rouge.waiting_for_players", {
                    players: playersAwaited.join(", "),
                });
            }
            var buttons_2 = [];
            runners.forEach(function (runner) {
                return buttons_2.push({
                    text: intl.get("flamme_rouge." + runner.type.toString().toLowerCase()),
                    handleClick: function () {
                        _this.handleSelectRunner(runner.id);
                    },
                });
            });
            Controls =
                selectedRunner !== null ? (<Item>
            <HandUI handleClick={this.handlePickCard} cards={hand} heartBeatVariation={heartBeatVariation}/>
            <CardsRemainingUI cards={remainingCards}/>
          </Item>) : (<ButtonUI buttons={buttons_2}/>);
        }
        var opponents = "";
        var playersNamesKeys = Object.keys(playersNames);
        for (var i = 0; i < playersNamesKeys.length; i++) {
            if (i.toString() !== playerID) {
                var playerName = playersNames[i];
                opponents += playerName + "(#" + i.toString() + "), ";
            }
        }
        if (opponents.length > 2) {
            opponents = opponents.slice(0, -2);
        }
        return (<PlayersNamesContext.Provider value={playersNames}>
        <Container column>
          <Item center className={classes.players_container}>
            <h3>
              {intl.get("online.youare", {
            id: playerID,
            opponents: opponents,
        })}
            </h3>
          </Item>
          <Item center className={classes.message_container + " " + (controlsShouldBeSticky && classes.message_container_sticky)}>
            <h2>{message === null ? tips : message}</h2>
          </Item>
          <Item center className={classes.controls_container + " " + (controlsShouldBeSticky && classes.controls_container_sticky)}>
            {animationRunning && phase !== "PlaceRunner" ? null : Controls}
          </Item>
          <Item center className={classes.board_container}>
            <BoardUI playersNames={playersNames} playerID={playerID} selectedRunner={player.selectedRunner} heartBeats={heartBeats} displayMessage={this.handleDisplayMessage} animationStarted={this.handleAnimationStarted} animationEnded={this.handleAnimationEnded} disabled={readOnly} cellRadius={CELL_RADIUS} board={board}/>
          </Item>
          
          <Congratulations playerID={playerID} winner={board.winner} gameover={gameover}/>
        </Container>
      </PlayersNamesContext.Provider>);
    };
    return FlammeRougeUI;
}(Component));
FlammeRougeUI.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(FlammeRougeUI);
//# sourceMappingURL=index.js.map
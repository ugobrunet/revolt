var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Player, Deck } from "./Deck";
import { Board, BoardPlayer, Move, } from "./Board";
import { isStepEmpty, getPlayersWhoShouldPickCard, getPlayersWhoShouldShoot, getPlayersFromGPlayers, } from "./BoardUtilities";
import _ from "lodash";
import { LAP_LENGTH, MIN_DISTANCE_DOWN, MAX_DISTANCE_UP, CARDS_IN_HAND, } from "./Settings";
var Maps = require("./MapData/maps.json");
var MapsKeys = Object.keys(Maps);
var IsVictory = function (board) {
    return board.winner !== null;
};
var getInitialTurnOrder = function (ctx) {
    var numPlayers = ctx.numPlayers, random = ctx.random;
    var _order = Array(numPlayers).fill(null);
    for (var i = 0; i < numPlayers; i++) {
        _order[i] = i;
    }
    return random ? random.Shuffle(_order) : _order;
};
var getInitialPlayers = function (ctx, numberOfRunnersPerPlayer) {
    var numPlayers = ctx.numPlayers;
    var _players = {};
    for (var i = 0; i < numPlayers; i++) {
        _players[i] = new Player().setRunnersNumber(numberOfRunnersPerPlayer);
    }
    return _players;
};
var loadMap = function (numberOfPlayers, mapString, startingBlockWidth, numberOfRunnersPerPlayer) {
    var board = new Board().map.init(numberOfPlayers, numberOfRunnersPerPlayer, startingBlockWidth, mapString);
    return board;
};
var SetStartingBlockWidth = function (G, ctx, val) {
    console.log("SetStartingBlockWidth");
    var mapString = G.mapString, numOfRunnersPerPlayer = G.numOfRunnersPerPlayer;
    var numPlayers = ctx.numPlayers;
    return __assign(__assign({}, G), { board: loadMap(numPlayers, mapString, val, numOfRunnersPerPlayer), startingBlockSpots: val });
};
var SetNumberOfRunnersPerPlayer = function (G, ctx, val) {
    var _a;
    console.log("SetNumberOfRunnersPerPlayer");
    var mapString = G.mapString, startingBlockSpots = G.startingBlockSpots, players = G.players;
    var numPlayers = ctx.numPlayers;
    var _newPlayers = __assign({}, players);
    for (var i = 0; i < numPlayers; i++) {
        var player = new Player(players[i]);
        player.setRunnersNumber(val);
        _newPlayers = __assign(__assign({}, _newPlayers), (_a = {}, _a[i] = player, _a));
    }
    return __assign(__assign({}, G), { board: loadMap(numPlayers, mapString, startingBlockSpots, val), numOfRunnersPerPlayer: val, players: _newPlayers });
};
var ChooseMap = function (G, ctx, nextIndexIncrement) {
    console.log("NextMap");
    var selectedMap = G.selectedMap, startingBlockSpots = G.startingBlockSpots, numOfRunnersPerPlayer = G.numOfRunnersPerPlayer;
    var numPlayers = ctx.numPlayers;
    var nextMapIndex = selectedMap + nextIndexIncrement;
    if (nextMapIndex >= MapsKeys.length) {
        nextMapIndex = 0;
    }
    if (nextMapIndex < 0) {
        nextMapIndex = MapsKeys.length - 1;
    }
    var mapString = Maps[MapsKeys[nextMapIndex]].pathSymbols;
    return __assign(__assign({}, G), { board: loadMap(numPlayers, mapString, startingBlockSpots, numOfRunnersPerPlayer), selectedMap: nextMapIndex, mapString: mapString });
};
var SetMapString = function (G, ctx, mapString) {
    console.log("SetMapString");
    var startingBlockSpots = G.startingBlockSpots, numOfRunnersPerPlayer = G.numOfRunnersPerPlayer;
    var numPlayers = ctx.numPlayers;
    return __assign(__assign({}, G), { board: loadMap(numPlayers, mapString, startingBlockSpots, numOfRunnersPerPlayer), mapString: mapString });
};
var getMoveInMoves = function (spot, moves) {
    if (spot.content === null)
        return null;
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        if (_.isEqual(move.player, spot.content))
            return move;
    }
    return null;
};
var hasFreeSpot = function (step) {
    for (var i = 0; i < step.spots.length; i++) {
        var spot = step.spots[i];
        if (spot.content === null)
            return true;
    }
    return false;
};
var makeMove = function (_moves, _board) {
    var currentBoard = _board.render();
    for (var i = currentBoard.length - 1; i >= 0; i--) {
        var step = currentBoard[i];
        for (var j = 0; j < step.spots.length; j++) {
            var spot = step.spots[j];
            var move = getMoveInMoves(spot, _moves);
            if (move !== null) {
                var distance = 0;
                var _endOfShootingRange = 0;
                var isShooting = move.metadata && move.metadata.shots;
                if (isShooting) {
                    var shotResult = Math.max(0, move.metadata.shots.reduce(function (a, c) { return a + (c.success ? LAP_LENGTH : 0); }, 0) + Deck.getShootingVelocityPenalty(move.metadata.shootVelocity));
                    while (currentBoard[_endOfShootingRange + 1 + i].type === "shoot") {
                        _endOfShootingRange++;
                    }
                    distance = _endOfShootingRange + shotResult;
                }
                else {
                    distance = move.distance;
                }
                while (distance + i >= currentBoard.length) {
                    distance--;
                }
                // DOWN
                if (step.type === "down") {
                    distance = Math.max(distance, MIN_DISTANCE_DOWN);
                }
                // UP
                var MAX_UP = move.player.type === "Climber" ? 6 : MAX_DISTANCE_UP;
                for (var k = 0; k < currentBoard.length - i && k <= distance; k++) {
                    var _step = currentBoard[k + i];
                    if (_step.type === "up") {
                        distance = Math.min(distance, Math.max(k - 1, MAX_UP));
                        break;
                    }
                }
                // SHOOTING
                if (step.type !== "shoot") {
                    for (var k = distance; k > 0; k--) {
                        var _step = currentBoard[k + i];
                        if (_step.type === "shoot") {
                            distance = k;
                            break;
                        }
                    }
                }
                while (distance + i >= currentBoard.length) {
                    distance--;
                }
                while (!hasFreeSpot(currentBoard[distance + i]) && distance > 0) {
                    distance--;
                }
                if (isShooting && distance <= _endOfShootingRange) {
                    distance = _endOfShootingRange + 1;
                }
                if (distance > 0) {
                    if (isShooting) {
                        _board.addAction([new Move(move.player, 0, move.metadata)], "shooting");
                        _board.addAction([new Move(move.player, distance, move.metadata)], "shot");
                    }
                    else {
                        var action = "played";
                        _board.addAction([new Move(move.player, distance, { pickedCard: move.distance })], action);
                    }
                    currentBoard = _board.render();
                }
            }
        }
    }
    return _board;
};
var MovePlayers = function (G, ctx) {
    console.log("MovePlayers");
    var numPlayers = ctx.numPlayers;
    var _board = new Board(G.board);
    var _moves = [];
    var _loop_1 = function (i) {
        var player = new Player(G.players[i]);
        player.runners.forEach(function (runner) {
            if ((runner.deck && runner.deck.pickedCard) || runner.deck.shots) {
                _moves.push(new Move(new BoardPlayer(i, runner.id, runner.type), runner.deck.pickedCard || 0, {
                    shots: runner.deck.shots,
                    shootVelocity: runner.deck.shootVelocity,
                }));
            }
        });
    };
    for (var i = 0; i < numPlayers; i++) {
        _loop_1(i);
    }
    return __assign(__assign({}, G), { board: makeMove(_moves, _board) });
};
var SortFinishers = function (G, ctx) {
    console.log("SortFinishers");
    var _board = new Board(G.board);
    var currentBoard = _board.render();
    for (var i = currentBoard.length - 1; i >= 0; i--) {
        var step = currentBoard[i];
        for (var j = 0; j < step.spots.length; j++) {
            var spot = step.spots[j];
            if (spot.content !== null && step.type === "end") {
                var distance = 0;
                while (distance + i + 1 < currentBoard.length &&
                    hasFreeSpot(currentBoard[distance + i + 1])) {
                    distance++;
                }
                if (distance > 0) {
                    var action = "finished";
                    _board.addAction([new Move(spot.content, distance)], action);
                    currentBoard = _board.render();
                }
            }
        }
    }
    return __assign(__assign({}, G), { board: _board });
};
var EnterShootingRange = function (G, ctx) {
    console.log("EnterShootingRange");
    var _board = new Board(G.board);
    var _renderedBoard = _board.render();
    var stepIndex = _renderedBoard.length - 1;
    var _loop_2 = function () {
        var spotType = _renderedBoard[stepIndex].type;
        if (spotType === "shoot" && !isStepEmpty(_renderedBoard[stepIndex])) {
            var followerIndex = 1;
            var moves_1 = [];
            var _loop_3 = function () {
                var distance = followerIndex;
                _renderedBoard[stepIndex - followerIndex].spots.forEach(function (spot) {
                    if (spot.content !== null) {
                        moves_1.push(new Move(spot.content, distance));
                    }
                });
                followerIndex++;
            };
            while (stepIndex - followerIndex >= 0 &&
                !isStepEmpty(_renderedBoard[stepIndex - followerIndex])) {
                _loop_3();
            }
            if (moves_1.length > 0) {
                var action = "enterShootingRange";
                _board.addAction(moves_1, action);
            }
            stepIndex -= followerIndex;
        }
        stepIndex--;
    };
    while (stepIndex >= 0) {
        _loop_2();
    }
    return __assign(__assign({}, G), { board: _board });
};
var DoSuction = function (G, ctx) {
    console.log("DoSuction");
    var _newBoard = new Board(G.board);
    var suctionFound = true;
    var _loop_4 = function () {
        suctionFound = false;
        var currentBoard = _newBoard.render();
        var players = [];
        var nullStepFound = false;
        for (var i = 0; i < currentBoard.length; i++) {
            var step = currentBoard[i];
            var stepIsEmpty = isStepEmpty(step);
            if (nullStepFound) {
                if (!stepIsEmpty) {
                    suctionFound = true;
                    break;
                }
                else {
                    players.splice(0, players.length);
                    nullStepFound = false;
                }
            }
            else {
                var _type = step.type;
                if (_type === "up" || _type === "end" || _type === "shoot") {
                    players.splice(0, players.length);
                }
                else {
                    if (!stepIsEmpty) {
                        step.spots.forEach(function (spot) {
                            if (spot.content !== null)
                                players.push(spot.content);
                        });
                    }
                    else {
                        if (players.length > 0) {
                            nullStepFound = true;
                        }
                    }
                }
            }
        }
        if (suctionFound) {
            var moves = players.map(function (player) { return new Move(player, 1); });
            _newBoard.addAction(moves, "suction");
        }
    };
    while (suctionFound) {
        _loop_4();
    }
    return __assign(__assign({}, G), { board: _newBoard });
};
var DoFatigue = function (G, ctx) {
    console.log("DoFatigue");
    var numPlayers = ctx.numPlayers;
    var _newBoard = new Board(G.board);
    var _rBoard = _newBoard.render();
    var _fatiguePlayers = [];
    var stepAheadIsEmpty = false;
    for (var i = _rBoard.length - 1; i >= 0; i--) {
        var step = _rBoard[i];
        if (step.type !== "shoot") {
            if (stepAheadIsEmpty && !isStepEmpty(step)) {
                step.spots.forEach(function (spot) {
                    if (spot.content !== null) {
                        var runnerID_1 = spot.content.runnerID;
                        var player = new Player(G.players[spot.content.playerID]);
                        var runner = player.runners.find(function (runner) { return runner.id === runnerID_1; });
                        if (runner &&
                            (runner.deck.pickedCard !== null || runner.deck.shots !== null)) {
                            _fatiguePlayers.push(spot.content);
                        }
                    }
                });
            }
        }
        stepAheadIsEmpty = isStepEmpty(step);
    }
    if (_fatiguePlayers.length > 0) {
        var moves = _fatiguePlayers.map(function (player) { return new Move(player, 0); });
        _newBoard.addAction(moves, "fatigue");
    }
    var _newPlayers = __assign({}, G.players);
    var _loop_5 = function (i) {
        var _a;
        var player = new Player(G.players[i]);
        player.runners.forEach(function (runner) {
            if (_fatiguePlayers.some(function (p) { return p.playerID === i && p.runnerID === runner.id; })) {
                runner.deck.takeFatigue();
            }
        });
        _newPlayers = __assign(__assign({}, _newPlayers), (_a = {}, _a[i] = player, _a));
    };
    for (var i = 0; i < numPlayers; i++) {
        _loop_5(i);
    }
    return __assign(__assign({}, G), { board: _newBoard, players: _newPlayers });
};
var PickCard = function (G, ctx, index) {
    var _a;
    console.log("Picking Card");
    var playerID = ctx.playerID;
    var board = G.board;
    if (playerID === undefined) {
        return __assign({}, G);
    }
    var player = new Player(G.players[playerID]);
    var runner = player.selectedRunner;
    if (runner === null) {
        return __assign({}, G);
    }
    var spotType = new Board(board).getSpotTypeForRunner(+playerID, runner);
    player.pickCard(runner, index, spotType);
    return __assign(__assign({}, G), { players: __assign(__assign({}, G.players), (_a = {}, _a[playerID] = player, _a)) });
};
var ResetSelectedRunner = function (G, ctx) {
    var _a;
    console.log("ResetSelectedRunner");
    var playerID = ctx.playerID;
    if (playerID === undefined) {
        return __assign({}, G);
    }
    var player = new Player(G.players[playerID]);
    player.resetSelectedRunner();
    return __assign(__assign({}, G), { players: __assign(__assign({}, G.players), (_a = {}, _a[playerID] = player, _a)) });
};
var TakeCardsInHand = function (G, ctx) {
    var _a;
    console.log("TakeCardsInHand");
    var playerID = ctx.playerID, random = ctx.random;
    var board = G.board;
    if (playerID === undefined) {
        return __assign({}, G);
    }
    var player = new Player(G.players[playerID]);
    var runnerId = player.selectedRunner;
    if (runnerId === null) {
        return __assign({}, G);
    }
    var _board = new Board(board);
    var spotType = _board.getSpotTypeForRunner(+playerID, runnerId);
    player.takeCardsInHand(runnerId, CARDS_IN_HAND, spotType, random);
    return __assign(__assign({}, G), { players: __assign(__assign({}, G.players), (_a = {}, _a[playerID] = player, _a)) });
};
var ProcessGiftBasedOnPosition = function (G, ctx) {
    var _a;
    console.log("ProcessGiftBasedOnPosition");
    var playerID = ctx.playerID, random = ctx.random;
    var board = G.board;
    if (playerID === undefined) {
        return __assign({}, G);
    }
    var player = new Player(G.players[playerID]);
    var runnerId = player.selectedRunner;
    if (runnerId === null) {
        return __assign({}, G);
    }
    var runner = player.runners.find(function (runner) { return runner.id === runnerId; });
    if (runner && (runner.type === "Relay" || runner.type === "Finisher")) {
        var _board = new Board(board);
        var boardPlayer = new BoardPlayer(+playerID, runner.id, runner.type);
        var distanceFromStart = _board.distanceFromStart(boardPlayer);
        var distanceToEnd = _board.distanceToEnd(boardPlayer);
        var boardDifficulty = _board.getDifficulty();
        player.processGift(runnerId, distanceFromStart, distanceToEnd, boardDifficulty, random);
    }
    return __assign(__assign({}, G), { players: __assign(__assign({}, G.players), (_a = {}, _a[playerID] = player, _a)) });
};
var ProcessHeartBeats = function (G, ctx) {
    var _a;
    console.log("ProcessHeartBeats");
    var numPlayers = ctx.numPlayers;
    var _newPlayers = __assign({}, G.players);
    for (var i = 0; i < numPlayers; i++) {
        var player = new Player(G.players[i]);
        player.processHeartBeats();
        _newPlayers = __assign(__assign({}, _newPlayers), (_a = {}, _a[i] = player, _a));
    }
    return __assign(__assign({}, G), { players: _newPlayers });
};
var ResetPickedCards = function (G, ctx) {
    var _a;
    console.log("ResetPickedCards");
    var numPlayers = ctx.numPlayers;
    var _newPlayers = __assign({}, G.players);
    for (var i = 0; i < numPlayers; i++) {
        var player = new Player(G.players[i]);
        player.resetPickedCards();
        _newPlayers = __assign(__assign({}, _newPlayers), (_a = {}, _a[i] = player, _a));
    }
    return __assign(__assign({}, G), { players: _newPlayers });
};
var ResetShots = function (G, ctx) {
    var _a;
    console.log("ResetShots");
    var numPlayers = ctx.numPlayers;
    var _newPlayers = __assign({}, G.players);
    for (var i = 0; i < numPlayers; i++) {
        var player = new Player(G.players[i]);
        player.resetShots();
        _newPlayers = __assign(__assign({}, _newPlayers), (_a = {}, _a[i] = player, _a));
    }
    return __assign(__assign({}, G), { players: _newPlayers });
};
var ResetSelectedRunnerForAllPlayers = function (G, ctx) {
    var _a;
    console.log("ResetSelectedRunnerForAllPlayers");
    var numPlayers = ctx.numPlayers;
    var _newPlayers = __assign({}, G.players);
    for (var i = 0; i < numPlayers; i++) {
        var player = new Player(G.players[i]);
        player.resetSelectedRunner();
        _newPlayers = __assign(__assign({}, _newPlayers), (_a = {}, _a[i] = player, _a));
    }
    return __assign(__assign({}, G), { players: _newPlayers });
};
var SelectRunner = function (G, ctx, id) {
    var _a;
    console.log("SelectRunner");
    var playerID = ctx.playerID;
    if (playerID === undefined) {
        return __assign({}, G);
    }
    var player = new Player(G.players[playerID]);
    player.selectRunner(id);
    return __assign(__assign({}, G), { players: __assign(__assign({}, G.players), (_a = {}, _a[playerID] = player, _a)) });
};
var Shoot = function (G, ctx, velocity) {
    var _a;
    console.log("Shoot");
    var playerID = ctx.playerID, random = ctx.random;
    if (playerID === undefined) {
        return __assign({}, G);
    }
    var player = new Player(G.players[playerID]);
    var runner = player.selectedRunner;
    if (runner === null) {
        return __assign({}, G);
    }
    player.shootWithRunner(runner, velocity, random);
    return __assign(__assign({}, G), { players: __assign(__assign({}, G.players), (_a = {}, _a[playerID] = player, _a)) });
};
var PlaceRunner = function (G, ctx, type) {
    var _a;
    console.log("PlaceRunner");
    var playerID = ctx.playerID, random = ctx.random;
    if (playerID === undefined) {
        return __assign({}, G);
    }
    var player = new Player(G.players[playerID]);
    var board = new Board(G.board);
    var runnerID = player.initNextRunner(type, board.getDifficulty());
    if (runnerID === null) {
        return __assign({}, G);
    }
    player.shuffleRunner(runnerID, random);
    var boardPlayer = new BoardPlayer(+playerID, runnerID, type);
    return __assign(__assign({}, G), { board: board.placeRunner(boardPlayer), players: __assign(__assign({}, G.players), (_a = {}, _a[playerID] = player, _a)) });
};
var ShuffleTurnOrder = function (G, ctx) {
    var turn = ctx.turn, random = ctx.random;
    var order = G.order, turnOnPhaseBegin = G.turnOnPhaseBegin;
    if (random !== undefined && (turn - turnOnPhaseBegin) % order.length === 0) {
        console.log("ShuffleTurnOrder");
        return __assign(__assign({}, G), { order: random.Shuffle(order) });
    }
    else {
        return __assign({}, G);
    }
};
var ShouldEndPhasePlaceRunner = function (G) {
    var shouldEnd = true;
    var players = Object.keys(G.players);
    var board = new Board(G.board);
    var playersOnBoard = board.getRunnersInType();
    var playersKeys = Object.keys(playersOnBoard);
    playersKeys
        // .map((player) => playersOnBoard[player])
        .forEach(function (player) {
        var _player = new Player(G.players[player]);
        var runnersNotOnBoard = _player.runners.filter(function (runner) {
            return !runner ||
                !runner.deck ||
                !playersOnBoard[+player] ||
                playersOnBoard[+player].indexOf(runner.id) === -1;
        });
        shouldEnd = shouldEnd && runnersNotOnBoard.length === 0;
    });
    return shouldEnd;
};
var ShouldEndPhasePick = function (G) {
    var shouldEnd = true;
    var board = new Board(G.board);
    var players = getPlayersFromGPlayers(G.players);
    var playersWhoPickCard = getPlayersWhoShouldPickCard(board, players);
    var keys = Object.keys(playersWhoPickCard);
    keys.forEach(function (id) {
        var runners = playersWhoPickCard[+id].runners;
        if (runners.length > 0) {
            shouldEnd = false;
        }
    });
    return shouldEnd;
};
var ShouldEndPhaseShoot = function (G) {
    var shouldEnd = true;
    var board = new Board(G.board);
    var players = getPlayersFromGPlayers(G.players);
    var playersWhoShouldShoot = getPlayersWhoShouldShoot(board, players);
    var keys = Object.keys(playersWhoShouldShoot);
    keys.forEach(function (id) {
        var runners = playersWhoShouldShoot[+id].runners;
        if (runners.length > 0) {
            shouldEnd = false;
        }
    });
    return shouldEnd;
};
var DEFAULT_STARTING_BLOCK_SPOT = 2;
var DEFAULT_NUMBER_OF_RUNNER_PER_PLAYER = 2;
var FlammeRouge = {
    name: "flamme_rouge",
    minPlayers: 2,
    setup: function (ctx) { return ({
        startingBlockSpots: DEFAULT_STARTING_BLOCK_SPOT,
        turnOnPhaseBegin: 0,
        order: getInitialTurnOrder(ctx),
        selectedMap: 0,
        mapString: Maps[MapsKeys[0]].pathSymbols,
        board: loadMap(ctx.numPlayers, Maps[MapsKeys[0]].pathSymbols, DEFAULT_STARTING_BLOCK_SPOT, DEFAULT_NUMBER_OF_RUNNER_PER_PLAYER),
        numOfRunnersPerPlayer: DEFAULT_NUMBER_OF_RUNNER_PER_PLAYER,
        players: getInitialPlayers(ctx, DEFAULT_NUMBER_OF_RUNNER_PER_PLAYER),
    }); },
    phases: {
        SelectMap: {
            start: true,
            moves: {
                enterManualMapMode: function (G, ctx) {
                    if (ctx && ctx.events && ctx.events.setPhase)
                        ctx.events.setPhase("ManualMap");
                    return __assign({}, G);
                },
                setStartingBlockSpots: function (G, ctx, val) {
                    G = __assign({}, SetStartingBlockWidth(G, ctx, val));
                    return __assign({}, G);
                },
                setNumberOfRunnersPerPlayer: function (G, ctx, val) {
                    G = __assign({}, SetNumberOfRunnersPerPlayer(G, ctx, val));
                    return __assign({}, G);
                },
                previousMap: function (G, ctx) {
                    G = __assign({}, ChooseMap(G, ctx, -1));
                    return __assign({}, G);
                },
                nextMap: function (G, ctx) {
                    G = __assign({}, ChooseMap(G, ctx, 1));
                    return __assign({}, G);
                },
                selectMap: function (G, ctx) {
                    if (ctx && ctx.events && ctx.events.endPhase)
                        ctx.events.endPhase();
                    return __assign({}, G);
                },
            },
            onBegin: function (G, ctx) {
                console.log("Beginning phase SelectMap");
                if (ctx && ctx.events && ctx.events.setActivePlayers)
                    ctx.events.setActivePlayers({ all: "SelectMap" });
            },
            next: "PlaceRunner",
        },
        ManualMap: {
            moves: {
                enterSelectMapMode: function (G, ctx) {
                    if (ctx && ctx.events && ctx.events.setPhase)
                        ctx.events.setPhase("SelectMap");
                    return __assign({}, G);
                },
                setStartingBlockSpots: function (G, ctx, val) {
                    G = __assign({}, SetStartingBlockWidth(G, ctx, val));
                    return __assign({}, G);
                },
                setNumberOfRunnersPerPlayer: function (G, ctx, val) {
                    G = __assign({}, SetNumberOfRunnersPerPlayer(G, ctx, val));
                    return __assign({}, G);
                },
                setMapString: function (G, ctx, mapString) {
                    G = __assign({}, SetMapString(G, ctx, mapString));
                    console.log("MapString:", mapString);
                    return __assign({}, G);
                },
                selectMap: function (G, ctx) {
                    if (ctx && ctx.events && ctx.events.endPhase)
                        ctx.events.endPhase();
                    return __assign({}, G);
                },
            },
            onBegin: function (G, ctx) {
                console.log("Beginning phase SelectMap");
                if (ctx && ctx.events && ctx.events.setActivePlayers)
                    ctx.events.setActivePlayers({ all: "ManualMap" });
            },
            next: "PlaceRunner",
        },
        PlaceRunner: {
            moves: {
                placeRunner: function (G, ctx, type) {
                    G = __assign({}, PlaceRunner(G, ctx, type));
                    G = __assign({}, ShuffleTurnOrder(G, ctx));
                    return __assign({}, G);
                },
            },
            endIf: ShouldEndPhasePlaceRunner,
            turn: {
                moveLimit: 1,
                order: {
                    first: function (G, ctx) {
                        var order = G.order;
                        return order[0];
                    },
                    next: function (G, ctx) {
                        var order = G.order, turnOnPhaseBegin = G.turnOnPhaseBegin;
                        var turn = ctx.turn;
                        return order[(turn - turnOnPhaseBegin) % order.length];
                    },
                },
            },
            onBegin: function (G, ctx) {
                console.log("Beginning phase PlaceRunner");
                return __assign(__assign({}, G), { turnOnPhaseBegin: ctx.turn });
            },
            next: "Pick",
        },
        Pick: {
            moves: {
                selectRunner: function (G, ctx, id) {
                    G = __assign({}, SelectRunner(G, ctx, id));
                    G = __assign({}, ProcessGiftBasedOnPosition(G, ctx));
                    G = __assign({}, TakeCardsInHand(G, ctx));
                    return __assign({}, G);
                },
                pickCard: function (G, ctx, index) {
                    G = __assign({}, PickCard(G, ctx, index));
                    G = __assign({}, ResetSelectedRunner(G, ctx));
                    return __assign({}, G);
                },
            },
            next: "Shoot",
            endIf: ShouldEndPhasePick,
            onBegin: function (G, ctx) {
                console.log("Beginning phase Pick");
                G = __assign({}, ResetSelectedRunnerForAllPlayers(G, ctx));
                if (ctx && ctx.events && ctx.events.setActivePlayers)
                    ctx.events.setActivePlayers({ all: "Pick" });
                return __assign({}, G);
            },
            onEnd: function (G, ctx) {
                console.log("Ending phase Pick");
                G = __assign({}, MovePlayers(G, ctx));
                G = __assign({}, SortFinishers(G, ctx));
                G = __assign({}, DoSuction(G, ctx));
                G = __assign({}, EnterShootingRange(G, ctx));
                G = __assign({}, DoFatigue(G, ctx));
                G = __assign({}, ProcessHeartBeats(G, ctx));
                G = __assign({}, ResetPickedCards(G, ctx));
                return __assign({}, G);
            },
        },
        Shoot: {
            moves: {
                selectShootingRunner: function (G, ctx, id) {
                    console.log("selectShootingRunner");
                    G = __assign({}, SelectRunner(G, ctx, id));
                    G = __assign({}, ProcessGiftBasedOnPosition(G, ctx));
                    return __assign({}, G);
                },
                shoot: function (G, ctx, velocity) {
                    console.log("shoot");
                    G = __assign({}, Shoot(G, ctx, velocity));
                    G = __assign({}, ResetSelectedRunner(G, ctx));
                    return __assign({}, G);
                },
            },
            next: "Pick",
            endIf: ShouldEndPhaseShoot,
            onBegin: function (G, ctx) {
                console.log("Beginning phase Shoot");
                if (ctx && ctx.events && ctx.events.setActivePlayers)
                    ctx.events.setActivePlayers({ all: "Shoot" });
                return __assign({}, G);
            },
            onEnd: function (G, ctx) {
                console.log("Ending phase Shoot");
                G = __assign({}, MovePlayers(G, ctx));
                G = __assign({}, SortFinishers(G, ctx));
                G = __assign({}, DoSuction(G, ctx));
                G = __assign({}, EnterShootingRange(G, ctx));
                G = __assign({}, DoFatigue(G, ctx));
                G = __assign({}, ResetShots(G, ctx));
                return __assign({}, G);
            },
        },
    },
    ai: {
        enumerate: function (G, ctx) { },
    },
    // playerView: PlayerView.STRIP_SECRETS,
    endIf: function (G, ctx) {
        if (IsVictory(G.board)) {
            return { winner: ctx.currentPlayer };
        }
    },
};
FlammeRouge.minPlayers = 2;
export default FlammeRouge;
//# sourceMappingURL=game.js.map
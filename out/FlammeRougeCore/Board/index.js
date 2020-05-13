import { MapData } from "../MapData";
import { isStepEmpty } from "../BoardUtilities";
import { LAP_LENGTH, SHOOTINGS, MAX_CARD_VALUE } from "../Settings";
import _ from "lodash";
var Board = /** @class */ (function () {
    function Board(board) {
        var _this = this;
        this.winner = null;
        this.actions = [];
        this.map = new Map(null);
        this.renderWithoutUnusedLaps = function (actionIndex) {
            var board = _this.render(actionIndex);
            var lastType = null;
            for (var i = 0; i < board.length; i++) {
                var type = board[i].type;
                if (type === "lap" && lastType !== "lap") {
                    while (isStepEmpty(board[i]) &&
                        i < board.length &&
                        board[i].type === "lap") {
                        board.splice(i, 1);
                    }
                }
                lastType = type;
            }
            return board;
        };
        this.getRunnersInType = function (type) {
            return _this.getRunnersAfterFilteringStepType(true, type);
        };
        this.getRunnersNotInType = function (type) {
            return _this.getRunnersAfterFilteringStepType(false, type);
        };
        this.getSpotTypeForRunner = function (playerID, runnerID) {
            if (runnerID === null)
                return null;
            var rboard = _this.render();
            for (var i = 0; i < rboard.length; i++) {
                var step = rboard[i];
                for (var j = 0; j < step.spots.length; j++) {
                    var spot = step.spots[j];
                    if (spot.content !== null &&
                        spot.content.playerID === playerID &&
                        spot.content.runnerID === runnerID) {
                        return step.type;
                    }
                }
            }
            return null;
        };
        this.placeRunner = function (player) {
            var _nextStartingBlockPosition = _this.getNextStartingBlockPosition();
            var action = "initial";
            _this.addAction([new Move(player, _nextStartingBlockPosition)], action);
            return _this;
        };
        this.distanceFromStart = function (player) {
            return _this.getDistanceForRunner(player);
        };
        this.distanceToEnd = function (player) {
            var shouldReverseBoard = true;
            return _this.getDistanceForRunner(player, shouldReverseBoard);
        };
        if (board && board.actions)
            this.actions = board.actions;
        if (board && board.map)
            this.map = new Map(board.map).clone();
        if (board && board.winner)
            this.winner = board.winner;
    }
    Board.prototype.isEqual = function (b) {
        return (b.map &&
            b.actions &&
            _.isEqual(this.map, b.map) &&
            _.isEqual(this.actions, b.actions));
    };
    Board.prototype.getDifficulty = function () {
        return this.map.path.reduce(function (a, c) {
            switch (c.type) {
                case null:
                    return a + 1;
                case "up":
                    return a + 2;
                case "shoot":
                    return a + (LAP_LENGTH * SHOOTINGS) / 2;
                case "down":
                    return a + 0.5;
                default:
                    return a;
            }
        }, 0);
    };
    Board.prototype.addSpot = function (stepIndex) {
        this.map.path[stepIndex].spots.push(new MapSpot());
        return this;
    };
    Board.prototype.addAction = function (moves, name) {
        this.actions = this.actions.concat([new Action(moves, name)]);
        if (this.winner === null) {
            var playersFinished = this.getRunnersInType("end");
            var finishedKeys = Object.keys(playersFinished);
            var playersOnCourse = this.getRunnersNotInType("end");
            var onCourseKeys = Object.keys(playersOnCourse);
            if (finishedKeys.length > 0 && onCourseKeys.length < 2) {
                this.winner = this.getWinners();
            }
        }
        return this;
    };
    Board.prototype.getWinners = function () {
        var winners = [];
        var board = this.render();
        board
            // .filter((step) => step[0].type === "end")
            .reverse()
            .forEach(function (step) {
            step.spots.forEach(function (spot) {
                if (spot.content !== null) {
                    winners.push(spot.content);
                }
            });
        });
        return winners;
    };
    Board.prototype.render = function (actionIndex) {
        var board = new Map(this.map).clone();
        actionIndex = actionIndex || this.actions.length;
        var players = {};
        var _loop_1 = function (i) {
            var action = this_1.actions[i];
            action.moves.forEach(function (move) {
                if (move.distance > 0) {
                    var player = move.player;
                    var playerKey = player.playerID + player.type + player.runnerID;
                    if (players[playerKey] === undefined) {
                        players[playerKey] = {
                            player: player,
                            position: -1,
                            index: 0,
                        };
                    }
                    players[playerKey].position += move.distance;
                    players[playerKey].index = i;
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < actionIndex && i < this.actions.length; i++) {
            _loop_1(i);
        }
        var playersKeys = Object.keys(players);
        playersKeys
            .sort(function (a, b) { return players[a].index - players[b].index; })
            .forEach(function (key) {
            var playerObject = players[key];
            var step = board.path[playerObject.position];
            var spotFound = false;
            for (var i = 0; i < step.spots.length; i++) {
                var spot = step.spots[i];
                if (spot.content === null) {
                    spot.content = playerObject.player;
                    spotFound = true;
                    break;
                }
            }
            if (!spotFound) {
                var _spot = step.spots[0].clone();
                _spot.content = playerObject.player;
                step.spots.push(_spot);
            }
        });
        return board.path;
    };
    Board.prototype.getRunnersAfterFilteringStepType = function (includeType, type) {
        var players = {};
        var board = this.render();
        var boardFilteredWithType = !type
            ? board
            : includeType
                ? board.filter(function (step) { return step.type === type; })
                : board.filter(function (step) { return step.type !== type; });
        boardFilteredWithType.forEach(function (step) {
            step.spots.forEach(function (spot) {
                if (spot.content !== null) {
                    if (!players[spot.content.playerID]) {
                        players[spot.content.playerID] = [];
                    }
                    players[spot.content.playerID].push(spot.content.runnerID);
                }
            });
        });
        return players;
    };
    Board.prototype.getNextStartingBlockPosition = function () {
        var board = this.render();
        var i = 0;
        while (i < board.length &&
            board[i].type === "start" &&
            !this.isStepFull(i)) {
            i++;
        }
        return i;
    };
    Board.prototype.isStepFull = function (i) {
        var board = this.render();
        if (i < 0 || i >= board.length)
            return false;
        var full = true;
        board[i].spots.forEach(function (spot) {
            if (spot.content === null)
                full = false;
        });
        return full;
    };
    Board.prototype.isStepEmpty = function (i) {
        var board = this.render();
        if (i < 0 || i >= board.length)
            return false;
        var empty = true;
        board[i].spots.forEach(function (spot) {
            if (spot.content !== null)
                empty = false;
        });
        return empty;
    };
    Board.prototype.getRunnersPosition = function () {
        var players = {};
        var board = this.render();
        var i = 0;
        board.forEach(function (step) {
            step.spots.reverse().forEach(function (spot) {
                i++;
                if (spot.content !== null) {
                    if (!players[spot.content.playerID]) {
                        players[spot.content.playerID] = {};
                    }
                    players[spot.content.playerID][spot.content.runnerID] = i;
                }
            });
        });
        return players;
    };
    Board.prototype.getDistanceForRunner = function (player, shouldReverseBoard) {
        var board = shouldReverseBoard ? this.render().reverse() : this.render();
        var d = 0;
        for (var i = 0; i < board.length; i++) {
            var step = board[i];
            if (step.type !== "start" &&
                step.type !== "end" &&
                step.type !== "shoot") {
                d++;
            }
            for (var j = 0; j < step.spots.length; j++) {
                var spot = step.spots[j];
                if (spot.content !== null &&
                    spot.content.playerID === player.playerID &&
                    spot.content.runnerID === player.runnerID) {
                    return d;
                }
            }
        }
        return d;
    };
    Board.prototype.getRunnersWhoCanPickCard = function (playerID, runners) {
        // Filter Not In END
        var allRunnersInEnd = this.getRunnersInType("end");
        var runnersNotInEnd = allRunnersInEnd[playerID]
            ? runners.filter(function (runner) { return allRunnersInEnd[playerID].indexOf(runner.id) === -1; })
            : runners;
        // Sort by position
        var runnersPosition = this.getRunnersPosition();
        var runnersSorted = runnersPosition[playerID]
            ? runnersNotInEnd.sort(function (a, b) {
                var _a = runnersPosition[playerID][a.id] || 0;
                var _b = runnersPosition[playerID][b.id] || 0;
                return _b - _a;
            })
            : runnersNotInEnd;
        // Take first
        return runnersSorted.splice(0, 1);
    };
    Board.prototype.getRunnersWhoCanShoot = function (playerID, runners) {
        // Filter In SHOOT
        var allRunnersInShoot = this.getRunnersInType("shoot");
        var runnersInShoot = allRunnersInShoot[playerID]
            ? runners.filter(function (runner) { return allRunnersInShoot[playerID].indexOf(runner.id) >= 0; })
            : [];
        // Sort by position
        var runnersPosition = this.getRunnersPosition();
        var runnersSorted = runnersPosition[playerID]
            ? runnersInShoot.sort(function (a, b) {
                var _a = runnersPosition[playerID][a.id] || 0;
                var _b = runnersPosition[playerID][b.id] || 0;
                return _b - _a;
            })
            : runnersInShoot;
        // Take first
        return runnersSorted.splice(0, 1);
    };
    return Board;
}());
export { Board };
var MapSpot = /** @class */ (function () {
    function MapSpot(spot) {
        this.content = null;
        if (spot && spot.content)
            this.content = spot.content;
    }
    MapSpot.prototype.clone = function () {
        return new MapSpot({ content: _.cloneDeep(this.content) });
    };
    return MapSpot;
}());
export { MapSpot };
var MapStep = /** @class */ (function () {
    function MapStep(step) {
        this.spots = [];
        this.type = null;
        if (step && step.spots)
            this.spots = step.spots.map(function (spot) { return new MapSpot(spot); });
        if (step && step.type)
            this.type = step.type;
    }
    MapStep.prototype.addSpots = function (n) {
        var spots = Array(n).fill(null);
        this.spots = this.spots.concat(spots.map(function () { return new MapSpot(); }));
        return this;
    };
    MapStep.prototype.clone = function () {
        var step = new MapStep({
            spots: _.cloneDeep(this.spots),
            type: this.type,
        });
        return step;
    };
    return MapStep;
}());
export { MapStep };
var Map = /** @class */ (function () {
    function Map(map) {
        this.path = [];
        if (map && map.path)
            this.path = map.path.map(function (step) { return new MapStep(step); });
    }
    Map.prototype.addCells = function (n, type) {
        this.path.push(new MapStep({ type: type }).addSpots(n));
        return this;
    };
    Map.prototype.clone = function () {
        var map = new Map({ path: _.cloneDeep(this.path) });
        return map;
    };
    Map.prototype.resetPath = function () {
        this.path = [];
    };
    Map.prototype.addStartingBlocks = function (numberOfRunners, startingBlockWidth) {
        var spots = 0;
        while (spots < numberOfRunners) {
            this.addCells(startingBlockWidth, "start");
            spots += startingBlockWidth;
        }
    };
    Map.prototype.addMapData = function (mapData) {
        var _this = this;
        mapData.path.forEach(function (block) {
            for (var i = 0; i < block.numberOfSteps; i++) {
                _this.addCells(block.stepWidth, block.type);
            }
        });
    };
    Map.prototype.addFinish = function (numberOfRunners) {
        var spots = 0;
        var lines = 0;
        while (spots < numberOfRunners || lines < MAX_CARD_VALUE) {
            this.addCells(2, "end");
            spots += 2;
            lines += 1;
        }
    };
    Map.prototype.init = function (numberOfPlayers, numberOfRunnersPerPlayer, startingBlockWidth, mapString) {
        var mapData = new MapData().loadFromString(mapString);
        var numberOfRunners = numberOfRunnersPerPlayer * numberOfPlayers;
        this.resetPath();
        this.addStartingBlocks(numberOfRunners, startingBlockWidth);
        this.addMapData(mapData);
        this.addFinish(numberOfRunners);
        return this;
    };
    return Map;
}());
var Move = /** @class */ (function () {
    function Move(player, distance, metadata) {
        this.player = player;
        this.distance = distance;
        this.metadata = metadata;
    }
    return Move;
}());
export { Move };
var Action = /** @class */ (function () {
    function Action(moves, name) {
        this.moves = [];
        this.moves = moves;
        this.name = name;
    }
    return Action;
}());
export { Action };
var BoardPlayer = /** @class */ (function () {
    function BoardPlayer(playerID, runnerID, type) {
        this.playerID = +playerID;
        this.runnerID = +runnerID;
        this.type = type;
    }
    return BoardPlayer;
}());
export { BoardPlayer };
//# sourceMappingURL=index.js.map
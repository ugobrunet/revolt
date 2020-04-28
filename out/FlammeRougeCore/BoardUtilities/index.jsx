import { Player } from "../Deck";
export var isStepEmpty = function (step) {
    return !step.spots.some(function (spot) { return spot.content !== null; });
};
export var getPlayersFromGPlayers = function (players) {
    var _players = {};
    var playersKeys = Object.keys(players);
    playersKeys.forEach(function (id) { return (_players[+id] = new Player(players[id])); });
    return _players;
};
export var getPlayersWhoShouldPickCard = function (board, players) {
    var _players = {};
    var playersKeys = Object.keys(players);
    playersKeys.forEach(function (id) {
        var player = players[id];
        _players[+id] = {
            runners: board.getRunnersWhoCanPickCard(+id, player.getRunnersWhoDidNotPickedCard()),
        };
    });
    return _players;
};
export var getPlayersWhoShouldShoot = function (board, players) {
    var _players = {};
    var playersKeys = Object.keys(players);
    playersKeys.forEach(function (id) {
        var player = players[id];
        _players[+id] = {
            runners: board.getRunnersWhoCanShoot(+id, player.getRunnersWhoDidNotShoot()),
        };
    });
    return _players;
};
//# sourceMappingURL=index.jsx.map
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { prettify } from "../Utils";
export var getPlayers = function (_game, _gameList) {
    var _players = [];
    var _playersId = [];
    _gameList.forEach(function (e) {
        if (e.game.name === _game) {
            var min = e.game.minPlayers || 2;
            var max = e.game.maxPlayers || 10;
            _playersId = [];
            for (var i = min; i <= max; i++) {
                _playersId.push(i);
            }
        }
    });
    if (_playersId.length === 0) {
        _playersId = __spreadArrays(Array(10).keys());
    }
    _playersId.forEach(function (e, i) {
        _players.push(<MenuItem key={i} value={e}>
        {e}
      </MenuItem>);
    });
    return _players;
};
export var getPlayer = function (_game, _gameList) {
    var _player = 2;
    _gameList.forEach(function (e) {
        if (e.game.name === _game) {
            _player = e.game.minPlayers || 2;
        }
    });
    return _player;
};
export var getGames = function (_gameList) {
    var _games = [];
    _gameList.forEach(function (e, i) {
        _games.push(<MenuItem key={i} value={e.game.name}>
        {prettify(e.game.name)}
      </MenuItem>);
    });
    return _games;
};
//# sourceMappingURL=utils.js.map
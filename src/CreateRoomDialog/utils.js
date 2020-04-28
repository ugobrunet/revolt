import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { prettify } from "../Utils";

export const getPlayers = (_game, _gameList) => {
  let _players = [];
  let _playersId = [];
  _gameList.forEach(e => {
    if (e.game.name === _game) {
      const min = e.game.minPlayers || 2;
      const max = e.game.maxPlayers || 10;
      _playersId = [];
      for (let i = min; i <= max; i++) {
        _playersId.push(i);
      }
    }
  });
  if (_playersId.length === 0) {
    _playersId = [...Array(10).keys()];
  }
  _playersId.forEach((e, i) => {
    _players.push(
      <MenuItem key={i} value={e}>
        {e}
      </MenuItem>
    );
  });
  return _players;
};

export const getPlayer = (_game, _gameList) => {
  let _player = 2;
  _gameList.forEach(e => {
    if (e.game.name === _game) {
      _player = e.game.minPlayers || 2;
    }
  });
  return _player;
};

export const getGames = _gameList => {
  let _games = [];
  _gameList.forEach((e, i) => {
    _games.push(
      <MenuItem key={i} value={e.game.name}>
        {prettify(e.game.name)}
      </MenuItem>
    );
  });
  return _games;
};

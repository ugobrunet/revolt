import { Player, Runner } from "../Deck";
import { MapStep, Board } from "../Board";

export const isStepEmpty = (step: MapStep) => {
  return !step.spots.some((spot) => spot.content !== null);
};

export const getPlayersFromGPlayers = (players: any) => {
  const _players: { [playerID: number]: Player } = {};
  const playersKeys = Object.keys(players);
  playersKeys.forEach((id) => (_players[+id] = new Player(players[id])));
  return _players;
};

export const getPlayersWhoShouldPickCard = (board: Board, players: any) => {
  const _players: { [playerID: number]: { runners: Runner[] } } = {};

  const playersKeys = Object.keys(players);
  playersKeys.forEach((id) => {
    const player = players[id];
    _players[+id] = {
      runners: board.getRunnersWhoCanPickCard(
        +id,
        player.getRunnersWhoDidNotPickedCard()
      ),
    };
  });

  return _players;
};

export const getPlayersWhoShouldShoot = (board: Board, players: any) => {
  const _players: { [playerID: number]: { runners: Runner[] } } = {};

  const playersKeys = Object.keys(players);
  playersKeys.forEach((id) => {
    const player = players[id];
    _players[+id] = {
      runners: board.getRunnersWhoCanShoot(
        +id,
        player.getRunnersWhoDidNotShoot()
      ),
    };
  });

  return _players;
};

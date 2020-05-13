import { Player, Runner, Deck } from "./Deck";
import {
  Board,
  MapStep,
  MapSpot,
  BoardPlayer,
  Move,
  PlayerDictionnary,
} from "./Board";
import {
  isStepEmpty,
  getPlayersWhoShouldPickCard,
  getPlayersWhoShouldShoot,
  getPlayersFromGPlayers,
} from "./BoardUtilities";
// import { PlayerView } from "boardgame.io/core";
import { Ctx } from "boardgame.io";
import _ from "lodash";
import {
  LAP_LENGTH,
  MIN_DISTANCE_DOWN,
  MAX_DISTANCE_UP,
  CARDS_IN_HAND,
} from "./Settings";

import Maps from "./MapData/maps";
const MapsKeys = Object.keys(Maps);

const IsVictory = (board: Board): boolean => {
  return board.winner ? true : false;
};

const getInitialTurnOrder = (ctx: Ctx): number[] => {
  const { numPlayers, random } = ctx;
  let _order = Array(numPlayers).fill(null);
  for (let i = 0; i < numPlayers; i++) {
    _order[i] = i;
  }
  return random ? random.Shuffle(_order) : _order;
};

const getInitialPlayers = (
  ctx: Ctx,
  numberOfRunnersPerPlayer: number
): PlayerDictionnary<Player> => {
  const { numPlayers } = ctx;
  const _players: PlayerDictionnary<Player> = {};
  for (let i = 0; i < numPlayers; i++) {
    _players[i] = new Player().setRunnersNumber(numberOfRunnersPerPlayer);
  }
  return _players;
};

const loadMap = (
  numberOfPlayers: number,
  mapString: string,
  startingBlockWidth: number,
  numberOfRunnersPerPlayer: number
) => {
  const board: Board = new Board();
  board.map.init(
    numberOfPlayers,
    numberOfRunnersPerPlayer,
    startingBlockWidth,
    mapString
  );

  return board;
};

const SetStartingBlockWidth = (G: any, ctx: Ctx, val: number) => {
  console.log("SetStartingBlockWidth");
  const { mapString, numOfRunnersPerPlayer } = G;
  const { numPlayers } = ctx;

  return {
    ...G,
    board: loadMap(numPlayers, mapString, val, numOfRunnersPerPlayer),
    startingBlockSpots: val,
  };
};

const SetNumberOfRunnersPerPlayer = (G: any, ctx: Ctx, val: number) => {
  console.log("SetNumberOfRunnersPerPlayer");
  const { mapString, startingBlockSpots, players } = G;
  const { numPlayers } = ctx;

  let _newPlayers = {
    ...players,
  };

  for (let i = 0; i < numPlayers; i++) {
    const player = new Player(players[i]);
    player.setRunnersNumber(val);

    _newPlayers = {
      ..._newPlayers,
      [i]: player,
    };
  }

  return {
    ...G,
    board: loadMap(numPlayers, mapString, startingBlockSpots, val),
    numOfRunnersPerPlayer: val,
    players: _newPlayers,
  };
};

const ChooseMap = (G: any, ctx: Ctx, nextIndexIncrement: number) => {
  console.log("NextMap");
  const { selectedMap, startingBlockSpots, numOfRunnersPerPlayer } = G;
  const { numPlayers } = ctx;

  let nextMapIndex = selectedMap + nextIndexIncrement;

  if (nextMapIndex >= MapsKeys.length) {
    nextMapIndex = 0;
  }
  if (nextMapIndex < 0) {
    nextMapIndex = MapsKeys.length - 1;
  }

  const mapString = Maps[MapsKeys[nextMapIndex]].pathSymbols;

  return {
    ...G,
    board: loadMap(
      numPlayers,
      mapString,
      startingBlockSpots,
      numOfRunnersPerPlayer
    ),
    selectedMap: nextMapIndex,
    mapString: mapString,
  };
};

const SetMapString = (G: any, ctx: Ctx, mapString: string) => {
  console.log("SetMapString");
  const { startingBlockSpots, numOfRunnersPerPlayer } = G;
  const { numPlayers } = ctx;

  return {
    ...G,
    board: loadMap(
      numPlayers,
      mapString,
      startingBlockSpots,
      numOfRunnersPerPlayer
    ),
    mapString: mapString,
  };
};

const getMoveInMoves = (spot: MapSpot, moves: Move[]) => {
  if (spot.content === null) return null;
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (_.isEqual(move.player, spot.content)) return move;
  }
  return null;
};

const hasFreeSpot = (step: MapStep) => {
  for (let i = 0; i < step.spots.length; i++) {
    const spot = step.spots[i];
    if (spot.content === null) return true;
  }
  return false;
};

const makeMove = (_moves: Move[], _board: Board) => {
  let currentBoard = _board.render();

  for (let i = currentBoard.length - 1; i >= 0; i--) {
    const step = currentBoard[i];
    for (let j = 0; j < step.spots.length; j++) {
      const spot = step.spots[j];
      const move = getMoveInMoves(spot, _moves);
      if (move !== null) {
        let distance = 0;
        let _endOfShootingRange = 0;
        const isShooting = move.metadata && move.metadata.shots;
        if (isShooting) {
          const shotResult = Math.max(
            0,
            move.metadata.shots.reduce(
              (a: number, c: any) => a + (c.success ? LAP_LENGTH : 0),
              0
            ) + Deck.getShootingVelocityPenalty(move.metadata.shootVelocity)
          );

          while (currentBoard[_endOfShootingRange + 1 + i].type === "shoot") {
            _endOfShootingRange++;
          }

          distance = _endOfShootingRange + shotResult;
        } else {
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
        const MAX_UP = move.player.type === "Climber" ? 6 : MAX_DISTANCE_UP;
        for (let k = 0; k < currentBoard.length - i && k <= distance; k++) {
          const _step = currentBoard[k + i];
          if (_step.type === "up") {
            distance = Math.min(distance, Math.max(k - 1, MAX_UP));
            break;
          }
        }

        // SHOOTING
        if (step.type !== "shoot") {
          for (let k = distance; k > 0; k--) {
            const _step = currentBoard[k + i];
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
            _board.addAction(
              [new Move(move.player, 0, move.metadata)],
              "shooting"
            );
            _board.addAction(
              [new Move(move.player, distance, move.metadata)],
              "shot"
            );
          } else {
            const action = "played";
            _board.addAction(
              [new Move(move.player, distance, { pickedCard: move.distance })],
              action
            );
          }

          currentBoard = _board.render();
        }
      }
    }
  }

  return _board;
};

const MovePlayers = (G: any, ctx: Ctx) => {
  console.log("MovePlayers");
  const { numPlayers } = ctx;
  const _board = new Board(G.board);
  let _moves: Move[] = [];

  for (let i = 0; i < numPlayers; i++) {
    const player = new Player(G.players[i]);
    player.runners.forEach((runner) => {
      if ((runner.deck && runner.deck.pickedCard) || runner.deck.shots) {
        _moves.push(
          new Move(
            new BoardPlayer(i, runner.id, runner.type),
            runner.deck.pickedCard || 0,
            {
              shots: runner.deck.shots,
              shootVelocity: runner.deck.shootVelocity,
            }
          )
        );
      }
    });
  }

  return {
    ...G,
    board: makeMove(_moves, _board),
  };
};

const SortFinishers = (G: any, ctx: Ctx) => {
  console.log("SortFinishers");
  const _board = new Board(G.board);
  let currentBoard = _board.render();

  for (let i = currentBoard.length - 1; i >= 0; i--) {
    const step = currentBoard[i];
    for (let j = 0; j < step.spots.length; j++) {
      const spot = step.spots[j];
      if (spot.content !== null && step.type === "end") {
        let distance = 0;
        while (
          distance + i + 1 < currentBoard.length &&
          hasFreeSpot(currentBoard[distance + i + 1])
        ) {
          distance++;
        }

        if (distance > 0) {
          const action = "finished";
          _board.addAction([new Move(spot.content, distance)], action);
          currentBoard = _board.render();
        }
      }
    }
  }

  return {
    ...G,
    board: _board,
  };
};

const EnterShootingRange = (G: any, ctx: Ctx) => {
  console.log("EnterShootingRange");
  const _board = new Board(G.board);
  const _renderedBoard = _board.render();

  let stepIndex = _renderedBoard.length - 1;
  while (stepIndex >= 0) {
    const spotType = _renderedBoard[stepIndex].type;
    if (spotType === "shoot" && !isStepEmpty(_renderedBoard[stepIndex])) {
      let followerIndex = 1;
      const moves: Move[] = [];
      while (
        stepIndex - followerIndex >= 0 &&
        !isStepEmpty(_renderedBoard[stepIndex - followerIndex])
      ) {
        const distance = followerIndex;
        _renderedBoard[stepIndex - followerIndex].spots.forEach((spot) => {
          if (spot.content !== null) {
            moves.push(new Move(spot.content, distance));
          }
        });
        followerIndex++;
      }
      if (moves.length > 0) {
        const action = "enterShootingRange";
        _board.addAction(moves, action);
      }
      stepIndex -= followerIndex;
    }
    stepIndex--;
  }

  return {
    ...G,
    board: _board,
  };
};

const DoSuction = (G: any, ctx: Ctx) => {
  console.log("DoSuction");
  let _newBoard = new Board(G.board);

  let suctionFound = true;
  while (suctionFound) {
    suctionFound = false;
    const currentBoard = _newBoard.render();
    const players: BoardPlayer[] = [];
    let nullStepFound = false;
    for (let i = 0; i < currentBoard.length; i++) {
      const step = currentBoard[i];
      const stepIsEmpty = isStepEmpty(step);
      if (nullStepFound) {
        if (!stepIsEmpty) {
          suctionFound = true;
          break;
        } else {
          players.splice(0, players.length);
          nullStepFound = false;
        }
      } else {
        const _type = step.type;
        if (_type === "up" || _type === "end" || _type === "shoot") {
          players.splice(0, players.length);
        } else {
          if (!stepIsEmpty) {
            step.spots.forEach((spot) => {
              if (spot.content !== null) players.push(spot.content);
            });
          } else {
            if (players.length > 0) {
              nullStepFound = true;
            }
          }
        }
      }
    }
    if (suctionFound) {
      const moves = players.map((player) => new Move(player, 1));
      _newBoard.addAction(moves, "suction");
    }
  }

  return {
    ...G,
    board: _newBoard,
  };
};

const DoFatigue = (G: any, ctx: Ctx) => {
  console.log("DoFatigue");
  const { numPlayers } = ctx;

  const _newBoard = new Board(G.board);

  const _rBoard = _newBoard.render();

  const _fatiguePlayers: BoardPlayer[] = [];

  let stepAheadIsEmpty = false;
  for (let i = _rBoard.length - 1; i >= 0; i--) {
    const step = _rBoard[i];
    if (step.type !== "shoot") {
      if (stepAheadIsEmpty && !isStepEmpty(step)) {
        step.spots.forEach((spot) => {
          if (spot.content !== null) {
            const runnerID = spot.content.runnerID;
            const player = new Player(G.players[spot.content.playerID]);
            const runner = player.runners.find(
              (runner) => runner.id === runnerID
            );
            if (
              runner &&
              (runner.deck.pickedCard !== null || runner.deck.shots !== null)
            ) {
              _fatiguePlayers.push(spot.content);
            }
          }
        });
      }
    }

    stepAheadIsEmpty = isStepEmpty(step);
  }

  if (_fatiguePlayers.length > 0) {
    const moves = _fatiguePlayers.map((player) => new Move(player, 0));
    _newBoard.addAction(moves, "fatigue");
  }

  let _newPlayers = {
    ...G.players,
  };

  for (let i = 0; i < numPlayers; i++) {
    const player = new Player(G.players[i]);
    player.runners.forEach((runner) => {
      if (
        _fatiguePlayers.some(
          (p) => p.playerID === i && p.runnerID === runner.id
        )
      ) {
        runner.deck.takeFatigue();
      }
    });

    _newPlayers = {
      ..._newPlayers,
      [i]: player,
    };
  }

  return {
    ...G,
    board: _newBoard,
    players: _newPlayers,
  };
};

const PickCard = (G: any, ctx: Ctx, index: number) => {
  console.log("Picking Card");
  const { playerID } = ctx;
  const { board } = G;

  if (playerID === undefined) {
    return {
      ...G,
    };
  }

  const player = new Player(G.players[playerID]);
  const runner = player.selectedRunner;

  if (runner === null) {
    return {
      ...G,
    };
  }

  const spotType = new Board(board).getSpotTypeForRunner(+playerID, runner);

  player.pickCard(runner, index, spotType);

  return {
    ...G,
    players: {
      ...G.players,
      [playerID]: player,
    },
  };
};

const ResetSelectedRunner = (G: any, ctx: Ctx) => {
  console.log("ResetSelectedRunner");
  const { playerID } = ctx;

  if (playerID === undefined) {
    return {
      ...G,
    };
  }

  const player = new Player(G.players[playerID]);
  player.resetSelectedRunner();

  return {
    ...G,
    players: {
      ...G.players,
      [playerID]: player,
    },
  };
};

const TakeCardsInHand = (G: any, ctx: Ctx) => {
  console.log("TakeCardsInHand");
  const { playerID, random } = ctx;
  const { board } = G;

  if (playerID === undefined) {
    return {
      ...G,
    };
  }

  const player = new Player(G.players[playerID]);
  const runnerId = player.selectedRunner;

  if (runnerId === null) {
    return {
      ...G,
    };
  }

  const _board = new Board(board);
  const spotType = _board.getSpotTypeForRunner(+playerID, runnerId);

  player.takeCardsInHand(runnerId, CARDS_IN_HAND, spotType, random);

  return {
    ...G,
    players: {
      ...G.players,
      [playerID]: player,
    },
  };
};

const ProcessGiftBasedOnPosition = (G: any, ctx: Ctx) => {
  console.log("ProcessGiftBasedOnPosition");
  const { playerID, random } = ctx;
  const { board } = G;

  if (playerID === undefined) {
    return {
      ...G,
    };
  }

  const player = new Player(G.players[playerID]);
  const runnerId = player.selectedRunner;

  if (runnerId === null) {
    return {
      ...G,
    };
  }

  const runner = player.runners.find((runner) => runner.id === runnerId);

  if (runner && (runner.type === "Relay" || runner.type === "Finisher")) {
    const _board = new Board(board);
    const boardPlayer = new BoardPlayer(+playerID, runner.id, runner.type);
    const distanceFromStart = _board.distanceFromStart(boardPlayer);
    const distanceToEnd = _board.distanceToEnd(boardPlayer);
    const boardDifficulty = _board.getDifficulty();

    player.processGift(
      runnerId,
      distanceFromStart,
      distanceToEnd,
      boardDifficulty,
      random
    );
  }

  return {
    ...G,
    players: {
      ...G.players,
      [playerID]: player,
    },
  };
};

const ProcessHeartBeats = (G: any, ctx: Ctx) => {
  console.log("ProcessHeartBeats");
  const { numPlayers } = ctx;
  let _newPlayers = {
    ...G.players,
  };

  for (let i = 0; i < numPlayers; i++) {
    const player = new Player(G.players[i]);
    player.processHeartBeats();

    _newPlayers = {
      ..._newPlayers,
      [i]: player,
    };
  }

  return {
    ...G,
    players: _newPlayers,
  };
};

const ResetPickedCards = (G: any, ctx: Ctx) => {
  console.log("ResetPickedCards");
  const { numPlayers } = ctx;
  let _newPlayers = {
    ...G.players,
  };

  for (let i = 0; i < numPlayers; i++) {
    const player = new Player(G.players[i]);
    player.resetPickedCards();

    _newPlayers = {
      ..._newPlayers,
      [i]: player,
    };
  }

  return {
    ...G,
    players: _newPlayers,
  };
};

const ResetShots = (G: any, ctx: Ctx) => {
  console.log("ResetShots");
  const { numPlayers } = ctx;
  let _newPlayers = {
    ...G.players,
  };

  for (let i = 0; i < numPlayers; i++) {
    const player = new Player(G.players[i]);
    player.resetShots();

    _newPlayers = {
      ..._newPlayers,
      [i]: player,
    };
  }

  return {
    ...G,
    players: _newPlayers,
  };
};

const ResetSelectedRunnerForAllPlayers = (G: any, ctx: Ctx) => {
  console.log("ResetSelectedRunnerForAllPlayers");
  const { numPlayers } = ctx;
  let _newPlayers = {
    ...G.players,
  };

  for (let i = 0; i < numPlayers; i++) {
    const player = new Player(G.players[i]);
    player.resetSelectedRunner();

    _newPlayers = {
      ..._newPlayers,
      [i]: player,
    };
  }

  return {
    ...G,
    players: _newPlayers,
  };
};

const SelectRunner = (G: any, ctx: Ctx, id: number) => {
  console.log("SelectRunner");
  const { playerID } = ctx;

  if (playerID === undefined) {
    return {
      ...G,
    };
  }

  const player = new Player(G.players[playerID]);
  player.selectRunner(id);

  return {
    ...G,
    players: {
      ...G.players,
      [playerID]: player,
    },
  };
};

const Shoot = (G: any, ctx: Ctx, velocity: number) => {
  console.log("Shoot");
  const { playerID, random } = ctx;

  if (playerID === undefined) {
    return {
      ...G,
    };
  }

  const player = new Player(G.players[playerID]);
  const runner = player.selectedRunner;

  if (runner === null) {
    return {
      ...G,
    };
  }

  player.shootWithRunner(runner, velocity, random);

  return {
    ...G,
    players: {
      ...G.players,
      [playerID]: player,
    },
  };
};

const PlaceRunner = (G: any, ctx: Ctx, type: string) => {
  console.log("PlaceRunner");
  const { playerID, random } = ctx;

  if (playerID === undefined) {
    return {
      ...G,
    };
  }

  const player = new Player(G.players[playerID]);
  const board = new Board(G.board);
  const runnerID = player.initNextRunner(type, board.getDifficulty());

  if (runnerID === null) {
    return {
      ...G,
    };
  }

  player.shuffleRunner(runnerID, random);

  const boardPlayer = new BoardPlayer(+playerID, runnerID, type);
  board.placeRunner(boardPlayer);

  return {
    ...G,
    board: board,
    players: {
      ...G.players,
      [playerID]: player,
    },
  };
};

const ShuffleTurnOrder = (G: any, ctx: Ctx) => {
  const { turn, random } = ctx;
  const { order, turnOnPhaseBegin } = G;

  if (random !== undefined && (turn - turnOnPhaseBegin) % order.length === 0) {
    console.log("ShuffleTurnOrder");
    return {
      ...G,
      order: random.Shuffle(order),
    };
  } else {
    return {
      ...G,
    };
  }
};

const ShouldEndPhasePlaceRunner = (G: any) => {
  let shouldEnd = true;
  // const players = Object.keys(G.players);
  const board = new Board(G.board);
  const playersOnBoard = board.getRunnersInType();
  const playersKeys = Object.keys(G.players);
  playersKeys
    // .map((player) => playersOnBoard[player])
    .forEach((id: string) => {
      const player = new Player(G.players[id]);
      const runnersNotOnBoard = player.runners.filter(
        (runner: Runner) =>
          !runner ||
          !runner.deck ||
          !playersOnBoard[+id] ||
          playersOnBoard[+id].indexOf(runner.id) === -1
      );
      shouldEnd = shouldEnd && runnersNotOnBoard.length === 0;
    });
  return shouldEnd;
};

const ShouldEndPhasePick = (G: any) => {
  let shouldEnd = true;

  const board = new Board(G.board);
  const players = getPlayersFromGPlayers(G.players);

  const playersWhoPickCard = getPlayersWhoShouldPickCard(board, players);
  const keys = Object.keys(playersWhoPickCard);

  keys.forEach((id) => {
    const runners = playersWhoPickCard[+id].runners;
    if (runners.length > 0) {
      shouldEnd = false;
    }
  });
  return shouldEnd;
};

const ShouldEndPhaseShoot = (G: any) => {
  let shouldEnd = true;

  const board = new Board(G.board);
  const players = getPlayersFromGPlayers(G.players);

  const playersWhoShouldShoot = getPlayersWhoShouldShoot(board, players);
  const keys = Object.keys(playersWhoShouldShoot);

  keys.forEach((id) => {
    const runners = playersWhoShouldShoot[+id].runners;
    if (runners.length > 0) {
      shouldEnd = false;
    }
  });
  return shouldEnd;
};

const DEFAULT_STARTING_BLOCK_SPOT = 2;
const DEFAULT_NUMBER_OF_RUNNER_PER_PLAYER = 2;

const FlammeRouge = {
  name: "flamme_rouge",
  minPlayers: 2,

  setup: (ctx: Ctx) => ({
    startingBlockSpots: DEFAULT_STARTING_BLOCK_SPOT,
    turnOnPhaseBegin: 0,
    order: getInitialTurnOrder(ctx),
    selectedMap: 0,
    mapString: Maps[MapsKeys[0]].pathSymbols,
    board: loadMap(
      ctx.numPlayers,
      Maps[MapsKeys[0]].pathSymbols,
      DEFAULT_STARTING_BLOCK_SPOT,
      DEFAULT_NUMBER_OF_RUNNER_PER_PLAYER
    ),
    numOfRunnersPerPlayer: DEFAULT_NUMBER_OF_RUNNER_PER_PLAYER,
    players: getInitialPlayers(ctx, DEFAULT_NUMBER_OF_RUNNER_PER_PLAYER),
  }),

  phases: {
    SelectMap: {
      start: true,
      moves: {
        enterManualMapMode: (G: any, ctx: Ctx) => {
          if (ctx && ctx.events && ctx.events.setPhase)
            ctx.events.setPhase("ManualMap");
          return { ...G };
        },
        setStartingBlockSpots: (G: any, ctx: Ctx, val: number) => {
          G = { ...SetStartingBlockWidth(G, ctx, val) };
          return { ...G };
        },
        setNumberOfRunnersPerPlayer: (G: any, ctx: Ctx, val: number) => {
          G = { ...SetNumberOfRunnersPerPlayer(G, ctx, val) };
          return { ...G };
        },
        previousMap: (G: any, ctx: Ctx) => {
          G = { ...ChooseMap(G, ctx, -1) };
          return { ...G };
        },
        nextMap: (G: any, ctx: Ctx) => {
          G = { ...ChooseMap(G, ctx, 1) };
          return { ...G };
        },
        selectMap: (G: any, ctx: Ctx) => {
          if (ctx && ctx.events && ctx.events.endPhase) ctx.events.endPhase();
          return { ...G };
        },
      },
      onBegin: (G: any, ctx: Ctx) => {
        console.log("Beginning phase SelectMap");
        if (ctx && ctx.events && ctx.events.setActivePlayers)
          ctx.events.setActivePlayers({ all: "SelectMap" });
      },
      next: "PlaceRunner",
    },
    ManualMap: {
      moves: {
        enterSelectMapMode: (G: any, ctx: Ctx) => {
          if (ctx && ctx.events && ctx.events.setPhase)
            ctx.events.setPhase("SelectMap");
          return { ...G };
        },
        setStartingBlockSpots: (G: any, ctx: Ctx, val: number) => {
          G = { ...SetStartingBlockWidth(G, ctx, val) };
          return { ...G };
        },
        setNumberOfRunnersPerPlayer: (G: any, ctx: Ctx, val: number) => {
          G = { ...SetNumberOfRunnersPerPlayer(G, ctx, val) };
          return { ...G };
        },
        setMapString: (G: any, ctx: Ctx, mapString: string) => {
          G = { ...SetMapString(G, ctx, mapString) };
          console.log("MapString:", mapString);
          return { ...G };
        },
        selectMap: (G: any, ctx: Ctx) => {
          if (ctx && ctx.events && ctx.events.endPhase) ctx.events.endPhase();
          return { ...G };
        },
      },
      onBegin: (G: any, ctx: Ctx) => {
        console.log("Beginning phase SelectMap");
        if (ctx && ctx.events && ctx.events.setActivePlayers)
          ctx.events.setActivePlayers({ all: "ManualMap" });
      },
      next: "PlaceRunner",
    },
    PlaceRunner: {
      moves: {
        placeRunner: (G: any, ctx: Ctx, type: string) => {
          G = { ...PlaceRunner(G, ctx, type) };
          G = { ...ShuffleTurnOrder(G, ctx) };
          return { ...G };
        },
      },
      endIf: ShouldEndPhasePlaceRunner,
      turn: {
        moveLimit: 1,
        order: {
          first: (G: any, ctx: Ctx) => {
            const { order } = G;
            return order[0];
          },
          next: (G: any, ctx: Ctx) => {
            const { order, turnOnPhaseBegin } = G;
            const { turn } = ctx;
            return order[(turn - turnOnPhaseBegin) % order.length];
          },
        },
      },
      onBegin: (G: any, ctx: Ctx) => {
        console.log("Beginning phase PlaceRunner");
        return { ...G, turnOnPhaseBegin: ctx.turn };
      },
      next: "Pick",
    },
    Pick: {
      moves: {
        selectRunner: (G: any, ctx: Ctx, id: number) => {
          G = { ...SelectRunner(G, ctx, id) };
          G = { ...ProcessGiftBasedOnPosition(G, ctx) };
          G = { ...TakeCardsInHand(G, ctx) };
          return { ...G };
        },
        pickCard: (G: any, ctx: Ctx, index: number) => {
          G = { ...PickCard(G, ctx, index) };
          G = { ...ResetSelectedRunner(G, ctx) };
          return { ...G };
        },
      },
      next: "Shoot",
      endIf: ShouldEndPhasePick,
      onBegin: (G: any, ctx: Ctx) => {
        console.log("Beginning phase Pick");
        G = { ...ResetSelectedRunnerForAllPlayers(G, ctx) };
        if (ctx && ctx.events && ctx.events.setActivePlayers)
          ctx.events.setActivePlayers({ all: "Pick" });
        return { ...G };
      },
      onEnd: (G: any, ctx: Ctx) => {
        console.log("Ending phase Pick");
        G = { ...MovePlayers(G, ctx) };
        G = { ...SortFinishers(G, ctx) };
        G = { ...DoSuction(G, ctx) };
        G = { ...EnterShootingRange(G, ctx) };
        G = { ...DoFatigue(G, ctx) };
        G = { ...ProcessHeartBeats(G, ctx) };
        G = { ...ResetPickedCards(G, ctx) };
        return { ...G };
      },
    },
    Shoot: {
      moves: {
        selectShootingRunner: (G: any, ctx: Ctx, id: number) => {
          console.log("selectShootingRunner");
          G = { ...SelectRunner(G, ctx, id) };
          G = { ...ProcessGiftBasedOnPosition(G, ctx) };
          return { ...G };
        },
        shoot: (G: any, ctx: Ctx, velocity: number) => {
          console.log("shoot");
          G = { ...Shoot(G, ctx, velocity) };
          G = { ...ResetSelectedRunner(G, ctx) };
          return { ...G };
        },
      },
      next: "Pick",
      endIf: ShouldEndPhaseShoot,
      onBegin: (G: any, ctx: Ctx) => {
        console.log("Beginning phase Shoot");
        if (ctx && ctx.events && ctx.events.setActivePlayers)
          ctx.events.setActivePlayers({ all: "Shoot" });
        return { ...G };
      },
      onEnd: (G: any, ctx: Ctx) => {
        console.log("Ending phase Shoot");
        G = { ...MovePlayers(G, ctx) };
        G = { ...SortFinishers(G, ctx) };
        G = { ...DoSuction(G, ctx) };
        G = { ...EnterShootingRange(G, ctx) };
        G = { ...DoFatigue(G, ctx) };
        G = { ...ResetShots(G, ctx) };
        return { ...G };
      },
    },
  },

  ai: {
    enumerate: (G: any, ctx: Ctx) => {},
  },

  // playerView: PlayerView.STRIP_SECRETS,

  endIf: (G: any, ctx: Ctx) => {
    if (IsVictory(G.board)) {
      return { winner: ctx.currentPlayer };
    }
  },
};

FlammeRouge.minPlayers = 2;

export default FlammeRouge;

import { MapData } from "../MapData";
import { isStepEmpty } from "../BoardUtilities";
import { LAP_LENGTH, SHOOTINGS, MAX_CARD_VALUE } from "../Settings";
import { Runner } from "../Deck";
import _ from "lodash";

export type PlayerDictionnary<T> = {
  [playerID: number]: T;
};

export type RunnerDictionnary<T> = {
  [runnerID: number]: T;
};

export type RenderedBoard = MapStep[];

export class Board {
  winner: Array<BoardPlayer> | null = null;
  actions: Array<Action> = [];
  map = new Map(null);
  constructor(board?: any) {
    if (board && board.actions) this.actions = board.actions;
    if (board && board.map) this.map = new Map(board.map).clone();
    if (board && board.winner) this.winner = board.winner;
  }
  isEqual(b: Board) {
    return (
      b.map &&
      b.actions &&
      _.isEqual(this.map, b.map) &&
      _.isEqual(this.actions, b.actions)
    );
  }
  getDifficulty(): number {
    return this.map.path.reduce((a, c) => {
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
  }
  addSpot(stepIndex: number): Board {
    this.map.path[stepIndex].spots.push(new MapSpot());
    return this;
  }
  addAction(moves: Array<Move>, name: string): Board {
    this.actions = this.actions.concat([new Action(moves, name)]);

    if (this.winner === null) {
      const playersFinished = this.getRunnersInType("end");
      const finishedKeys = Object.keys(playersFinished);
      const playersOnCourse = this.getRunnersNotInType("end");
      const onCourseKeys = Object.keys(playersOnCourse);
      if (finishedKeys.length > 0 && onCourseKeys.length < 2) {
        this.winner = this.getWinners();
      }
    }

    return this;
  }
  getWinners(): Array<BoardPlayer> {
    const winners: Array<BoardPlayer> = [];
    const board = this.render();
    board
      // .filter((step) => step[0].type === "end")
      .reverse()
      .forEach((step) => {
        step.spots.forEach((spot) => {
          if (spot.content !== null) {
            winners.push(spot.content);
          }
        });
      });
    return winners;
  }
  render(actionIndex?: number): RenderedBoard {
    const board = new Map(this.map).clone();

    actionIndex = actionIndex || this.actions.length;
    const players: {
      [playerKey: string]: {
        player: BoardPlayer;
        position: number;
        index: number;
      };
    } = {};
    for (let i = 0; i < actionIndex && i < this.actions.length; i++) {
      const action = this.actions[i];
      action.moves.forEach((move) => {
        if (move.distance > 0) {
          const player = move.player;
          const playerKey = player.playerID + player.type + player.runnerID;
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
    }

    const playersKeys = Object.keys(players);
    playersKeys
      .sort((a, b) => players[a].index - players[b].index)
      .forEach((key) => {
        const playerObject = players[key];
        const step = board.path[playerObject.position];
        let spotFound = false;
        for (let i = 0; i < step.spots.length; i++) {
          const spot = step.spots[i];
          if (spot.content === null) {
            spot.content = playerObject.player;
            spotFound = true;
            break;
          }
        }
        if (!spotFound) {
          const _spot = step.spots[0].clone();
          _spot.content = playerObject.player;
          step.spots.push(_spot);
        }
      });

    return board.path;
  }
  renderWithoutUnusedLaps = (actionIndex?: number): RenderedBoard => {
    const board = this.render(actionIndex);
    let lastType = null;
    for (let i = 0; i < board.length; i++) {
      const type = board[i].type;
      if (type === "lap" && lastType !== "lap") {
        while (
          isStepEmpty(board[i]) &&
          i < board.length &&
          board[i].type === "lap"
        ) {
          board.splice(i, 1);
        }
      }
      lastType = type;
    }
    return board;
  };
  getRunnersInType = (type?: string): PlayerDictionnary<number[]> => {
    return this.getRunnersAfterFilteringStepType(true, type);
  };
  getRunnersNotInType = (type?: string): PlayerDictionnary<number[]> => {
    return this.getRunnersAfterFilteringStepType(false, type);
  };
  getRunnersAfterFilteringStepType(
    includeType: boolean,
    type?: string
  ): PlayerDictionnary<number[]> {
    const players: PlayerDictionnary<number[]> = {};
    const board = this.render();
    const boardFilteredWithType = !type
      ? board
      : includeType
      ? board.filter((step) => step.type === type)
      : board.filter((step) => step.type !== type);

    boardFilteredWithType.forEach((step) => {
      step.spots.forEach((spot) => {
        if (spot.content !== null) {
          if (!players[spot.content.playerID]) {
            players[spot.content.playerID] = [];
          }

          players[spot.content.playerID].push(spot.content.runnerID);
        }
      });
    });
    return players;
  }
  getSpotTypeForRunner = (
    playerID: number,
    runnerID: number | null
  ): string | null => {
    if (runnerID === null) return null;
    const rboard = this.render();
    for (let i = 0; i < rboard.length; i++) {
      const step = rboard[i];
      for (let j = 0; j < step.spots.length; j++) {
        const spot = step.spots[j];
        if (
          spot.content !== null &&
          spot.content.playerID === playerID &&
          spot.content.runnerID === runnerID
        ) {
          return step.type;
        }
      }
    }
    return null;
  };
  placeRunner = (player: BoardPlayer): Board => {
    const _nextStartingBlockPosition = this.getNextStartingBlockPosition();
    const action = "initial";
    this.addAction([new Move(player, _nextStartingBlockPosition)], action);
    return this;
  };
  getNextStartingBlockPosition(): number {
    const board = this.render();
    let i = 0;
    while (
      i < board.length &&
      board[i].type === "start" &&
      !this.isStepFull(i)
    ) {
      i++;
    }
    return i;
  }
  isStepFull(i: number): boolean {
    const board = this.render();
    if (i < 0 || i >= board.length) return false;
    let full = true;
    board[i].spots.forEach((spot) => {
      if (spot.content === null) full = false;
    });
    return full;
  }
  isStepEmpty(i: number): boolean {
    const board = this.render();
    if (i < 0 || i >= board.length) return false;
    let empty = true;
    board[i].spots.forEach((spot) => {
      if (spot.content !== null) empty = false;
    });
    return empty;
  }
  getRunnersPosition(): PlayerDictionnary<RunnerDictionnary<number>> {
    const players: PlayerDictionnary<RunnerDictionnary<number>> = {};
    const board = this.render();
    let i = 0;
    board.forEach((step) => {
      step.spots.reverse().forEach((spot) => {
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
  }
  distanceFromStart = (player: BoardPlayer): number => {
    return this.getDistanceForRunner(player);
  };
  distanceToEnd = (player: BoardPlayer): number => {
    const shouldReverseBoard = true;
    return this.getDistanceForRunner(player, shouldReverseBoard);
  };
  getDistanceForRunner(
    player: BoardPlayer,
    shouldReverseBoard?: boolean
  ): number {
    const board = shouldReverseBoard ? this.render().reverse() : this.render();
    let d = 0;
    for (let i = 0; i < board.length; i++) {
      const step = board[i];
      if (
        step.type !== "start" &&
        step.type !== "end" &&
        step.type !== "shoot"
      ) {
        d++;
      }
      for (let j = 0; j < step.spots.length; j++) {
        const spot = step.spots[j];
        if (
          spot.content !== null &&
          spot.content.playerID === player.playerID &&
          spot.content.runnerID === player.runnerID
        ) {
          return d;
        }
      }
    }
    return d;
  }
  getRunnersWhoCanPickCard(playerID: number, runners: Runner[]): Runner[] {
    // Filter Not In END
    const allRunnersInEnd = this.getRunnersInType("end");

    const runnersNotInEnd = allRunnersInEnd[playerID]
      ? runners.filter(
          (runner) => allRunnersInEnd[playerID].indexOf(runner.id) === -1
        )
      : runners;

    // Sort by position
    const runnersPosition = this.getRunnersPosition();
    const runnersSorted = runnersPosition[playerID]
      ? runnersNotInEnd.sort((a, b) => {
          const _a = runnersPosition[playerID][a.id] || 0;
          const _b = runnersPosition[playerID][b.id] || 0;
          return _b - _a;
        })
      : runnersNotInEnd;

    // Take first
    return runnersSorted.splice(0, 1);
  }
  getRunnersWhoCanShoot(playerID: number, runners: Runner[]): Runner[] {
    // Filter In SHOOT
    const allRunnersInShoot = this.getRunnersInType("shoot");

    const runnersInShoot = allRunnersInShoot[playerID]
      ? runners.filter(
          (runner) => allRunnersInShoot[playerID].indexOf(runner.id) >= 0
        )
      : [];

    // Sort by position
    const runnersPosition = this.getRunnersPosition();
    const runnersSorted = runnersPosition[playerID]
      ? runnersInShoot.sort((a, b) => {
          const _a = runnersPosition[playerID][a.id] || 0;
          const _b = runnersPosition[playerID][b.id] || 0;
          return _b - _a;
        })
      : runnersInShoot;

    // Take first
    return runnersSorted.splice(0, 1);
  }
}

export class MapSpot {
  content: BoardPlayer | null = null;
  constructor(spot?: any) {
    if (spot && spot.content) this.content = spot.content;
  }
  clone(): MapSpot {
    return new MapSpot({ content: _.cloneDeep(this.content) });
  }
}

export class MapStep {
  spots: Array<MapSpot> = [];
  type: string | null = null;
  constructor(step?: any) {
    if (step && step.spots)
      this.spots = step.spots.map((spot: any) => new MapSpot(spot));
    if (step && step.type) this.type = step.type;
  }
  addSpots(n: number): MapStep {
    const spots: null[] = Array(n).fill(null);
    this.spots = this.spots.concat(spots.map(() => new MapSpot()));
    return this;
  }
  clone(): MapStep {
    const step = new MapStep({
      spots: _.cloneDeep(this.spots),
      type: this.type,
    });
    return step;
  }
}

class Map {
  path: Array<MapStep> = [];
  constructor(map?: any) {
    if (map && map.path)
      this.path = map.path.map((step: any) => new MapStep(step));
  }

  addCells(n: number, type?: string): Map {
    this.path.push(new MapStep({ type: type }).addSpots(n));
    return this;
  }

  clone(): Map {
    const map = new Map({ path: _.cloneDeep(this.path) });
    return map;
  }

  resetPath(): void {
    this.path = [];
  }

  addStartingBlocks(numberOfRunners: number, startingBlockWidth: number): void {
    let spots = 0;
    while (spots < numberOfRunners) {
      this.addCells(startingBlockWidth, "start");
      spots += startingBlockWidth;
    }
  }

  addMapData(mapData: MapData): void {
    mapData.path.forEach((block) => {
      for (let i = 0; i < block.numberOfSteps; i++) {
        this.addCells(block.stepWidth, block.type);
      }
    });
  }

  addFinish(numberOfRunners: number): void {
    let spots = 0;
    let lines = 0;
    while (spots < numberOfRunners || lines < MAX_CARD_VALUE) {
      this.addCells(2, "end");
      spots += 2;
      lines += 1;
    }
  }

  init(
    numberOfPlayers: number,
    numberOfRunnersPerPlayer: number,
    startingBlockWidth: number,
    mapString?: string
  ) {
    const mapData = new MapData().loadFromString(mapString);

    const numberOfRunners = numberOfRunnersPerPlayer * numberOfPlayers;

    this.resetPath();
    this.addStartingBlocks(numberOfRunners, startingBlockWidth);
    this.addMapData(mapData);
    this.addFinish(numberOfRunners);

    return this;
  }
}

export class Move {
  player: BoardPlayer;
  distance: number;
  metadata?: any;
  constructor(player: BoardPlayer, distance: number, metadata?: any) {
    this.player = player;
    this.distance = distance;
    this.metadata = metadata;
  }
}

export class Action {
  moves: Array<Move> = [];
  name: string;
  constructor(moves: Array<Move>, name: string) {
    this.moves = moves;
    this.name = name;
  }
}

export class BoardPlayer {
  playerID: number;
  runnerID: number;
  type: string;
  constructor(playerID: number, runnerID: number, type: string) {
    this.playerID = +playerID;
    this.runnerID = +runnerID;
    this.type = type;
  }
}

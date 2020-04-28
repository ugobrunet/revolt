export const LAP_LENGTH = 4;
export const SHOOTINGS = 5;
export const MIN_HEARTBEAT = 80;
export const MIN_PROBABILITY = 80;
export const MAX_HEARTBEAT = 160;
export const MAX_PROBABILITY = 20;
export const VELOCITY_PROBABILITY = 10;
export const MIN_DISTANCE_DOWN = 5;
export const MAX_DISTANCE_UP = 5;
export const CARDS_IN_HAND = 4;
export const MAX_NUMBER_OF_RUNNERS = 10;

export const MAX_CARD_VALUE = 9;

export const VELOCITY_PENALTY = (): number =>
  Math.floor((VELOCITY_PROBABILITY * LAP_LENGTH * SHOOTINGS) / 100);

export const NUMBER_OF_CARDS = (boardDifficulty: number): number =>
  Math.floor((boardDifficulty * 3) / 90) + 1;

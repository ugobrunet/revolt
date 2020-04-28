export var LAP_LENGTH = 4;
export var SHOOTINGS = 5;
export var MIN_HEARTBEAT = 80;
export var MIN_PROBABILITY = 80;
export var MAX_HEARTBEAT = 160;
export var MAX_PROBABILITY = 20;
export var VELOCITY_PROBABILITY = 10;
export var MIN_DISTANCE_DOWN = 5;
export var MAX_DISTANCE_UP = 5;
export var CARDS_IN_HAND = 4;
export var MAX_NUMBER_OF_RUNNERS = 10;
export var MAX_CARD_VALUE = 9;
export var VELOCITY_PENALTY = function () {
    return Math.floor((VELOCITY_PROBABILITY * LAP_LENGTH * SHOOTINGS) / 100);
};
export var NUMBER_OF_CARDS = function (boardDifficulty) {
    return Math.floor((boardDifficulty * 3) / 90) + 1;
};
//# sourceMappingURL=index.js.map
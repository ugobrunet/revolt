import { LAP_LENGTH, SHOOTINGS } from "../Settings";
var MapBlockData = /** @class */ (function () {
    function MapBlockData(numberOfSteps, type, stepWidth) {
        this.numberOfSteps = numberOfSteps;
        this.stepWidth = stepWidth ? stepWidth : 2;
        this.type = type ? type : undefined;
    }
    return MapBlockData;
}());
export { MapBlockData };
var MapData = /** @class */ (function () {
    function MapData() {
        this.path = [];
    }
    MapData.prototype.isEmpty = function () {
        return this.path.length === 0;
    };
    MapData.prototype.loadFromString = function (s) {
        this.path = [];
        if (s) {
            this.parseMapString(s);
        }
        if (this.isEmpty()) {
            this.loadDefaultData();
        }
        return this;
    };
    MapData.prototype.loadDefaultData = function () {
        this.path = [new MapBlockData(4), new MapBlockData(5, "down")];
    };
    MapData.prototype.parseMapString = function (data) {
        for (var i = 0; i < data.length; i++) {
            var char = data.charAt(i);
            var step = null;
            switch (char) {
                case "0":
                    step = [
                        new MapBlockData(1, "shoot"),
                        new MapBlockData(LAP_LENGTH * SHOOTINGS, "lap"),
                    ];
                    break;
                case "a":
                    step = [new MapBlockData(1)];
                    break;
                case "b":
                    step = [new MapBlockData(6)];
                    break;
                case "c":
                    step = [new MapBlockData(6)];
                    break;
                case "d":
                    step = [new MapBlockData(6)];
                    break;
                case "e":
                    step = [new MapBlockData(2)];
                    break;
                case "f":
                    step = [new MapBlockData(6)];
                    break;
                case "g":
                    step = [new MapBlockData(2)];
                    break;
                case "h":
                    step = [new MapBlockData(2)];
                    break;
                case "i":
                    step = [new MapBlockData(2)];
                    break;
                case "j":
                    step = [new MapBlockData(2)];
                    break;
                case "k":
                    step = [new MapBlockData(2)];
                    break;
                case "l":
                    step = [new MapBlockData(6)];
                    break;
                case "m":
                    step = [new MapBlockData(6)];
                    break;
                case "n":
                    step = [new MapBlockData(6)];
                    break;
                case "o":
                    step = [new MapBlockData(2)];
                    break;
                case "p":
                    step = [new MapBlockData(2)];
                    break;
                case "q":
                    step = [new MapBlockData(2)];
                    break;
                case "r":
                    step = [new MapBlockData(2)];
                    break;
                case "s":
                    step = [new MapBlockData(2)];
                    break;
                case "t":
                    step = [new MapBlockData(2)];
                    break;
                case "u":
                    step = [new MapBlockData(2)];
                    break;
                case "A":
                    step = [new MapBlockData(2)];
                    break;
                case "B":
                    step = [new MapBlockData(4, "down"), new MapBlockData(2)];
                    break;
                case "C":
                    step = [new MapBlockData(3), new MapBlockData(3, "up")];
                    break;
                case "D":
                    step = [new MapBlockData(5, "up"), new MapBlockData(1, "down")];
                    break;
                case "E":
                    step = [new MapBlockData(2, "up")];
                    break;
                case "F":
                    step = [new MapBlockData(3, "down"), new MapBlockData(3)];
                    break;
                case "G":
                    step = [new MapBlockData(2, "up")];
                    break;
                case "H":
                    step = [new MapBlockData(2, "down")];
                    break;
                case "I":
                    step = [new MapBlockData(2)];
                    break;
                case "J":
                    step = [new MapBlockData(2)];
                    break;
                case "K":
                    step = [new MapBlockData(2, "up")];
                    break;
                case "L":
                    step = [new MapBlockData(3, "up"), new MapBlockData(3, "down")];
                    break;
                case "M":
                    step = [new MapBlockData(2), new MapBlockData(4, "up")];
                    break;
                case "N":
                    step = [new MapBlockData(6, "up")];
                    break;
                case "O":
                    step = [new MapBlockData(2, "up")];
                    break;
                case "P":
                    step = [new MapBlockData(2, "down")];
                    break;
                case "Q":
                    step = [new MapBlockData(2, "up")];
                    break;
                case "R":
                    step = [new MapBlockData(2, "up")];
                    break;
                case "S":
                    step = [new MapBlockData(2)];
                    break;
                case "T":
                    step = [new MapBlockData(2)];
                    break;
                case "U":
                    step = [new MapBlockData(2, "up")];
                    break;
                default:
                    break;
            }
            if (step !== null)
                this.path = this.path.concat(step);
        }
    };
    return MapData;
}());
export { MapData };
//# sourceMappingURL=index.js.map
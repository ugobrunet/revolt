import { MIN_HEARTBEAT, MAX_HEARTBEAT, MIN_PROBABILITY, MAX_PROBABILITY, VELOCITY_PROBABILITY, VELOCITY_PENALTY, SHOOTINGS, NUMBER_OF_CARDS, } from "../Settings";
var Deck = /** @class */ (function () {
    function Deck(deck) {
        this.cards = [];
        this.stock = [];
        this.hand = [];
        this.used = [];
        this.initialCards = [];
        this.pickedCard = null;
        this.shots = null;
        this.heartBeat = MIN_HEARTBEAT;
        this.heartBeatVariation = 0;
        this.shootVelocity = 0;
        this.type = "default";
        this.gifted = false;
        if (deck && deck.cards)
            this.cards = [].concat(deck.cards);
        if (deck && deck.stock)
            this.stock = [].concat(deck.stock);
        if (deck && deck.hand)
            this.hand = [].concat(deck.hand);
        if (deck && deck.used)
            this.used = [].concat(deck.used);
        if (deck && deck.initialCards)
            this.initialCards = [].concat(deck.initialCards);
        if (deck && deck.pickedCard)
            this.pickedCard = deck.pickedCard;
        if (deck && deck.shots)
            this.shots = deck.shots;
        if (deck && deck.heartBeat)
            this.heartBeat = deck.heartBeat;
        if (deck && deck.heartBeatVariation)
            this.heartBeatVariation = deck.heartBeatVariation;
        if (deck && deck.shootVelocity)
            this.shootVelocity = deck.shootVelocity;
        if (deck && deck.type)
            this.type = deck.type;
        if (deck && deck.gifted)
            this.gifted = deck.gifted;
    }
    Deck.prototype.setType = function (type) {
        this.type = type;
        if (type !== "Relay" && type !== "Finisher")
            this.gifted = true;
        return this;
    };
    Deck.prototype.add = function (value, number) {
        var cards = Array(number).fill(value);
        this.cards = this.cards.concat(cards);
        if (this.initialCards.indexOf(value) === -1) {
            this.initialCards = this.initialCards.concat([value]).sort();
        }
        return this;
    };
    Deck.prototype.shuffle = function (random) {
        console.log("Shuffling");
        if (random)
            this.cards = random.Shuffle(this.cards);
        return this;
    };
    // putHandInDeck() {
    //   this.cards = this.cards.concat(this.hand);
    //   this.hand = [];
    //   return this;
    // }
    Deck.prototype.remainingUsableCards = function (spotType) {
        var _this = this;
        return (this.stock.some(function (e) {
            return _this.getHeartBeatVariationForCard(e, spotType) <=
                MAX_HEARTBEAT - _this.heartBeat;
        }) ||
            this.cards.some(function (e) {
                return _this.getHeartBeatVariationForCard(e, spotType) <=
                    MAX_HEARTBEAT - _this.heartBeat;
            }));
    };
    Deck.prototype.takeCardsInHand = function (n, spotType, random) {
        this.stock = this.stock.concat(this.hand);
        this.hand = [];
        while (this.hand.length < n && this.remainingUsableCards(spotType)) {
            if (this.cards.length === 0) {
                this.cards = this.cards.concat(this.stock);
                this.stock = [];
                this.shuffle(random);
            }
            if (this.cards.length > 0) {
                var card = this.cards.splice(0, 1)[0];
                if (this.getHeartBeatVariationForCard(card, spotType) <=
                    MAX_HEARTBEAT - this.heartBeat) {
                    this.hand = this.hand.concat([card]);
                }
                else {
                    this.stock = this.stock.concat([card]);
                }
            }
        }
        while (this.hand.length < n) {
            this.hand = this.hand.concat([this.fatigueCard()]);
        }
        return this;
    };
    Deck.prototype.getRemainingCards = function () {
        var remainingCards = {};
        var allCards = this.cards.concat(this.stock).concat(this.hand);
        allCards.forEach(function (card) {
            if (!remainingCards[card])
                remainingCards[card] = 0;
            remainingCards[card] = remainingCards[card] + 1;
        });
        return remainingCards;
    };
    Deck.prototype.resetPickedCard = function () {
        this.pickedCard = null;
        return this;
    };
    Deck.prototype.resetShots = function () {
        this.shots = null;
        return this;
    };
    Deck.prototype.pickCard = function (index, spotType) {
        if (index >= 0 && index < this.hand.length) {
            var value = this.hand.splice(index, 1);
            this.used = this.used.concat(value);
            this.pickedCard = value[0];
            // HeartBeat
            var hbVar = this.getHeartBeatVariationForCard(this.pickedCard, spotType);
            this.setHeartBeatVariation(hbVar);
        }
        return this;
    };
    Deck.prototype.getHeartBeatVariationForHand = function (spotType) {
        var _this = this;
        return this.hand.map(function (e) { return _this.getHeartBeatVariationForCard(e, spotType); });
    };
    Deck.prototype.getHeartBeatVariationForCard = function (card, spotType) {
        var hb = 0;
        if (card !== null) {
            var i = 0;
            while (card > this.initialCards[i] && i < this.initialCards.length) {
                i++;
            }
            switch (i) {
                case 0:
                    hb = -20;
                    break;
                case 1:
                    hb = -10;
                    break;
                case 2:
                    break;
                case 3:
                    hb = 10;
                    break;
                case 4:
                    hb = 20;
                    break;
                default:
                    break;
            }
            if (hb < 0 && spotType === "up")
                hb = 0;
            if (hb > 0 && spotType === "down")
                hb = 0;
            if (this.type === "Cardio") {
                var cardioRatio = 20;
                if (hb > 0)
                    hb *= (100 - cardioRatio) / 100;
                if (hb < 0)
                    hb *= (100 + cardioRatio) / 100;
            }
            if (this.heartBeat + hb > MAX_HEARTBEAT)
                hb = MAX_HEARTBEAT - this.heartBeat;
            if (this.heartBeat + hb < MIN_HEARTBEAT)
                hb = MIN_HEARTBEAT - this.heartBeat;
        }
        return hb;
    };
    Deck.prototype.setHeartBeatVariation = function (hb) {
        this.heartBeatVariation = hb;
        return this;
    };
    Deck.prototype.processHeartBeat = function () {
        this.addToHeartBeat(this.heartBeatVariation);
        this.heartBeatVariation = 0;
        return this;
    };
    Deck.prototype.addToHeartBeat = function (hb) {
        this.heartBeat += hb;
        if (this.heartBeat > MAX_HEARTBEAT)
            this.heartBeat = MAX_HEARTBEAT;
        if (this.heartBeat < MIN_HEARTBEAT)
            this.heartBeat = MIN_HEARTBEAT;
        return this;
    };
    Deck.prototype.getHeartBeatRatio = function () {
        return (((this.heartBeat - MIN_HEARTBEAT) * 100) / (MAX_HEARTBEAT - MIN_HEARTBEAT));
    };
    Deck.prototype.takeFatigue = function () {
        if (this.type === "Relentless") {
            this.stock = this.stock.concat([3]);
        }
        else {
            this.stock = this.stock.concat([this.fatigueCard()]);
            this.addToHeartBeat(5);
        }
        return this;
    };
    Deck.prototype.fatigueCard = function () {
        return 2;
    };
    Deck.prototype.getShootLevel = function (velocity) {
        var shootLevel = ((this.heartBeat - MAX_HEARTBEAT) * (MIN_PROBABILITY - MAX_PROBABILITY)) /
            (MIN_HEARTBEAT - MAX_HEARTBEAT) +
            MAX_PROBABILITY;
        shootLevel -= VELOCITY_PROBABILITY * velocity;
        if (this.type === "Shooter") {
            shootLevel += 20;
        }
        if (shootLevel < 0)
            shootLevel = 0;
        if (shootLevel > 100)
            shootLevel = 100;
        return Math.round(shootLevel);
    };
    Deck.prototype.shoot = function (shootVelocity, random) {
        this.shootVelocity = shootVelocity;
        var shootLevel = this.getShootLevel(this.shootVelocity);
        var shots = random.Die(100, SHOOTINGS);
        // console.log("Level Shooting:", shootLevel);
        // console.log("Shots:", JSON.stringify(shots));
        this.shots = shots.map(function (e) {
            return { success: e <= shootLevel, random: random.Die(100, 2) };
        });
        return this;
    };
    Deck.prototype.processGift = function (distanceFromStart, distanceToEnd, boardDifficulty, random) {
        if (!this.gifted) {
            if (this.type === "Relay" && distanceFromStart > distanceToEnd) {
                this.gifted = true;
                this.heartBeat = MIN_HEARTBEAT;
                this.cards = [];
                this.hand = [];
                this.stock = [];
                var numberOfCards = NUMBER_OF_CARDS(boardDifficulty);
                var n = Math.floor(numberOfCards / 2);
                var N = Math.ceil(numberOfCards / 2);
                this.add(3, N).add(4, n).add(5, N).add(6, n).add(7, N);
                this.shuffle(random);
            }
            if (this.type === "Finisher" && distanceToEnd <= 10) {
                this.gifted = true;
                this.cards = this.cards.concat([9]);
                this.shuffle(random);
            }
        }
        return this;
    };
    // STATIC
    Deck.getShootingVelocityPenalty = function (velocity) {
        return velocity * VELOCITY_PENALTY();
    };
    return Deck;
}());
export { Deck };
var Runner = /** @class */ (function () {
    function Runner(id, type, deck) {
        this.id = id;
        this.type = type;
        this.deck = deck;
    }
    return Runner;
}());
export { Runner };
var Player = /** @class */ (function () {
    function Player(player) {
        this.runners = [];
        this.selectedRunner = null;
        if (player && player.runners) {
            this.runners = player.runners.map(function (runner) {
                if (runner && runner.type && runner.deck) {
                    return new Runner(runner.id, runner.type, runner.deck);
                }
                else {
                    return null;
                }
            });
        }
        if (player && player.selectedRunner !== null)
            this.selectedRunner = player.selectedRunner;
    }
    Player.prototype.setRunnersNumber = function (n) {
        this.runners = Array(n).fill(null);
        return this;
    };
    Player.prototype.isInitDone = function () {
        return (this.runners.length > 0 &&
            !this.runners.some(function (runner) { return !runner || !runner.deck; }));
    };
    Player.prototype.initNextRunner = function (type, boardDifficulty) {
        var numberOfCards = NUMBER_OF_CARDS(boardDifficulty);
        for (var i = 0; i < this.runners.length; i++) {
            var runner = this.runners[i];
            if (runner === null) {
                this.initRunner(i, type, numberOfCards);
                return i;
            }
        }
        return null;
    };
    Player.prototype.initRunner = function (id, type, numberOfCards) {
        if (id < this.runners.length) {
            var deck = void 0;
            switch (type) {
                case "Sprinter":
                    deck = this.getInitialSprinter(numberOfCards);
                    break;
                case "Skier":
                    deck = this.getInitialSkier(numberOfCards);
                    break;
                case "Relay":
                    deck = this.getInitialRelay(numberOfCards);
                    break;
                default:
                    deck = this.getInitialRunner(numberOfCards);
                    break;
            }
            var runner = new Runner(id, type, deck);
            runner.deck.setType(type);
            this.runners[id] = runner;
        }
        return this;
    };
    Player.prototype.getInitialRunner = function (n) {
        return new Deck().add(3, n).add(4, n).add(5, n).add(6, n).add(7, n);
    };
    Player.prototype.getInitialSkier = function (n) {
        return new Deck()
            .add(3, n)
            .add(4, n)
            .add(5, n)
            .add(6, n + 1)
            .add(7, n + 1);
    };
    Player.prototype.getInitialSprinter = function (n) {
        return new Deck().add(3, n).add(4, n).add(5, n).add(6, n).add(9, n);
    };
    Player.prototype.getInitialRelay = function (number) {
        var n = Math.floor(number / 2);
        var N = Math.ceil(number / 2);
        return new Deck().add(3, n).add(4, N).add(5, n).add(6, N).add(7, n);
    };
    Player.prototype.shuffleRunner = function (id, random) {
        this.runners.forEach(function (runner) {
            if (runner && runner.id === id)
                runner.deck.shuffle(random);
        });
        return this;
    };
    Player.prototype.shuffle = function (random) {
        this.runners.forEach(function (runner) {
            if (runner.deck)
                runner.deck.shuffle(random);
        });
        return this;
    };
    Player.prototype.processHeartBeats = function () {
        this.runners.forEach(function (runner) {
            if (runner.deck)
                runner.deck.processHeartBeat();
        });
        return this;
    };
    Player.prototype.resetPickedCards = function () {
        this.runners.forEach(function (runner) {
            if (runner.deck)
                runner.deck.resetPickedCard();
        });
        return this;
    };
    Player.prototype.resetShots = function () {
        this.runners.forEach(function (runner) {
            if (runner.deck)
                runner.deck.resetShots();
        });
        return this;
    };
    Player.prototype.getRunners = function () {
        return this.runners;
    };
    Player.prototype.getRunnersWhoDidNotPickedCard = function () {
        var availableTypes = this.runners.filter(function (runner) { return runner && runner.deck && runner.deck.pickedCard === null; });
        return availableTypes;
    };
    Player.prototype.getRunnersWhoDidNotShoot = function () {
        var runners = this.runners.filter(function (runner) { return runner && runner.deck && runner.deck.shots === null; });
        return runners;
    };
    Player.prototype.selectRunner = function (index) {
        this.selectedRunner = index;
        return this;
    };
    Player.prototype.resetSelectedRunner = function () {
        this.selectedRunner = null;
        return this;
    };
    Player.prototype.takeCardsInHand = function (id, number, spotType, random) {
        var runner = this.runners.find(function (r) { return r.id === id; });
        if (runner)
            runner.deck.takeCardsInHand(number, spotType, random);
        return this;
    };
    Player.prototype.pickCard = function (id, index, spotType) {
        var runner = this.runners.find(function (r) { return r.id === id; });
        if (runner)
            runner.deck.pickCard(index, spotType);
        return this;
    };
    Player.prototype.shootWithRunner = function (id, velocity, random) {
        var runner = this.runners.find(function (r) { return r.id === id; });
        if (runner)
            runner.deck.shoot(velocity, random);
        return this;
    };
    Player.prototype.processGift = function (id, distanceFromStart, distanceToEnd, boardDifficulty, random) {
        var runner = this.runners.find(function (r) { return r.id === id; });
        if (runner)
            runner.deck.processGift(distanceFromStart, distanceToEnd, boardDifficulty, random);
        return this;
    };
    Player.prototype.getHeartBeats = function () {
        return this.runners.map(function (runner) {
            if (runner && runner.deck) {
                return new HeartBeat(runner.deck.heartBeat, runner.deck.getHeartBeatRatio());
            }
            else {
                return null;
            }
        });
    };
    Player.RunnerTypes = [
        "Sprinter",
        "Skier",
        "Shooter",
        "Climber",
        "Relentless",
        "Finisher",
        "Relay",
        "Cardio",
    ];
    return Player;
}());
export { Player };
var HeartBeat = /** @class */ (function () {
    function HeartBeat(value, ratio) {
        this.value = value;
        this.ratio = ratio;
    }
    return HeartBeat;
}());
var PickedCard = /** @class */ (function () {
    function PickedCard(type, pickedCard) {
        this.type = type;
        this.pickedCard = pickedCard;
    }
    return PickedCard;
}());
//# sourceMappingURL=index.js.map
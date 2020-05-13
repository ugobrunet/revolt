import {
  MIN_HEARTBEAT,
  MAX_HEARTBEAT,
  MIN_PROBABILITY,
  MAX_PROBABILITY,
  VELOCITY_PROBABILITY,
  VELOCITY_PENALTY,
  SHOOTINGS,
  NUMBER_OF_CARDS,
} from "../Settings";

export class Deck {
  cards: Array<number> = [];
  stock: Array<number> = [];
  hand: Array<number> = [];
  used: Array<number> = [];
  initialCards: Array<number> = [];
  pickedCard: number | null = null;
  shots: Array<Shoot> | null = null;
  heartBeat: number = MIN_HEARTBEAT;
  heartBeatVariation: number = 0;
  shootVelocity: number = 0;
  type: string = "default";
  gifted: boolean = false;
  constructor(deck?: any) {
    if (deck && deck.cards) this.cards = [].concat(deck.cards);
    if (deck && deck.stock) this.stock = [].concat(deck.stock);
    if (deck && deck.hand) this.hand = [].concat(deck.hand);
    if (deck && deck.used) this.used = [].concat(deck.used);
    if (deck && deck.initialCards)
      this.initialCards = [].concat(deck.initialCards);
    if (deck && deck.pickedCard) this.pickedCard = deck.pickedCard;
    if (deck && deck.shots) this.shots = deck.shots;
    if (deck && deck.heartBeat) this.heartBeat = deck.heartBeat;
    if (deck && deck.heartBeatVariation)
      this.heartBeatVariation = deck.heartBeatVariation;
    if (deck && deck.shootVelocity) this.shootVelocity = deck.shootVelocity;
    if (deck && deck.type) this.type = deck.type;
    if (deck && deck.gifted) this.gifted = deck.gifted;
  }
  setType(type: string): Deck {
    this.type = type;
    if (type !== "Relay" && type !== "Finisher") this.gifted = true;
    return this;
  }
  add(value: number, number: number): Deck {
    const cards = Array(number).fill(value);
    this.cards = this.cards.concat(cards);
    if (this.initialCards.indexOf(value) === -1) {
      this.initialCards = this.initialCards.concat([value]).sort();
    }
    return this;
  }
  shuffle(random?: any): Deck {
    console.log("Shuffling");
    if (random) this.cards = random.Shuffle(this.cards);
    return this;
  }
  // putHandInDeck() {
  //   this.cards = this.cards.concat(this.hand);
  //   this.hand = [];
  //   return this;
  // }
  remainingUsableCards(spotType: string | null): boolean {
    return (
      this.stock.some(
        (e) =>
          this.getHeartBeatVariationForCard(e, spotType) <=
          MAX_HEARTBEAT - this.heartBeat
      ) ||
      this.cards.some(
        (e) =>
          this.getHeartBeatVariationForCard(e, spotType) <=
          MAX_HEARTBEAT - this.heartBeat
      )
    );
  }
  takeCardsInHand(n: number, spotType: string | null, random?: any): Deck {
    this.stock = this.stock.concat(this.hand);
    this.hand = [];

    while (this.hand.length < n && this.remainingUsableCards(spotType)) {
      if (this.cards.length === 0) {
        this.cards = this.cards.concat(this.stock);
        this.stock = [];
        this.shuffle(random);
      }
      if (this.cards.length > 0) {
        const card = this.cards.splice(0, 1)[0];
        if (
          this.getHeartBeatVariationForCard(card, spotType) <=
          MAX_HEARTBEAT - this.heartBeat
        ) {
          this.hand = this.hand.concat([card]);
        } else {
          this.stock = this.stock.concat([card]);
        }
      }
    }
    while (this.hand.length < n) {
      this.hand = this.hand.concat([this.fatigueCard()]);
    }
    return this;
  }
  getRemainingCards(): { [cardValue: number]: number } {
    const remainingCards: { [cardValue: number]: number } = {};
    const allCards = this.cards.concat(this.stock).concat(this.hand);
    allCards.forEach((card) => {
      if (!remainingCards[card]) remainingCards[card] = 0;
      remainingCards[card] = remainingCards[card] + 1;
    });
    return remainingCards;
  }
  resetPickedCard(): Deck {
    this.pickedCard = null;
    return this;
  }
  resetShots(): Deck {
    this.shots = null;
    return this;
  }
  pickCard(index: number, spotType: string | null): Deck {
    if (index >= 0 && index < this.hand.length) {
      const value = this.hand.splice(index, 1);
      this.used = this.used.concat(value);
      this.pickedCard = value[0];

      // HeartBeat
      const hbVar = this.getHeartBeatVariationForCard(
        this.pickedCard,
        spotType
      );
      this.setHeartBeatVariation(hbVar);
    }
    return this;
  }
  getHeartBeatVariationForHand(spotType: string | null): Array<number> {
    return this.hand.map((e) => this.getHeartBeatVariationForCard(e, spotType));
  }
  getHeartBeatVariationForCard(card: number, spotType: string | null): number {
    let hb = 0;
    if (card !== null) {
      let i = 0;
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

      if (hb < 0 && spotType === "up") hb = 0;
      if (hb > 0 && spotType === "down") hb = 0;

      if (this.type === "Cardio") {
        const cardioRatio = 20;
        if (hb > 0) hb *= (100 - cardioRatio) / 100;
        if (hb < 0) hb *= (100 + cardioRatio) / 100;
      }

      if (this.heartBeat + hb > MAX_HEARTBEAT)
        hb = MAX_HEARTBEAT - this.heartBeat;
      if (this.heartBeat + hb < MIN_HEARTBEAT)
        hb = MIN_HEARTBEAT - this.heartBeat;
    }
    return hb;
  }
  setHeartBeatVariation(hb: number): Deck {
    this.heartBeatVariation = hb;
    return this;
  }
  processHeartBeat(): Deck {
    this.addToHeartBeat(this.heartBeatVariation);
    this.heartBeatVariation = 0;
    return this;
  }
  addToHeartBeat(hb: number): Deck {
    this.heartBeat += hb;
    if (this.heartBeat > MAX_HEARTBEAT) this.heartBeat = MAX_HEARTBEAT;
    if (this.heartBeat < MIN_HEARTBEAT) this.heartBeat = MIN_HEARTBEAT;
    return this;
  }
  getHeartBeatRatio(): number {
    return (
      ((this.heartBeat - MIN_HEARTBEAT) * 100) / (MAX_HEARTBEAT - MIN_HEARTBEAT)
    );
  }
  takeFatigue(): Deck {
    if (this.type === "Relentless") {
      this.stock = this.stock.concat([3]);
    } else {
      this.stock = this.stock.concat([this.fatigueCard()]);
      this.addToHeartBeat(5);
    }
    return this;
  }
  fatigueCard(): number {
    return 2;
  }
  getShootLevel(velocity: number): number {
    let shootLevel =
      ((this.heartBeat - MAX_HEARTBEAT) * (MIN_PROBABILITY - MAX_PROBABILITY)) /
        (MIN_HEARTBEAT - MAX_HEARTBEAT) +
      MAX_PROBABILITY;

    shootLevel -= VELOCITY_PROBABILITY * velocity;

    if (this.type === "Shooter") {
      shootLevel += 20;
    }
    if (shootLevel < 0) shootLevel = 0;
    if (shootLevel > 100) shootLevel = 100;

    return Math.round(shootLevel);
  }
  shoot(shootVelocity: number, random: any): Deck {
    this.shootVelocity = shootVelocity;

    const shootLevel = this.getShootLevel(this.shootVelocity);

    const shots = random.Die(100, SHOOTINGS);

    // console.log("Level Shooting:", shootLevel);
    // console.log("Shots:", JSON.stringify(shots));

    this.shots = shots.map((e: number) => {
      const r = random.Die(100, 2);
      return new Shoot(e <= shootLevel, r[0], r[1]);
    });

    return this;
  }
  processGift(
    distanceFromStart: number,
    distanceToEnd: number,
    boardDifficulty: number,
    random: any
  ): Deck {
    if (!this.gifted) {
      if (this.type === "Relay" && distanceFromStart > distanceToEnd) {
        this.gifted = true;
        this.heartBeat = MIN_HEARTBEAT;
        this.cards = [];
        this.hand = [];
        this.stock = [];

        const numberOfCards = NUMBER_OF_CARDS(boardDifficulty);
        const n = Math.floor(numberOfCards / 2);
        const N = Math.ceil(numberOfCards / 2);
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
  }
  // STATIC
  static getShootingVelocityPenalty(velocity: number): number {
    return velocity * VELOCITY_PENALTY();
  }
}

export class Runner {
  id: number;
  type: string;
  deck: Deck;
  constructor(id: number, type: string, deck: Deck) {
    this.id = +id;
    this.type = type;
    this.deck = new Deck(deck);
  }
}

export class Player {
  runners: Array<Runner> = [];
  selectedRunner: number | null = null;
  constructor(player?: any) {
    if (player && player.runners) {
      this.runners = player.runners.map((runner: any) => {
        if (runner && runner.type && runner.deck) {
          return new Runner(runner.id, runner.type, runner.deck);
        } else {
          return null;
        }
      });
    }
    if (player && player.selectedRunner !== null)
      this.selectedRunner = +player.selectedRunner;
  }
  static RunnerTypes = [
    "Sprinter",
    "Skier",
    "Shooter",
    "Climber",
    "Relentless",
    "Finisher",
    "Relay",
    "Cardio",
  ];
  setRunnersNumber(n: number): Player {
    this.runners = Array(n).fill(null);
    return this;
  }
  isInitDone(): boolean {
    return (
      this.runners.length > 0 &&
      !this.runners.some((runner) => !runner || !runner.deck)
    );
  }
  initNextRunner(type: string, boardDifficulty: number): number | null {
    const numberOfCards = NUMBER_OF_CARDS(boardDifficulty);
    for (let i = 0; i < this.runners.length; i++) {
      const runner = this.runners[i];
      if (runner === null) {
        this.initRunner(i, type, numberOfCards);
        return i;
      }
    }
    return null;
  }
  initRunner(id: number, type: string, numberOfCards: number): Player {
    if (id < this.runners.length) {
      let deck: Deck;
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
      const runner = new Runner(id, type, deck);
      runner.deck.setType(type);
      this.runners[id] = runner;
    }
    return this;
  }
  getInitialRunner(n: number): Deck {
    return new Deck().add(3, n).add(4, n).add(5, n).add(6, n).add(7, n);
  }
  getInitialSkier(n: number): Deck {
    return new Deck()
      .add(3, n)
      .add(4, n)
      .add(5, n)
      .add(6, n + 1)
      .add(7, n + 1);
  }
  getInitialSprinter(n: number): Deck {
    return new Deck().add(3, n).add(4, n).add(5, n).add(6, n).add(9, n);
  }
  getInitialRelay(number: number): Deck {
    const n = Math.floor(number / 2);
    const N = Math.ceil(number / 2);
    return new Deck().add(3, n).add(4, N).add(5, n).add(6, N).add(7, n);
  }
  shuffleRunner(id: number, random: any): Player {
    this.runners.forEach((runner) => {
      if (runner && runner.id === id) runner.deck.shuffle(random);
    });
    return this;
  }
  shuffle(random: any): Player {
    this.runners.forEach((runner) => {
      if (runner.deck) runner.deck.shuffle(random);
    });
    return this;
  }
  processHeartBeats(): Player {
    this.runners.forEach((runner) => {
      if (runner.deck) runner.deck.processHeartBeat();
    });
    return this;
  }
  resetPickedCards(): Player {
    this.runners.forEach((runner) => {
      if (runner.deck) runner.deck.resetPickedCard();
    });
    return this;
  }
  resetShots(): Player {
    this.runners.forEach((runner) => {
      if (runner.deck) runner.deck.resetShots();
    });
    return this;
  }
  getRunners(): Array<Runner> {
    return this.runners;
  }
  getRunnersWhoDidNotPickedCard(): Array<Runner> {
    let availableTypes = this.runners.filter(
      (runner) => runner && runner.deck && runner.deck.pickedCard === null
    );
    return availableTypes;
  }
  getRunnersWhoDidNotShoot(): Array<Runner> {
    const runners = this.runners.filter(
      (runner) => runner && runner.deck && runner.deck.shots === null
    );
    return runners;
  }
  selectRunner(index: number): Player {
    this.selectedRunner = index;
    return this;
  }
  resetSelectedRunner(): Player {
    this.selectedRunner = null;
    return this;
  }
  takeCardsInHand(
    id: number,
    number: number,
    spotType: string | null,
    random?: any
  ): Player {
    const runner = this.runners.find((r) => r.id === id);
    if (runner) runner.deck.takeCardsInHand(number, spotType, random);
    return this;
  }
  pickCard(id: number, index: number, spotType: string | null): Player {
    const runner = this.runners.find((r) => r.id === id);
    if (runner) runner.deck.pickCard(index, spotType);
    return this;
  }
  shootWithRunner(id: number, velocity: number, random: any): Player {
    const runner = this.runners.find((r) => r.id === id);
    if (runner) runner.deck.shoot(velocity, random);
    return this;
  }
  processGift(
    id: number,
    distanceFromStart: number,
    distanceToEnd: number,
    boardDifficulty: number,
    random: any
  ): Player {
    const runner = this.runners.find((r) => r.id === id);
    if (runner)
      runner.deck.processGift(
        distanceFromStart,
        distanceToEnd,
        boardDifficulty,
        random
      );
    return this;
  }
  getHeartBeats(): Array<HeartBeat | null> {
    return this.runners.map((runner) => {
      if (runner && runner.deck) {
        return new HeartBeat(
          runner.deck.heartBeat,
          runner.deck.getHeartBeatRatio()
        );
      } else {
        return null;
      }
    });
  }
}

export class Shoot {
  success: boolean;
  radius: number;
  angle: number;
  constructor(success: boolean, radius: number, angle: number) {
    this.success = success;
    this.radius = radius;
    this.angle = angle;
  }
}

export class HeartBeat {
  value: number;
  ratio: number;
  constructor(value: number, ratio: number) {
    this.value = value;
    this.ratio = ratio;
  }
}

// class PickedCard {
//   type: string;
//   pickedCard: number;
//   constructor(type: string, pickedCard: number) {
//     this.type = type;
//     this.pickedCard = pickedCard;
//   }
// }

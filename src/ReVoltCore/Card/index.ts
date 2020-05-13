export class Card {
  id: CardIconsKeys;
  title: string;
  titleDetailHided: string | null;
  titleDetail: string;
  gauge: number;
  bikeTime: string;
  energy: number;
  constructor(
    id: CardIconsKeys,
    title: string,
    titleDetailHided: string | null,
    titleDetail: string,
    gauge: number,
    bikeTime: string,
    energy: number
  ) {
    this.id = id;
    this.title = title;
    this.titleDetailHided = titleDetailHided;
    this.titleDetail = titleDetail;
    this.gauge = gauge;
    this.bikeTime = bikeTime;
    this.energy = energy;
  }
}

export class SortedCardArray {
  private cards: Card[];
  private ids: number[];
  constructor(cards: number[], Cards: Card[]) {
    this.ids = cards.sort((_a, _b) => {
      const a = Cards[_a];
      const b = Cards[_b];
      return b.energy - a.energy;
    });
    this.cards = this.ids.map((i) => Cards[i]);
  }
  isCardAtTheRightPosition(card: Card, _position: number): boolean {
    const position = Math.max(Math.min(this.cards.length, _position), 0);
    const previousCard = position <= 0 ? null : this.cards[position - 1];
    const nextCard =
      position >= this.cards.length ? null : this.cards[position];
    return (
      (previousCard === null || card.energy <= previousCard.energy) &&
      (nextCard === null || card.energy >= nextCard.energy)
    );
  }
  getIds(): number[] {
    return this.ids;
  }
  getCards(): Card[] {
    return this.cards;
  }
}

export enum CardIconsKeys {
  AirCooler,
  Alarm,
  Bath,
  Beer,
  Blender,
  Boiler,
  BoomBox,
  Car,
  ClothDryer,
  Coffee,
  Computer,
  Cooker,
  Crepes,
  DishWasher,
  Drone,
  EBike,
  Extractor,
  Fan,
  Fridge,
  Fryer,
  HairDryer,
  HairIron,
  Heater,
  Iron,
  Laptop,
  Light,
  MicroWave,
  Oven,
  Phone,
  Printer,
  Projector,
  Saw,
  Scooter,
  Screen,
  Sewing,
  Shower,
  SoundSystem,
  Toaster,
  Vacuum,
  Ventilation,
  WashingMachine,
  Wifi,
}

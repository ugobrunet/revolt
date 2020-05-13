import { Ctx } from "boardgame.io";

import { Card, SortedCardArray } from "./Card";
import Cards from "./cards";

const SelectNumberOfCards = (G: any, ctx: Ctx, numberOfCards: number) => {
  console.log("SelectNumberOfCards");

  if (numberOfCards > 0) {
    return {
      ...G,
      numberOfCards: numberOfCards,
    };
  } else {
    return G;
  }
};

const SelectCardPosition = (G: any, ctx: Ctx, position: number | null) => {
  console.log("SelectCardPosition");

  return {
    ...G,
    cardPosition: position,
  };
};

const ShuffleCards = (G: any, ctx: Ctx) => {
  console.log("ShuffleCards");
  const { deck } = G;
  const shuffledDeck: number[] =
    ctx.random !== undefined ? ctx.random.Shuffle(deck) : deck;

  return {
    ...G,
    deck: shuffledDeck,
  };
};

const PlaceFirstCard = (G: any, ctx: Ctx) => {
  console.log("PickFirstCard");
  const { deck }: { deck: number[] } = G;
  const pickedCard = deck.splice(0, 1);
  return {
    ...G,
    deck: deck,
    line: pickedCard,
  };
};

const TakeCardsInDeck = (G: any, ctx: Ctx) => {
  console.log("TakeCardsInDeck");
  const { numberOfCards, deck } = G;

  return {
    ...G,
    deck: deck.splice(0, numberOfCards),
  };
};

const CheckCardPosition = (G: any, ctx: Ctx) => {
  console.log("CheckCardPosition");
  const { deck, line, cardPosition, score } = G;
  const card = Cards[deck[0]];
  const _positionInLine = Math.floor(cardPosition / 2);
  const _line = new SortedCardArray(line, Cards);
  const _score = _line.isCardAtTheRightPosition(card, _positionInLine)
    ? score
    : score - 1;
  console.log("Score: ", _score);
  return {
    ...G,
    score: _score,
  };
};

const AddCardToLine = (G: any, ctx: Ctx) => {
  console.log("AddCardToLine");
  const deck = [...G.deck];
  const card = deck.splice(0, 1);
  const line = new SortedCardArray([...G.line, ...card], Cards).getIds();

  return {
    ...G,
    deck: deck,
    line: line,
  };
};

const ReVolt = {
  name: "re_volt",
  minPlayers: 2,

  setup: (ctx: Ctx) => ({
    numberOfCards: ctx.numPlayers,
    cardPosition: null,
    score: 5,
    deck: Cards.map((e: Card, i: number) => i),
    line: [],
  }),

  phases: {
    Setting: {
      start: true,
      moves: {
        selectNumberOfCards: (G: any, ctx: Ctx, numberOfCards: number) => {
          G = { ...SelectNumberOfCards(G, ctx, numberOfCards) };
          return { ...G };
        },
        validate: (G: any, ctx: Ctx) => {
          G = { ...ShuffleCards(G, ctx) };
          G = { ...PlaceFirstCard(G, ctx) };
          G = { ...TakeCardsInDeck(G, ctx) };
          if (ctx && ctx.events && ctx.events.endPhase) ctx.events.endPhase();
          return { ...G };
        },
      },
      onBegin: (G: any, ctx: Ctx) => {
        console.log("Beginning phase Setting");
        if (ctx && ctx.events && ctx.events.setActivePlayers)
          ctx.events.setActivePlayers({ all: "Setting" });
      },
      next: "PlaceCard",
    },
    PlaceCard: {
      moves: {
        selectCardPosition: (G: any, ctx: Ctx, position: number) => {
          G = { ...SelectCardPosition(G, ctx, position) };
          return { ...G };
        },
        validate: (G: any, ctx: Ctx) => {
          G = { ...CheckCardPosition(G, ctx) };
          G = { ...AddCardToLine(G, ctx) };
          G = { ...SelectCardPosition(G, ctx, null) };
          if (ctx && ctx.events && ctx.events.endTurn) ctx.events.endTurn();
          return { ...G };
        },
      },
      onBegin: (G: any, ctx: Ctx) => {
        console.log("Beginning phase PlaceCard");
        if (ctx && ctx.events && ctx.events.setActivePlayers)
          ctx.events.setActivePlayers({ currentPlayer: "PlaceCard" });
      },
      next: "PlaceCard",
    },
  },

  ai: {
    enumerate: (G: any, ctx: Ctx) => {},
  },

  // playerView: PlayerView.STRIP_SECRETS,

  endIf: (G: any, ctx: Ctx) => {
    if (G.deck.length === 0 || G.score === 0) {
      return { winner: { won: G.deck.length === 0 } };
    }
  },
};

export default ReVolt;

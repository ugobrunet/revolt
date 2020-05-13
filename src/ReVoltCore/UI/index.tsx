import React, { useState } from "react";
import intl from "react-intl-universal";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Ctx } from "boardgame.io";

import CardUI from "./CardUI";
import SettingUI from "./SettingUI";
import ScoreUI from "./ScoreUI";
import { Item, DetachedItem, Container } from "./elements";
import Typography from "@material-ui/core/Typography";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FlashOnIcon from "@material-ui/icons/FlashOn";

import { Card, SortedCardArray } from "../Card";
import Cards from "../cards";

type PlayerDictionnary<T> = {
  [playerID: number]: T;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: "160px",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    cardContainer: {
      position: "relative",
    },
    arrow: {
      position: "absolute",
      top: "105px",
      fontSize: "3rem",
      fontWeight: 100,
      left: "-10px",
    },
    finishContainer: {
      width: "100%",
      textAlign: "center",
    },
  })
);

const transformGameMetadata = (
  gameMetadata: any
): PlayerDictionnary<string> => {
  const _playersName: PlayerDictionnary<string> = {};
  for (let i = 0; i < gameMetadata.length; i++) {
    const player = gameMetadata[i];
    _playersName[player.id] = player.name;
  }
  return _playersName;
};

const setNumberOfCards = (
  n: number,
  selectNumberOfCards: (value: number) => void
) => {
  selectNumberOfCards(n);
};

const setCardPosition = (
  p: number,
  selectCardPosition: (value: number) => void
) => {
  selectCardPosition(p);
};

const validate = (f: () => void) => {
  f();
};

const renderCard = (
  card: Card | null,
  key: number,
  classes: any,
  selectCardPosition?: (p: number) => void,
  hided?: boolean
) => (
  <Grid item xs={6} sm={4} md={2} key={key} className={classes.cardContainer}>
    {key > 0 && <div className={classes.arrow}>></div>}
    <CardUI
      onClick={() => (selectCardPosition ? selectCardPosition(key) : null)}
      card={card}
      hided={hided !== undefined ? hided : false}
    ></CardUI>
  </Grid>
  // <Item center className={classes.card} key={key}>
  // </Item>
);

const ReVoltUI = ({
  G,
  ctx,
  isActive,
  playerID,
  gameMetadata,
  moves,
}: {
  G: any;
  ctx: Ctx;
  isActive: boolean;
  playerID: number;
  gameMetadata: any;
  moves: any;
}) => {
  const classes = useStyles();
  const { numberOfCards, cardPosition, deck, line, score } = G;
  const { gameover, phase, currentPlayer } = ctx;

  const _currentPlayer: number = +currentPlayer;
  const _playerID: number = +playerID;
  const playersNames = transformGameMetadata(gameMetadata);

  const placingCard = phase === "PlaceCard";

  const sortedCards = new SortedCardArray(line, Cards).getCards();

  switch (phase) {
    case "Setting":
      return (
        <SettingUI
          numberOfCards={numberOfCards}
          setNumberOfCards={(n: number) =>
            setNumberOfCards(n, moves.selectNumberOfCards)
          }
          validate={moves.validate}
        ></SettingUI>
      );
      break;
    default:
  }

  if (gameover) {
    let result = null;
    if (score >= 5) {
      result =
        "L’énergie est votre quotidien, vous la visualisez derrière chaque mouvement, chaque lumière, chaque variation de température, chaque bruit.";
    } else if (score >= 3) {
      result =
        "Ça devient une affaire sérieuse, l’énergie n’a plus de secrets pour vous. Quand vous passez devant vos appareils, vous vous imaginez sur un vélo";
    } else if (score >= 1) {
      result =
        "Bon, pas mal, mais attention aux mollets. Ce n’est pas en pédalant à longueur de journée que nous réaliserons la transition énergétique.";
    } else {
      result = "Vous êtes à la masse. Une nouvelle partie s’impose !";
    }

    return (
      <div>
        <ScoreUI score={score} />
        <Container>
          <DetachedItem center className={classes.finishContainer}>
            <Typography variant="h6" gutterBottom>
              {result}
            </Typography>
          </DetachedItem>
        </Container>

        <Grid container spacing={2} justify="center">
          {sortedCards.map((card, i) => renderCard(card, i, classes))}
        </Grid>
      </div>
    );
  }

  const cards: Array<Card | null> = isActive
    ? sortedCards.reduce(
        (r: Array<Card | null>, a: Card) => r.concat([a, null]),
        [null]
      )
    : sortedCards;

  const cardToPlace = Cards[deck[0]];

  if (cardPosition !== null) {
    cards.splice(cardPosition, isActive ? 1 : 0, cardToPlace);
  }

  const selectCardPosition = (p: number) =>
    setCardPosition(p, moves.selectCardPosition);

  return (
    <div>
      <ScoreUI score={score} />
      <Container>
        <DetachedItem center>
          <Typography variant="h6" gutterBottom>
            {isActive
              ? "Positionnez cette carte sur la frise"
              : "C'est à " + playersNames[+currentPlayer] + " de jouer"}
          </Typography>
          <CardUI card={cardToPlace} hided={true}></CardUI>
        </DetachedItem>
      </Container>
      {isActive && (
        <Container>
          <DetachedItem center>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => moves.validate()}
              disabled={!cardPosition && cardPosition !== 0}
            >
              {intl.get("revolt.validate")}
            </Button>
          </DetachedItem>
        </Container>
      )}

      <Grid container spacing={2} justify="center">
        {cards.map((card, i) =>
          renderCard(card, i, classes, selectCardPosition, i === cardPosition)
        )}
      </Grid>
    </div>
  );
};

export default ReVoltUI;

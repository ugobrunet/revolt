import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import intl from "react-intl-universal";
import Typography from "@material-ui/core/Typography";

import { Item, DetachedItem, Container } from "../elements";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const SettingUI = ({
  numberOfCards,
  setNumberOfCards,
  validate,
}: {
  numberOfCards: number;
  setNumberOfCards: (n: number) => void;
  validate: () => void;
}) => {
  const [strNumberOfCards, setStrNumberOfCards] = useState<string>("");

  useEffect(() => {
    setStrNumberOfCards(numberOfCards.toString());
  }, [numberOfCards]);

  const changeNumberOfCards = (str: string) => {
    setStrNumberOfCards(str);
    const value = parseInt(str, 10);
    if (value > 0) setNumberOfCards(value);
  };

  const onClickValidate = () => {
    validate();
  };

  return (
    <Container column>
      <DetachedItem center>
        <Typography variant="h6" gutterBottom>
          Sélectionnez le nombre de cartes à placer dans la frise
        </Typography>
      </DetachedItem>
      <DetachedItem center>
        <TextField
          id="standard-number"
          label="Nombre de cartes"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={strNumberOfCards}
          onChange={(event) => changeNumberOfCards(event.target.value)}
        />
      </DetachedItem>
      <DetachedItem center>
        <Button
          variant="contained"
          color="default"
          onClick={onClickValidate}
          disabled={!(numberOfCards > 0)}
        >
          {intl.get("revolt.validate")}
        </Button>
      </DetachedItem>
    </Container>
  );
};
export default SettingUI;

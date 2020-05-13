import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Item } from "../elements";
import { ButtonContent } from "../../UI";

const useStyles = makeStyles((theme) => ({
  button_container: {
    textAlign: "center",
  },
  button_item: {
    margin: "5px",
  },
}));

const renderButton = (
  text: string,
  key: number,
  handleClick: () => void,
  classes: any
) => {
  return (
    <Button
      className={classes.button_item}
      onClick={() => handleClick()}
      key={key}
      variant="contained"
    >
      {text}
    </Button>
  );
};

export default function ButtonUI({ buttons }: { buttons: ButtonContent[] }) {
  const classes = useStyles();
  return (
    <Item className={classes.button_container}>
      {buttons.map((button, i) =>
        renderButton(button.text, i, button.handleClick, classes)
      )}
    </Item>
  );
}

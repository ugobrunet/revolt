import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 160,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const renderChoices = (choices: number[]) => {
  const renderedChoices: any[] = [];
  choices.forEach((e, i) => {
    renderedChoices.push(
      <MenuItem key={i} value={e}>
        {e}
      </MenuItem>
    );
  });
  return renderedChoices;
};

const SelectMapUI = ({
  choice,
  choices,
  handleChoiceChanged,
  label,
  selectorID,
}: {
  choice: number;
  choices: number[];
  handleChoiceChanged: (value: number) => void;
  label: string;
  selectorID: string;
}) => {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={`${selectorID}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${selectorID}-select-label`}
        id={`${selectorID}-select`}
        value={choice}
        onChange={(event: any) => handleChoiceChanged(event.target.value)}
      >
        {renderChoices(choices)}
      </Select>
    </FormControl>
  );
};

export default SelectMapUI;

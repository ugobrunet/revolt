import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
var useStyles = makeStyles(function (theme) { return ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 160
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}); });
var renderChoices = function (choices) {
    var renderedChoices = [];
    choices.forEach(function (e, i) {
        renderedChoices.push(<MenuItem key={i} value={e}>
        {e}
      </MenuItem>);
    });
    return renderedChoices;
};
var SelectMapUI = function (props) {
    var choice = props.choice, choices = props.choices, handleChoiceChanged = props.handleChoiceChanged, label = props.label, selectorID = props.selectorID;
    var classes = useStyles();
    return (<FormControl className={classes.formControl}>
      <InputLabel id={selectorID + "-select-label"}>{label}</InputLabel>
      <Select labelId={selectorID + "-select-label"} id={selectorID + "-select"} value={choice} onChange={handleChoiceChanged}>
        {renderChoices(choices)}
      </Select>
    </FormControl>);
};
export default SelectMapUI;
//# sourceMappingURL=index.js.map
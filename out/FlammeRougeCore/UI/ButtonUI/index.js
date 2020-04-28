import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Item } from "../elements";
var useStyles = makeStyles(function (theme) { return ({
    button_container: {
        textAlign: "center"
    },
    button_item: {
        margin: "5px"
    }
}); });
var renderButton = function (text, key, handleClick, classes) {
    return (<Button className={classes.button_item} onClick={function () { return handleClick(); }} key={key} variant="contained">
      {text}
    </Button>);
};
export default function ButtonUI(_a) {
    var buttons = _a.buttons;
    var classes = useStyles();
    return (<Item className={classes.button_container}>
      {buttons.map(function (button, i) {
        return renderButton(button.text, i, button.handleClick, classes);
    })}
    </Item>);
}
//# sourceMappingURL=index.js.map
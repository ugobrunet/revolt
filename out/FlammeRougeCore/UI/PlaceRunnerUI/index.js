import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
var useStyles = makeStyles({
    root: {
        width: 275,
        minHeight: 120,
    },
    disabled: {
        color: "rgba(0, 0, 0, 0.26)",
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    runner_info: {
        textTransform: "none",
        textAlign: "left",
    },
});
var renderRunner = function (name, info, key, active, handleClick, classes) {
    return (<Grid key={key} item>
      <Button onClick={handleClick} disabled={!active}>
        <Card className={classes.root + " " + (!active && classes.disabled)}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {name}
            </Typography>
            <Typography variant="body2" component="p" className={classes.runner_info}>
              {info}
            </Typography>
          </CardContent>
        </Card>
      </Button>
    </Grid>);
};
var PlaceRunnerUI = function (_a) {
    var runners = _a.runners, active = _a.active;
    var classes = useStyles();
    return (<Grid container direction="row" justify="center" alignItems="center" spacing={1}>
      {runners.map(function (runner, i) {
        return renderRunner(runner.name, runner.info, i, active, runner.handleClick, classes);
    })}
    </Grid>);
};
export default PlaceRunnerUI;
//# sourceMappingURL=index.js.map
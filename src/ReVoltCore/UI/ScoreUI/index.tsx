import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { Item, DetachedItem, Container } from "../elements";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import FlashOffIcon from "@material-ui/icons/FlashOff";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    on: {
      fill: "gold",
    },
    off: {
      fill: "darkgray",
    },
  })
);

const ScoreUI = ({ score }: { score: number }) => {
  const classes = useStyles();

  const _score = Array(5)
    .fill(null)
    .map((e, i) => i < score);

  return (
    <Container>
      <DetachedItem center>
        {_score.map((e, i) =>
          e ? (
            <FlashOnIcon className={classes.on} key={i} />
          ) : (
            <FlashOffIcon className={classes.off} key={i} />
          )
        )}
      </DetachedItem>
    </Container>
  );
};
export default ScoreUI;

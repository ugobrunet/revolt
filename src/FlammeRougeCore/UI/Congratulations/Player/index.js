import React from "react";
import intl from "react-intl-universal";

import CardHeader from "@material-ui/core/CardHeader";
import { CenteredCardContent, DetachedCard, StyledAvatar } from "./elements";
import { makeStyles } from "@material-ui/core/styles";
import PlayersNamesContext from "../../../playersNamesContext";

const useStyles = makeStyles(theme => ({
  current: {
    fontWeight: "bold",
    textTransform: "uppercase"
  }
}));

const Player = ({ isCurrent, player, type, position }) => {
  const classes = useStyles();
  return (
    <PlayersNamesContext.Consumer>
      {playersNames => {
        const playerName = playersNames[player];
        return (
          <DetachedCard>
            <CardHeader
              titleTypographyProps={{ variant: null }}
              className={isCurrent ? classes.current : null}
              avatar={
                <StyledAvatar position={position}>{position}</StyledAvatar>
              }
              title={
                playerName +
                " - " +
                intl.get("flamme_rouge." + type.toString().toLowerCase())
              }
            />
          </DetachedCard>
        );
      }}
    </PlayersNamesContext.Consumer>
  );
};

export default Player;

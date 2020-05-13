import React from "react";
import intl from "react-intl-universal";

import CardHeader from "@material-ui/core/CardHeader";
import { DetachedCard, StyledAvatar } from "./elements";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  current: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
}));

const Player = ({
  playerName,
  isCurrent,
  type,
  position,
}: {
  playerName: string;
  isCurrent: boolean;
  type: any;
  position: any;
}) => {
  const classes = useStyles();
  return (
    <DetachedCard>
      <CardHeader
        titleTypographyProps={{ variant: undefined }}
        className={isCurrent ? classes.current : undefined}
        avatar={<StyledAvatar position={position}>{position}</StyledAvatar>}
        title={
          playerName +
          " - " +
          intl.get("flamme_rouge." + type.toString().toLowerCase())
        }
      />
    </DetachedCard>
  );
};

export default Player;

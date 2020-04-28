import React from "react";
import intl from "react-intl-universal";
import CardHeader from "@material-ui/core/CardHeader";
import { DetachedCard, StyledAvatar } from "./elements";
import { makeStyles } from "@material-ui/core/styles";
import PlayersNamesContext from "../../../playersNamesContext";
var useStyles = makeStyles(function (theme) { return ({
    current: {
        fontWeight: "bold",
        textTransform: "uppercase"
    }
}); });
var Player = function (_a) {
    var isCurrent = _a.isCurrent, player = _a.player, type = _a.type, position = _a.position;
    var classes = useStyles();
    return (<PlayersNamesContext.Consumer>
      {function (playersNames) {
        var playerName = playersNames[player];
        return (<DetachedCard>
            <CardHeader titleTypographyProps={{ variant: null }} className={isCurrent ? classes.current : null} avatar={<StyledAvatar position={position}>{position}</StyledAvatar>} title={playerName +
            " - " +
            intl.get("flamme_rouge." + type.toString().toLowerCase())}/>
          </DetachedCard>);
    }}
    </PlayersNamesContext.Consumer>);
};
export default Player;
//# sourceMappingURL=index.js.map
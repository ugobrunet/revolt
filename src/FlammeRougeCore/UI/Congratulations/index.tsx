import React, { useState, useEffect } from "react";
import intl from "react-intl-universal";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Player from "./Player";
import { BoardPlayer, PlayerDictionnary } from "../../Board";

const Congratulations = ({
  gameover,
  winner,
  playerID,
  playersNames,
}: {
  gameover: boolean;
  winner: BoardPlayer[];
  playerID: number;
  playersNames: PlayerDictionnary<string>;
}) => {
  useEffect(() => {
    if (gameover) {
      handleOpen();
    }
  });

  const [open, setOpen] = useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const renderPlayer = (
    player: BoardPlayer,
    playerID: number,
    playersNames: PlayerDictionnary<string>,
    key: number
  ) => {
    return (
      <Player
        key={key}
        playerName={playersNames[player.playerID]}
        position={key + 1}
        type={player.type}
        isCurrent={player.playerID === playerID}
      />
    );
  };

  return (
    <Dialog open={open} fullWidth onClose={handleClose}>
      {gameover && (
        <DialogTitle>{intl.get("congratulations.results")}</DialogTitle>
      )}
      {gameover && (
        <DialogContent>
          {winner.map((player, i) =>
            renderPlayer(player, playerID, playersNames, i)
          )}
        </DialogContent>
      )}
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleClose}>
          {intl.get("congratulations.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Congratulations;

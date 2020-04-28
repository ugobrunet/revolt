import React from "react";
import intl from "react-intl-universal";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { getGames, getPlayer, getPlayers } from "./utils";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// TODO win is not shown for player 2
function CreateRoomDialog(props) {
  const { onClose, onValidate, open, gameList } = props;
  const classes = useStyles();

  const defaultGameName = gameList.length > 0 ? gameList[0].game.name : "";
  const [game, setGame] = React.useState(defaultGameName);
  const [player, setPlayer] = React.useState(getPlayer(game, gameList));

  const handleGameChange = (event) => {
    const _game = event.target.value;
    setGame(_game);
    players = getPlayers(_game, gameList);
    const _player = getPlayer(_game, gameList);
    setPlayer(_player);
  };

  const handlePlayerChange = (event) => {
    setPlayer(event.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleValidate = () => {
    onClose();
    onValidate(game, player);
  };

  let games = getGames(gameList);
  let players = getPlayers(game, gameList);

  return (
    <Dialog open={open} fullWidth onClose={handleClose}>
      <DialogTitle>{intl.get("create_room_dialog.title")}</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <InputLabel id="game-select-label">
            {intl.get("create_room_dialog.game")}
          </InputLabel>
          <Select
            labelId="game-select-label"
            id="game-select"
            value={game}
            onChange={handleGameChange}
          >
            {games}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel id="player-select-label">
            {intl.get("create_room_dialog.players")}
          </InputLabel>
          <Select
            labelId="player-select-label"
            id="player-select"
            value={player}
            onChange={handlePlayerChange}
          >
            {players}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleValidate}>
          {intl.get("create_room_dialog.validate")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateRoomDialog;

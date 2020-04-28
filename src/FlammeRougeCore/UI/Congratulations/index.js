import React, { Component } from "react";
import intl from "react-intl-universal";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Player from "./Player";
// import congratulationsImage from "../images/congratulations.gif";
// import { CenteredImage } from "./elements";

// TODO win is not shown for player 2
class Congratulations extends Component {
  state = {
    open: false
  };

  componentDidMount() {
    if (this.props.gameover) {
      this.handleOpen();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.gameover && prevProps.gameover !== this.props.gameover) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleGoHome = () => {
    window.open(`${process.env.PUBLIC_URL}/`, "_self");
  };

  renderPlayer = (player, key, playerID) => {
    return (
      <Player
        key={key}
        player={player.playerID}
        position={key + 1}
        type={player.type}
        isCurrent={player.playerID.toString() === playerID}
      />
    );
  };

  render() {
    const { open } = this.state;
    const { gameover, winner, playerID } = this.props;

    return (
      <Dialog open={open} fullWidth onClose={this.handleClose}>
        {gameover && (
          <DialogTitle>{intl.get("congratulations.results")}</DialogTitle>
        )}
        {gameover && (
          <DialogContent>
            {winner.map((e, i) => this.renderPlayer(e, i, playerID))}
          </DialogContent>
        )}
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleClose}
          >
            {intl.get("congratulations.ok")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default Congratulations;

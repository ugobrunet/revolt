import React, { Component } from "react";
import intl from "react-intl-universal";

import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ShootUI from "./ShootUI";
// import congratulationsImage from "../images/congratulations.gif";
// import { CenteredImage } from "./elements";

// TODO win is not shown for player 2
class ShotsUI extends Component {
  state = {
    open: false,
    hided: false
  };

  componentDidMount() {
    if (this.props.openning) {
      this.handleOpen();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.openning && prevProps.openning !== this.props.openning) {
      this.handleOpen();
    }
  }

  triggerShot() {
    const { hided } = this.state;
    const { velocity } = this.props;

    let delay = 2000;
    if (velocity < 0) {
      delay = 3000;
    }
    if (velocity > 0) {
      delay = 1000;
    }

    if (hided.length < 5) {
      if (hided.length === 4) delay = 2000;
      this.setState({ hided: hided.concat([true]) });
      setTimeout(() => {
        this.triggerShot();
      }, delay);
    } else {
      this.handleClose();
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.setState({ hided: [] });
    setTimeout(() => {
      this.triggerShot();
    }, 2000);
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({ open: false });
    onClose();
  };

  renderShot = (shot, key, hided) => {
    return (
      <Grid item xs={6} sm={2} key={key}>
        <ShootUI
          success={shot.success}
          randomR={shot.random[0]}
          randomA={shot.random[1]}
          active={hided}
        />
      </Grid>
    );
  };

  render() {
    const { open, hided } = this.state;
    const { openning, title, shots } = this.props;
    // const { openning, title } = this.props;
    // const shots = [
    //   { success: true, random: [12, 6] },
    //   { success: false, random: [1, 95] },
    //   { success: true, random: [12, 33] },
    //   { success: false, random: [51, 37] },
    //   { success: true, random: [86, 56] }
    // ];

    return (
      <Dialog open={open} fullWidth onClose={this.handleClose}>
        {openning && <DialogTitle>{title}</DialogTitle>}
        {openning && (
          <DialogContent>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              {shots.map((e, i) =>
                this.renderShot(e, i, i < hided.length ? hided[i] : false)
              )}
            </Grid>
          </DialogContent>
        )}
      </Dialog>
    );
  }
}

export default ShotsUI;

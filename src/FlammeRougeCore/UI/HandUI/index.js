import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FavoriteIcon from "@material-ui/icons/Favorite";

const defaultClick = () => {};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper_container: {
    position: "relative"
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "80px",
    width: "60px",
    lineHeight: "70px",
    padding: "0px",
    border: "5px solid lightgray",
    fontSize: "25px"
  },
  heartBeat_icon: {
    height: "30px",
    width: "30px",
    position: "absolute",
    bottom: "-5px",
    right: "-5px"
  },
  heartBeat_icon_null: {
    color: "lightgray"
  },
  heartBeat_icon_positive: {
    color: "red"
  },
  heartBeat_icon_negative: {
    color: "green"
  },
  heartBeat_text: {
    position: "absolute",
    bottom: "-3px",
    right: "-5px",
    fontSize: "12px",
    textAlign: "center",
    width: "30px",
    height: "30px",
    color: "white",
    fontWeight: "bold",
    lineHeight: "30px"
  }
});

class HandUI extends Component {
  renderCard = (cell, key, heartBeatVariation, handleClick, classes) => {
    handleClick = handleClick || defaultClick;
    const heartbeat_color =
      heartBeatVariation === 0
        ? classes.heartBeat_icon_null
        : heartBeatVariation > 0
        ? classes.heartBeat_icon_positive
        : classes.heartBeat_icon_negative;

    const strHeartBeatVariation =
      heartBeatVariation > 0 ? "+" + heartBeatVariation : heartBeatVariation;
    return (
      <Grid
        onClick={() => handleClick(key)}
        key={key}
        item
        className={classes.paper_container}
      >
        <Button className={classes.paper} variant="outlined">
          {cell}
        </Button>
        <FavoriteIcon
          className={`${classes.heartBeat_icon} ${heartbeat_color}`}
        />
        <span className={classes.heartBeat_text}>{strHeartBeatVariation}</span>
        {/* <Paper className={classes.paper}>{cell}</Paper> */}
      </Grid>
      // <Cell onClick={() => handleClick(key)} key={key} cellRadius={cellRadius}>
      //   {cell}
      // </Cell>
    );
  };

  render() {
    const { cards, handleClick, heartBeatVariation, classes } = this.props;
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={1}
      >
        {cards.map((e, i) => {
          const hb = i < heartBeatVariation.length ? heartBeatVariation[i] : 0;
          return this.renderCard(e, i, hb, handleClick, classes);
        })}
      </Grid>
      // <Table>
      //   <Row>
      //     {cells.map((e, i) => this.renderCell(e, i, cellRadius, handleClick))}
      //   </Row>
      // </Table>
    );
  }
}

HandUI.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HandUI);

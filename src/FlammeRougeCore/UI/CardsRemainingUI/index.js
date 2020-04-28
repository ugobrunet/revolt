import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import intl from "react-intl-universal";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    position: "relative"
  },
  card: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "40px",
    width: "30px",
    minWidth: "30px",
    lineHeight: "34px",
    padding: "0px",
    border: "3px solid lightgray !important",
    fontSize: "20px"
    // background:
    //   "linear-gradient(to top right, #fff calc(50% - 2px), lightgray calc(50% - 1px), lightgray calc(50% + 1px),#fff calc(50% + 2px) )"
  },
  quantity: {
    position: "absolute",
    bottom: "0",
    right: "0",
    borderRadius: "50%",
    color: "white",
    background: "lightgray",
    fontWeight: "bold",
    fontSize: "13px",
    width: "15px",
    height: "15px",
    lineHeight: "15px",
    textAlign: "center"
  }
});

class HandUI extends Component {
  renderCard = (card, quantity, key, classes) => {
    return (
      <Grid key={key} item className={classes.container}>
        <Button className={classes.card} variant="outlined" disabled>
          {card}
        </Button>
        <div className={classes.quantity}>{quantity}</div>
      </Grid>
    );
  };

  render() {
    const { cards, classes } = this.props;
    const cardsKey = Object.keys(cards)
      .sort()
      .reverse();
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={1}
      >
        <h3>{intl.get("flamme_rouge.remaining_cards")}</h3>
        {cardsKey.map((card, i) =>
          this.renderCard(card, cards[card], i, classes)
        )}
      </Grid>
    );
  }
}

HandUI.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HandUI);

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import intl from "react-intl-universal";
var styles = function (theme) { return ({
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
}); };
var HandUI = /** @class */ (function (_super) {
    __extends(HandUI, _super);
    function HandUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderCard = function (card, quantity, key, classes) {
            return (<Grid key={key} item className={classes.container}>
        <Button className={classes.card} variant="outlined" disabled>
          {card}
        </Button>
        <div className={classes.quantity}>{quantity}</div>
      </Grid>);
        };
        return _this;
    }
    HandUI.prototype.render = function () {
        var _this = this;
        var _a = this.props, cards = _a.cards, classes = _a.classes;
        var cardsKey = Object.keys(cards)
            .sort()
            .reverse();
        return (<Grid container direction="row" justify="center" alignItems="center" spacing={1}>
        <h3>{intl.get("flamme_rouge.remaining_cards")}</h3>
        {cardsKey.map(function (card, i) {
            return _this.renderCard(card, cards[card], i, classes);
        })}
      </Grid>);
    };
    return HandUI;
}(Component));
HandUI.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(HandUI);
//# sourceMappingURL=index.js.map
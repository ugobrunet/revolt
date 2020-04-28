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
import FavoriteIcon from "@material-ui/icons/Favorite";
var defaultClick = function () { };
var styles = function (theme) { return ({
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
}); };
var HandUI = /** @class */ (function (_super) {
    __extends(HandUI, _super);
    function HandUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderCard = function (cell, key, heartBeatVariation, handleClick, classes) {
            handleClick = handleClick || defaultClick;
            var heartbeat_color = heartBeatVariation === 0
                ? classes.heartBeat_icon_null
                : heartBeatVariation > 0
                    ? classes.heartBeat_icon_positive
                    : classes.heartBeat_icon_negative;
            var strHeartBeatVariation = heartBeatVariation > 0 ? "+" + heartBeatVariation : heartBeatVariation;
            return (<Grid onClick={function () { return handleClick(key); }} key={key} item className={classes.paper_container}>
        <Button className={classes.paper} variant="outlined">
          {cell}
        </Button>
        <FavoriteIcon className={classes.heartBeat_icon + " " + heartbeat_color}/>
        <span className={classes.heartBeat_text}>{strHeartBeatVariation}</span>
        
      </Grid>
            // <Cell onClick={() => handleClick(key)} key={key} cellRadius={cellRadius}>
            //   {cell}
            // </Cell>
            );
        };
        return _this;
    }
    HandUI.prototype.render = function () {
        var _this = this;
        var _a = this.props, cards = _a.cards, handleClick = _a.handleClick, heartBeatVariation = _a.heartBeatVariation, classes = _a.classes;
        return (<Grid container direction="row" justify="center" alignItems="center" spacing={1}>
        {cards.map(function (e, i) {
            var hb = i < heartBeatVariation.length ? heartBeatVariation[i] : 0;
            return _this.renderCard(e, i, hb, handleClick, classes);
        })}
      </Grid>
        // <Table>
        //   <Row>
        //     {cells.map((e, i) => this.renderCell(e, i, cellRadius, handleClick))}
        //   </Row>
        // </Table>
        );
    };
    return HandUI;
}(Component));
HandUI.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(HandUI);
//# sourceMappingURL=index.js.map
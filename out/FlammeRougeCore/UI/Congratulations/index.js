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
var Congratulations = /** @class */ (function (_super) {
    __extends(Congratulations, _super);
    function Congratulations() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            open: false
        };
        _this.handleOpen = function () {
            _this.setState({ open: true });
        };
        _this.handleClose = function () {
            _this.setState({ open: false });
        };
        _this.handleGoHome = function () {
            window.open(process.env.PUBLIC_URL + "/", "_self");
        };
        _this.renderPlayer = function (player, key, playerID) {
            return (<Player key={key} player={player.playerID} position={key + 1} type={player.type} isCurrent={player.playerID.toString() === playerID}/>);
        };
        return _this;
    }
    Congratulations.prototype.componentDidMount = function () {
        if (this.props.gameover) {
            this.handleOpen();
        }
    };
    Congratulations.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.gameover && prevProps.gameover !== this.props.gameover) {
            this.handleOpen();
        }
    };
    Congratulations.prototype.render = function () {
        var _this = this;
        var open = this.state.open;
        var _a = this.props, gameover = _a.gameover, winner = _a.winner, playerID = _a.playerID;
        return (<Dialog open={open} fullWidth onClose={this.handleClose}>
        {gameover && (<DialogTitle>{intl.get("congratulations.results")}</DialogTitle>)}
        {gameover && (<DialogContent>
            {winner.map(function (e, i) { return _this.renderPlayer(e, i, playerID); })}
          </DialogContent>)}
        <DialogActions>
          <Button variant="contained" color="primary" onClick={this.handleClose}>
            {intl.get("congratulations.ok")}
          </Button>
        </DialogActions>
      </Dialog>);
    };
    return Congratulations;
}(Component));
export default Congratulations;
//# sourceMappingURL=index.js.map
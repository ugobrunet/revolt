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
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ShootUI from "./ShootUI";
// import congratulationsImage from "../images/congratulations.gif";
// import { CenteredImage } from "./elements";
// TODO win is not shown for player 2
var ShotsUI = /** @class */ (function (_super) {
    __extends(ShotsUI, _super);
    function ShotsUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            open: false,
            hided: false
        };
        _this.handleOpen = function () {
            _this.setState({ open: true });
            _this.setState({ hided: [] });
            setTimeout(function () {
                _this.triggerShot();
            }, 2000);
        };
        _this.handleClose = function () {
            var onClose = _this.props.onClose;
            _this.setState({ open: false });
            onClose();
        };
        _this.renderShot = function (shot, key, hided) {
            return (<Grid item xs={6} sm={2} key={key}>
        <ShootUI success={shot.success} randomR={shot.random[0]} randomA={shot.random[1]} active={hided}/>
      </Grid>);
        };
        return _this;
    }
    ShotsUI.prototype.componentDidMount = function () {
        if (this.props.openning) {
            this.handleOpen();
        }
    };
    ShotsUI.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.openning && prevProps.openning !== this.props.openning) {
            this.handleOpen();
        }
    };
    ShotsUI.prototype.triggerShot = function () {
        var _this = this;
        var hided = this.state.hided;
        var velocity = this.props.velocity;
        var delay = 2000;
        if (velocity < 0) {
            delay = 3000;
        }
        if (velocity > 0) {
            delay = 1000;
        }
        if (hided.length < 5) {
            if (hided.length === 4)
                delay = 2000;
            this.setState({ hided: hided.concat([true]) });
            setTimeout(function () {
                _this.triggerShot();
            }, delay);
        }
        else {
            this.handleClose();
        }
    };
    ShotsUI.prototype.render = function () {
        var _this = this;
        var _a = this.state, open = _a.open, hided = _a.hided;
        var _b = this.props, openning = _b.openning, title = _b.title, shots = _b.shots;
        // const { openning, title } = this.props;
        // const shots = [
        //   { success: true, random: [12, 6] },
        //   { success: false, random: [1, 95] },
        //   { success: true, random: [12, 33] },
        //   { success: false, random: [51, 37] },
        //   { success: true, random: [86, 56] }
        // ];
        return (<Dialog open={open} fullWidth onClose={this.handleClose}>
        {openning && <DialogTitle>{title}</DialogTitle>}
        {openning && (<DialogContent>
            <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
              {shots.map(function (e, i) {
            return _this.renderShot(e, i, i < hided.length ? hided[i] : false);
        })}
            </Grid>
          </DialogContent>)}
      </Dialog>);
    };
    return ShotsUI;
}(Component));
export default ShotsUI;
//# sourceMappingURL=index.js.map
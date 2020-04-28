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
import { Container, Item } from "../UI/Grid";
import { StyledTextField } from "./elements";
var OnlineLogin = /** @class */ (function (_super) {
    __extends(OnlineLogin, _super);
    function OnlineLogin(props) {
        var _this = _super.call(this, props) || this;
        _this.handlePlayerNameChange = function (_a) {
            var value = _a.target.value;
            _this.setState({ changingPlayerName: value });
        };
        _this.handleLogin = function () {
            // TODO add user to AUTH server
            _this.props.onLogin(_this.state.changingPlayerName);
        };
        _this.getErrorMessage = function (changingPlayerName, playersNames) {
            if (!changingPlayerName) {
                return intl.get("online.name_not_empty");
            }
            if (!/^\w+$/.test(changingPlayerName)) {
                return intl.get("online.name_invalid_characters");
            }
            if (changingPlayerName.length > 15) {
                return intl.get("online.name_too_long");
            }
            // TODO load players names from AUTH server
            if (playersNames.includes(changingPlayerName)) {
                return intl.get("online.name_taken");
            }
            return null;
        };
        _this.state = {
            changingPlayerName: props.playerName,
        };
        return _this;
    }
    OnlineLogin.prototype.render = function () {
        var _this = this;
        var changingPlayerName = this.state.changingPlayerName;
        var playersNames = this.props.playersNames;
        var errorMessage = this.getErrorMessage(changingPlayerName, playersNames);
        var hasError = !!errorMessage;
        return (<Container column alignItems="center">
        <Item>
          <StyledTextField label={intl.get("online.enter_name")} error={hasError} helperText={errorMessage} margin="normal" value={changingPlayerName} variant="outlined" onKeyPress={function (_a) {
            var key = _a.key;
            return !hasError && key === "Enter" && _this.handleLogin();
        }} onChange={this.handlePlayerNameChange}/>
        </Item>
        <Item>
          <Button disabled={hasError} color="primary" size="large" 
        // variant="extendedFab"
        onClick={this.handleLogin}>
            {intl.get("online.login")}
          </Button>
        </Item>
      </Container>);
    };
    return OnlineLogin;
}(Component));
export default OnlineLogin;
//# sourceMappingURL=index.js.map
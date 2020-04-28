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
import Cookies from "js-cookie";
import intl from "react-intl-universal";
import { SUPPORTED_LOCALES } from "../InitLocale";
import GithubIcon from "../icons/Github";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import { DetachedButton, FixedAppBarMargin, Logo, WhiteSelect, } from "./elements";
var AppWrapper = /** @class */ (function (_super) {
    __extends(AppWrapper, _super);
    function AppWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleLogoClick = function () {
            window.open(process.env.PUBLIC_URL + "/", "_self");
        };
        _this.handleGithubClick = function () {
            // window.open("https://github.com/");
        };
        _this.handleRulesClick = function () {
            // window.open(
            //   "https://pikabu.ru/story/prikolnaya_miniigra_stoit_poprobovat_6269129"
            // );
        };
        _this.handleLanguageChange = function (event) {
            Cookies.set("lang", event.target.value);
            window.location.reload();
        };
        return _this;
    }
    AppWrapper.prototype.render = function () {
        var currentLocale = intl.getInitOptions().currentLocale;
        return (<div>
        <AppBar color="secondary" position="fixed">
          <Toolbar>
            <Logo onClick={this.handleLogoClick}>
              {intl.get("app_bar.title")}
            </Logo>
            <WhiteSelect value={currentLocale} onChange={this.handleLanguageChange}>
              {Object.keys(SUPPORTED_LOCALES).map(function (lang) { return (<MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>); })}
            </WhiteSelect>
            <DetachedButton color="inherit" onClick={this.handleRulesClick}>
              {intl.get("app_bar.rules")}
            </DetachedButton>
            <Tooltip title="Github">
              <IconButton onClick={this.handleGithubClick}>
                <GithubIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <FixedAppBarMargin>{this.props.children}</FixedAppBarMargin>
      </div>);
    };
    return AppWrapper;
}(Component));
export default AppWrapper;
//# sourceMappingURL=index.jsx.map
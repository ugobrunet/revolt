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

import {
  DetachedButton,
  FixedAppBarMargin,
  Logo,
  WhiteSelect,
} from "./elements";

export default class AppWrapper extends Component {
  handleLogoClick = () => {
    window.open(`${process.env.PUBLIC_URL}/`, "_self");
  };

  handleGithubClick = () => {
    // window.open("https://github.com/");
  };

  handleRulesClick = () => {
    // window.open(
    //   "https://pikabu.ru/story/prikolnaya_miniigra_stoit_poprobovat_6269129"
    // );
  };

  handleLanguageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    Cookies.set("lang", event.target.value as string);
    window.location.reload();
  };

  render() {
    const { currentLocale } = intl.getInitOptions();

    return (
      <div>
        <AppBar color="secondary" position="fixed">
          <Toolbar>
            <Logo onClick={this.handleLogoClick}>
              {intl.get("app_bar.title")}
            </Logo>
            <WhiteSelect
              value={currentLocale}
              onChange={this.handleLanguageChange}
            >
              {Object.keys(SUPPORTED_LOCALES).map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
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
      </div>
    );
  }
}

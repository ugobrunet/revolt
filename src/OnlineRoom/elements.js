import React, { Component } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { Container, Item } from "../UI/Grid";
import IconButton from "@material-ui/core/IconButton";
import IconVersus from "../icons/Versus";

export const DetachedButton = styled(Button)`
  && {
    margin-left: 4px;
  }
`;

export const DetachedContainer = styled(Container)`
  margin-top: 4px;
`;

export const AlignCenterItem = styled(Item)`
  text-align: center;
`;

export const AlignLeftItem = styled(Item)`
  text-align: left;
`;

export const AlignRightItem = styled(Item)`
  text-align: right;
`;

export class VersusTag extends Component {
  render() {
    return (
      <AlignCenterItem flex={2}>
        <IconButton disabled>
          <IconVersus />
        </IconButton>
      </AlignCenterItem>
    );
  }
}

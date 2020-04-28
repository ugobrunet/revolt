import styled from "styled-components";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

export const DetachedCard = styled(Card)`
  && {
    margin-right: 8px;
    margin-left: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
  }
`;

export const StyledAvatar = styled(Avatar)`
  && {
    background-color: ${props => {
      let color = "DarkSlateBlue";
      switch (props.position) {
        case 1:
          color = "gold";
          break;
        case 2:
          color = "silver";
          break;
        case 3:
          color = "#cd7f32";
          break;
        default:
          break;
      }
      return color;
    }}
`;

export const CenteredCardContent = styled(CardContent)`
  && {
    text-align: center;
  }
`;

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";

export const Logo = styled.span`
  flex-grow: 1;
  text-transform: uppercase;
  :hover {
    cursor: pointer;
  }
`;

export const WhiteSelect = styled(Select)`
  && {
    color: white;
  }
`;

export const DetachedButton = styled(Button)`
  && {
    margin-left: 8px;
    margin-right: 8px;
  }
`;

export const FixedAppBarMargin = styled.div`
  /* Top margin from fixed app bar */
  margin-top: 80px;
`;

import React from "react";
import intl from "react-intl-universal";

import { Container, Item } from "../UI/Grid";
import IconButton from "@material-ui/core/IconButton";
import IconLogout from "@material-ui/icons/ExitToApp";
import Tooltip from "@material-ui/core/Tooltip";
import { Layout } from "./elements";

const OnlineExit = ({ exitButtonLabel, playerName, playerID, onExit }) => {
  return (
    <Layout>
      <Container alignItems="center" spaceBetween>
        <Item>
          <h2>{intl.get("online.hello", { name: playerName })}</h2>
        </Item>
        <Item>
          <Tooltip title={exitButtonLabel}>
            <IconButton onClick={onExit}>
              <IconLogout />
            </IconButton>
          </Tooltip>
        </Item>
      </Container>
    </Layout>
  );
};

export default OnlineExit;

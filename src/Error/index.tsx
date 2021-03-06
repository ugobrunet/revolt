import React from "react";
import intl from "react-intl-universal";

import Fab from "@material-ui/core/Fab";
import { Container } from "../UI/Grid";
import {
  Face,
  Band,
  White,
  Red,
  Eyes,
  Dimples,
  Mouth,
  ErrorTitle,
  ErrorDescription,
} from "./elements";

const handleGoHome = () => window.open(`${process.env.PUBLIC_URL}/`, "_self");

const Error = ({ children }: { children: any }) => (
  <div>
    <Face>
      <Band>
        <White />
        <Red />
      </Band>
      <Eyes />
      <Dimples />
      <Mouth />
    </Face>
    <ErrorTitle>{intl.get("error.oops")}</ErrorTitle>
    <ErrorDescription>{children}</ErrorDescription>
    <Container center>
      <Fab variant="extended" color="primary" onClick={handleGoHome}>
        {intl.get("error.go_home")}
      </Fab>
    </Container>
  </div>
);

export default Error;

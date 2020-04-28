import React, { Fragment, useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./App.css";
import AppWraper from "./AppWrapper";
import Routes from "./Routes";
import initLocale from "./InitLocale";

export default function App() {
  const [loadingLocales, setLoadingLocales] = useState(true);

  useEffect(() => {
    initLocale().then(() => setLoadingLocales(false));
  });

  return (
    <Fragment>
      {loadingLocales ? (
        <LinearProgress color="secondary" />
      ) : (
        <AppWraper>
          <Routes />
        </AppWraper>
      )}
    </Fragment>
  );
}

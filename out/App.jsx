import React, { Fragment, useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./App.css";
import AppWraper from "./AppWrapper";
import Routes from "./Routes";
import initLocale from "./InitLocale";
export default function App() {
    var _a = useState(true), loadingLocales = _a[0], setLoadingLocales = _a[1];
    useEffect(function () {
        initLocale().then(function () { return setLoadingLocales(false); });
    });
    return (<Fragment>
      {loadingLocales ? (<LinearProgress color="secondary"/>) : (<AppWraper>
          <Routes />
        </AppWraper>)}
    </Fragment>);
}
//# sourceMappingURL=App.jsx.map
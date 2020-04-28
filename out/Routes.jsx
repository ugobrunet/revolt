import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ErrorPage from "./Error";
import LinearProgress from "@material-ui/core/LinearProgress";
var Loading = function (props) {
    return props.error ? (<ErrorPage>{props.error}</ErrorPage>) : (<LinearProgress color="secondary"/>);
};
var LoadableOnlinePage = lazy(function () { return import("./OnlineLobbyPage"); });
// TODO add react-loadable
var Routes = function () { return (<Router>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/" component={LoadableOnlinePage}/>
        <Route path="/online" component={LoadableOnlinePage}/>
      </Switch>
    </Suspense>
  </Router>); };
export default Routes;
//# sourceMappingURL=Routes.jsx.map
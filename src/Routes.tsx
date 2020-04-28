import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ErrorPage from "./Error";
import LinearProgress from "@material-ui/core/LinearProgress";

const Loading = (props: any) =>
  props.error ? (
    <ErrorPage>{props.error}</ErrorPage>
  ) : (
    <LinearProgress color="secondary" />
  );

const LoadableOnlinePage = lazy(() => import("./OnlineLobbyPage"));

// TODO add react-loadable
const Routes = () => (
  <Router>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/" component={LoadableOnlinePage} />
        <Route path="/online" component={LoadableOnlinePage} />
      </Switch>
    </Suspense>
  </Router>
);

export default Routes;

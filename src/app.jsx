import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login/login.jsx"
import Callback from "./Callback/callback.jsx"
import Share from "./Share/share.jsx"

(function() {
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
})();

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/share">
          <Share />
        </Route>
        <Route path="/callback">
          <Callback />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
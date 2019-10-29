import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Login from "./Login/login.jsx"
import Callback from "./Callback/callback.jsx"
import Share from "./Share/share.jsx"
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1DB954',
      contrastText: '#fff'
    },
    secondary: { main: '#fff' },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
};

export default App;
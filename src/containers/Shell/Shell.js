import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../Home';
import PlaylistCreated from '../PlaylistCreated';
import PlaylistAdd from '../PlaylistAdd';
import PlaylistAddSuccess from '../PlaylistAddSuccess';
import ErrorPage from '../Error';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/create/:id" component={PlaylistCreated} />
        <Route
          exact
          path="/playlist/:id/success"
          component={PlaylistAddSuccess}
        />
        <Route exact path="/playlist/:id" component={PlaylistAdd} />
        <Route component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default App;

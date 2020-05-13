import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from './LoginPage';
import Home from './Home';
import ErrorPage from './ErrorPage';

function App() {

  const Page404 = ({ location }) => (
    <div>
      <h2>No match found for <code>{location.pathname}</code></h2>
    </div>
  );

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={ LoginPage }/>
          <Route path="/home" exact component={ Home }/>
          <Route path="/ErrorPage" exact component={ ErrorPage }/>
          <Route component={Page404} />
        </Switch> 
      </Router>
    </div>
  );
}

export default App;

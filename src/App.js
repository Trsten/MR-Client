import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from './LoginPage';
import Home from './Home';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={ LoginPage }/>
          <Route path="/home" exact component={ Home }/>
         
        </Switch> 
      </Router>
    </div>
  );
}

export default App;

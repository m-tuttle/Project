import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login'
import Navbar from './components/Navbar'


class App extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false
        };
    }
    
render() {

    if(!this.state.loggedIn) {
        return (

            <Login />

        )
    } 
    else {
        return (
        
        <Router>
        <div>
            <Navbar />
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/profile" component={Profile} />
        </div>
      </Router>
    )
    }
}

}

export default App;

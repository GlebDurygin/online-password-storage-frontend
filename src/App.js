import React from 'react';
import './App.css';
import SignUp from "./components/signup/SignUp";
import SignIn from "./components/signin/SignIn";
import Records from "./components/records/Records";
import {BrowserRouter, Route, Switch} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/sign-up" component={SignUp}/>
                <Route path="/users/:userId" component={Records}/>
                <Route path="/" component={SignIn}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;

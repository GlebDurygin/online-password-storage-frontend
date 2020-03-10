import React from 'react';
import './App.css';
import SignUp from "./components/signup/SignUp";
import SignIn from "./components/signin/SignIn";
import Records from "./components/records/Records";
import Record from "./components/record/Record";
import {BrowserRouter, Route, Switch} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/users/:userId/record" component={Record}/>
                <Route path="/users/:userId" component={Records}/>
                <Route path="/sign-up" component={SignUp}/>
                <Route path="/" component={SignIn}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;

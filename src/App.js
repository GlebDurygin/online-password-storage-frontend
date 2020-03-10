import React from 'react';
import './App.css';
import SignUp from "./components/signup/SignUp";
import SignIn from "./components/signin/SignIn";
import UserProfile from "./components/user-profile/UserProfile";
import {BrowserRouter, Route, Switch} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/user-profile/:userId" component={UserProfile}/>
                <Route path="/sign-up" component={SignUp}/>
                <Route path="/" component={SignIn}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;

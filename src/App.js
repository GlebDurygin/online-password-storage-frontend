import React from 'react';
import './App.css';
import SignUp from "./components/signup/SignUp";
import {BrowserRouter, Route, Switch} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={SignUp}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;

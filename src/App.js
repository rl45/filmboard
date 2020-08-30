import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import session from './services/session';
import Header from "./components/Header";
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Activate from "./components/Activate";
import Billing from './components/Billing';
import Projects from './components/Projects';
import Project from './components/Project';
import ProjectPage from "./components/ProjectPage";

function App() {
    const [showHeader, setShowHeader] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if(session.get('user') && session.get('user')._id !== undefined) {
            setLoggedIn(true);
        }
    }, []);

    return (
        <BrowserRouter>
            {showHeader && <Header loggedIn={loggedIn} onLogout={() => setLoggedIn(false)} />}
            <Switch>
                <Route exact path='/login' render={props => <Login onLogin={() => setLoggedIn(true)} forPopup={false} />}/>
                <Route exact path='/signup' render={props => <Signup onLogin={() => setLoggedIn(true)} forPopup={false} />}/>
                <Route exact path='/fp' render={props => <ForgotPassword />} />
                <Route exact path='/rp' render={props => <ResetPassword />} />
                <Route exact path='/activate' render={props => <Activate />} />
                <Route exact path='/billing' render={props => <Billing />}/>
                <Route exact path='/' render={props => <Projects />}/>
                <Route exact path='/projects/:id' render={props => <ProjectPage />}/>
                <Route exact path='/project' render={props => <Project />}/>
                <Route exact path='/project/:id' render={props => <Project />}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;

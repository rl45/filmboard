import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import session from '../services/session';
import {Redirect} from 'react-router-dom';
import {swalInfo} from "../utils/swal";
import Login from "./Login";
import Signup from "./Signup";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

export default function LoginOrSignup(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);

    const handleLogin = async e => {
        e.preventDefault();
        if(!email || email.length === 0) {
            swalInfo(`Email is required.`);
            return;
        } else {
            if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
                swalInfo(`Please enter a valid email address.`);
                return;
            }
        }
        if(!password || password.length === 0) {
            swalInfo(`Password is required.`);
            return;
        }
        await userService.login({email: email, password: password})
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    const data = result.data;
                    setErrorMessage('');
                    setSuccessMessage("Login successful! Redirecting...");

                    session.set('loggedIn', true);
                    session.set('user', data);
                    props.onLogin();
                    setRedirectTo(`/`);
                }
            });
    }

    const styles = {
        background: '#343232',
        width: '100%',
        height: '100%'
    };

    return (
        <Rodal visible={true} onClose={() => props.onClose()} closeOnEsc={true} customStyles={styles}>
        <div className="container text-center">
            {redirectTo && <Redirect push to={redirectTo}/>}
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab"
                       aria-controls="home" aria-selected="true">Signup</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab"
                       aria-controls="profile" aria-selected="false">Login</a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <Signup forPopup={true} />
                </div>
                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <Login forPopup={true} />
                </div>
            </div>
        </div>
        </Rodal>
    );
}
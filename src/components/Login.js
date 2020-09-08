import React, { useState, useEffect } from 'react';
import userService from '../services/user';
import session from '../services/session';
import config from "../config.json";
import { Redirect } from 'react-router-dom';

export default function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);
    const [imgUrl, setImgUrl] = useState(`${config.appUrl}/images/banner_2.jpg`);

    useEffect(() => {
        session.clear();
    }, []);

    const handleLogin = async e => {
        e.preventDefault();
        if (!email || email.length === 0) {
            setErrorMessage(`Email is required.`);
            return;
        } else {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
                setErrorMessage(`Please enter a valid email address.`);
                return;
            }
        }
        if (!password || password.length === 0) {
            setErrorMessage(`Password is required.`);
            return;
        }
        await userService.login({ email: email, password: password })
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    const data = result.data;
                    setErrorMessage('');
                    setSuccessMessage("Login successful! Redirecting...");
                    session.set('user', data);
                    if (props.forPopup === false) {
                        props.onLogin();
                        setRedirectTo(`/`);
                    }
                    else {
                        document.location.reload();
                    }
                }
            });
    }

    return (
        <div>
            <img id="banner" src={imgUrl} alt="Client Collaboration Software Filmboard" />
            <div className="container-fluid text-center div-login" style={{ marginTop: '50px', width: '600px' }}>
                {redirectTo && <Redirect push to={redirectTo} />}
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-12">
                        <h2 className="m-4">Login</h2>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <input type="text" className="form-control"
                                    placeholder="Email" required="required"
                                    value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control"
                                    placeholder="Password" required="required"
                                    value={password} onChange={e => setPassword(e.target.value)} />
                            </div>

                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                            {successMessage && <div className="alert alert-success">{successMessage}</div>}

                            {props.forPopup === false && <a href="/signup" className="btn btn-link">Signup here</a>}

                            <button type="submit" className="btn btn-pink" onClick={e => handleLogin(e)}>Login
                        </button>
                            <div className="form-group text-left" style={{ marginTop: '20px' }}>
                                <p>Forgot your password?<a href="/fp" className="btn btn-link">Reset here</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
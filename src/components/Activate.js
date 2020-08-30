import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import session from '../services/session';
import {getUrlParam} from "../utils/utils";

export default function Activate(props) {

    const [isActive, setIsActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        session.clear();

        const token = getUrlParam(window.location.href, 'token', '');
        if(!token || token.length !== 24) {
            setErrorMessage(`Invalid activation token. Please do not change the provided URL.`);
            return;
        }

        userService.activateAccount(token)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    setErrorMessage('');
                    setIsActive(true);
                }
            });
    }, []);

    return (
        <div className="container-fluid text-center div-login" style={{marginTop: '50px', width: '600px'}}>
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <h2 className="m-4">Account Activation</h2>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {
                        isActive &&
                        <div>
                            <p style={{fontSize: '20px'}}>Your account is activated successfully! Please login and start using the application.</p>
                            <a href="/login" className="btn btn-link">Login here</a>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
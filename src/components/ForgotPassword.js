import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import session from '../services/session';
import {Redirect} from 'react-router-dom';

export default function ForgotPassword(props) {

    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
        session.clear();
    }, []);

    const handleForgotPassword = async e => {
        e.preventDefault();
        if(!email || email.length === 0) {
            setErrorMessage(`Email is required.`);
            return;
        } else {
            if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
                setErrorMessage(`Please enter a valid email address.`);
                return;
            }
        }

        await userService.forgotPassword(email)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    setErrorMessage('');
                    setSuccessMessage("Email sent successfully! Please check your email.");
                }
            });
    }

    const clearMessages = e => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
    }

    return (
        <div className="container-fluid text-center div-login" style={{marginTop: '50px', width: '600px'}}>
            {redirectTo && <Redirect push to={redirectTo}/>}
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <h2 className="m-4">Forgot Password</h2>
                    <p className="m-4">Provide your email address to get password reset information.</p>
                    <form onSubmit={handleForgotPassword}>
                        <div className="form-group">
                            <input type="text" className="form-control"
                                   placeholder="Email" required="required"
                                   onBlur={clearMessages}
                                   value={email} onChange={e => setEmail(e.target.value)}/>
                        </div>

                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                        {successMessage && <div className="alert alert-success">{successMessage}</div>}

                        <a href="/login" className="btn btn-link">Login here</a>

                        <button type="submit" className="btn btn-pink" onClick={handleForgotPassword}>Send Email
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
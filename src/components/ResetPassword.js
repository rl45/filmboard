import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import session from '../services/session';
import { getUrlParam } from '../utils/utils'

export default function ResetPassword(props) {

    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        session.clear();
    }, []);

    const handleResetPassword = async e => {
        e.preventDefault();
        if (!password1 || password1.length === 0) {
            setErrorMessage(`Password is required.`);
            return;
        }

        if (password1 !== password2) {
            setErrorMessage(`Password did not match.`);
            return;
        }

        const token = getUrlParam(window.location.href, 'token', '');
        if(!token || token.length !== 36) {
            setErrorMessage(`Invalid reset token. Please do not change the provided URL.`);
            return;
        }

        await userService.resetPassword(token, password1)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    setErrorMessage('');
                    setSuccessMessage("Password reset successfully! Please login with your password.");
                }
            });
    }

    return (
        <div className="container-fluid text-center div-login" style={{marginTop: '50px', width: '600px'}}>
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <h2 className="m-4">Reset Password</h2>
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <input type="password" className="form-control"
                                   placeholder="New password" required="required"
                                   value={password1} onChange={e => setPassword1(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control"
                                   placeholder="Respeat new password" required="required"
                                   value={password2} onChange={e => setPassword2(e.target.value)}/>
                        </div>

                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                        {successMessage && <div className="alert alert-success">{successMessage}</div>}

                        <a href="/login" className="btn btn-link">Login here</a>

                        <button type="submit" className="btn btn-pink"
                                onClick={e => handleResetPassword(e)}>Reset
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
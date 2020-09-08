import React, { useState, useEffect } from 'react';
import userService from '../services/user';
import config from "../config.json";
import session from '../services/session';

export default function Signup(props) {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [position, setPosition] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [imgUrl, setImgUrl] = useState(`${config.appUrl}/images/banner.jpg`);

    useEffect(() => {
        session.clear();
    }, []);

    const handleSignup = async e => {
        e.preventDefault();
        if (!fullname || fullname.length === 0) {
            setErrorMessage(`Full Name is required.`);
            return;
        }
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

        await userService.signup(fullname, email, password, position)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    const data = result.data;
                    setErrorMessage('');
                    setSuccessMessage("Signup successful! Please check your email and activate your account.");
                }
            });
    }

    const formatFullname = e => {
        e.preventDefault();
        let splitStr = fullname.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++)
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);

        setFullname(splitStr.join(' '));
    }

    return (
        <div>
            <img id="banner" src={imgUrl} alt="Client Collaboration Software Filmboard" />
            <div className="container-fluid text-center div-signup" style={{ marginTop: '50px', width: '600px' }}>
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-12">
                        <h1 className="m-4">Avoid Miscommunication</h1>
                        <h2 className="m-4">Sign Up for Free</h2>
                        <form onSubmit={handleSignup}>
                            <div className="form-group">
                                <div class="input-container">
                                    <i class="fa fa-user icon"></i>
                                    <input type="text" className="form-control input-field" id="txtSignupFullname"
                                        placeholder="Full Name" required="required" onBlur={formatFullname}
                                        value={fullname} onChange={e => setFullname(e.target.value)} >
                                    </input>
                                </div>
                            </div>
                            <div className="form-group">
                                <div class="input-container">
                                    <i class="fa fa-envelope icon"></i>
                                    <input type="email" className="form-control input-field"
                                        placeholder="Email" required="required"
                                        value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div class="input-container">
                                    <i class="fa fa-key icon"></i>
                                    <input type="password" className="form-control input-field"
                                        placeholder="Password" required="required"
                                        value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div class="input-container">
                                    <i class="fa fa-building icon"></i>
                                    <input type="text" className="form-control input-field"
                                        placeholder="Company Position (Optional)"
                                        value={position} onChange={e => setPosition(e.target.value)} />
                                </div>
                            </div>

                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                            {successMessage && <div className="alert alert-success">{successMessage}</div>}

                            {props.forPopup === false && <a href="/login" className="btn btn-link">Login here</a>}

                            <button type="submit" className="btn btn-pink"
                                onClick={e => handleSignup(e)}>Signup
                        </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
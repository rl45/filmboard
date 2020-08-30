import React, {useState} from 'react';
import session from '../services/session';
import {Redirect, NavLink} from 'react-router-dom';
import config from '../config.json'
import {swalError, swalName, swalSuccess, swalPassword, swalPicture, swalPosition} from "../utils/swal";
import userService from "../services/user";
import {getPackage} from '../utils/utils';

export default function Header(props) {
    const [redirectTo, setRedirectTo] = useState(null);

    const handleLogout = e => {
        e.preventDefault();
        props.onLogout();

        setTimeout(() => {
            session.clear();
            setRedirectTo('/login');
        }, 500);
    }

    const handleUpdateName = e => {
        e.preventDefault();
        swalName(session.get('user').fullname, async newName => {
            await userService.updateName(newName)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data) {
                        swalSuccess(`Name updated successfully!`);
                        document.getElementById('username-header').innerText = newName;
                        session.set('user', result.data);
                    }
                });
        });
    }

    const handleUpdatePassword = e => {
        e.preventDefault();
        swalPassword(async newPassword => {
            await userService.updatePassword(newPassword)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data) {
                        swalSuccess(`Password updated successfully!`);
                        session.set('user', result.data);
                    }
                });
        });
    }

    const handleUpdatePosition = e => {
        e.preventDefault();
        swalPosition(session.get('user').position || ``, async position => {
            await userService.updatePosition(position)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data) {
                        swalSuccess(`Position updated successfully!`);
                        session.set('user', result.data);
                    }
                });
        });
    }

    const handleUpdatePicture = e => {
        e.preventDefault();
        swalPicture(async file => {
            const str = await getBaseUrl(file);
            await userService.updatePicture(str)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data) {
                        swalSuccess(`Picture updated successfully!`);
                        document.getElementById('img-circle-header').src = str;
                        session.set('user', result.data);
                    }
                });
        });
    }

    const getBaseUrl = file => new Promise((resolve, reject) => {
        try {
            var reader = new FileReader();
            var baseString;
            reader.onloadend = function () {
                baseString = reader.result;
                resolve(baseString);
            };
            reader.readAsDataURL(file);
        }
        catch(e) {
            reject(e);
        }
    });

    const getPackageName = () => {
        const pkgId = session.get('user').package;
        return pkgId;// getPackage(pkgId).name;
    }

    return (
        <div>
            {redirectTo && <Redirect push to={redirectTo}/>}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/" style={{color: 'rgb(56,78,210)', fontWeight: '500'}}>
                    <img className="img-logo" src="../logo.png"/>
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className="navbar-nav ml-auto">
                        {
                            props.loggedIn !== true &&
                            <ul className="navbar-nav pull-right">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/signup">Signup</NavLink>
                                </li>
                            </ul>
                        }
                        {
                            props.loggedIn === true &&
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img id="img-circle-header" className="img-circle-header" src={session.get('user').picture} />
                                    <span id="username-header">{session.get('user') && session.get('user').fullname}</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right"
                                     aria-labelledby="navbarDropdownMenuLink">
                                    <button className="dropdown-item" onClick={e => setRedirectTo("/")}>My projects
                                    </button>
                                    <button className="dropdown-item" onClick={handleUpdateName}>Update your name
                                    </button>
                                    <button className="dropdown-item" onClick={handleUpdatePassword}>Update
                                        password
                                    </button>
                                    <button className="dropdown-item" onClick={handleUpdatePosition}>Update
                                        company position
                                    </button>
                                    <button className="dropdown-item" onClick={handleUpdatePicture}>Update
                                        your picture
                                    </button>
                                    <button className="dropdown-item" onClick={e => setRedirectTo("/billing")}>Billing ({getPackageName()})</button>
                                    <button className="dropdown-item" onClick={e => handleLogout(e)}
                                            style={{color: 'red'}}><i className="fa fa-power-off"
                                                                      style={{marginRight: '5px'}}></i>Logout
                                    </button>
                                </div>
                            </li>
                        }
                    </div>
                </div>
            </nav>
        </div>
    );
}
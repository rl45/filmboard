import React, {useState} from 'react';
import Login from "./Login";
import Signup from "./Signup";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import '../css/tabs.css';
import '../css/rodal.css';
import $ from 'jquery';

export default function LoginOrSignup(props) {

    const [component, setComponent] = useState('signup');

    const styles = {
        background: '#343232',
        width: '80%',
        height: '80%'
    };

    const handleUpdateComponent = (e, c) => {
        document.querySelectorAll(`.login-signup .nav-item`).forEach(x => x.classList.remove('active'));
        $(e.target).closest(`.nav-item`).addClass('active');
        setComponent(c);
    }

    return (
        <Rodal visible={true} onClose={() => props.onClose()} closeOnEsc={true} closeMaskOnClick={false}
               customStyles={styles}>
            <div className="container text-center login-signup">
                <div className="row mt-10">
                    <div className="col-12 col-sm-12 text-center">
                        <div className="tabbable-panel">
                            <div className="tabbable-line">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item active">
                                        <a className="nav-link"
                                           onClick={e => handleUpdateComponent(e, 'signup')}>Signup</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link"
                                           onClick={e => handleUpdateComponent(e, 'login')}>Login</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-12 text-center">
                        {
                            component === 'signup' && <Signup forPopup={true}/>
                        }
                        {
                            component === 'login' && <Login forPopup={true}/>
                        }
                    </div>
                </div>
            </div>
        </Rodal>
    );
}
import React, { useState, useEffect } from 'react';
import userService from '../services/user';
import session from '../services/session';
import { Redirect } from 'react-router-dom';
import config from "../config.json";
import { getPackage } from "../utils/utils";
import { swalInfo, swalLoading, swalPkgChange } from '../utils/swal';
import '../css/billing.css';
import StripeCheckout from 'react-stripe-checkout';
import moment from 'moment';
import Swal from 'sweetalert2';
import Switch from 'react-switch';

export default function Billing(props) {

    const [activePackage, setActivePackage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);
    const [choosenPackage, setChoosenPackage] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        userService.getPackage()
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    setErrorMessage('');
                    const obj = {
                        ...result.data,
                        ...getPackage(result.data.id)
                    };
                    setActivePackage(obj);
                }
            });
    }, []);

    const updatePackage = async id => {
        await userService.updatePackage(id)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    setErrorMessage('');
                    setSuccessMessage(`Your billing plan is updated successfully.`);
                    setTimeout(async () => {
                        const userId = session.get('user')._id;
                        const result = await userService.get(userId);
                        session.set('user', result.data);
                        window.location.reload();
                    }, 500);
                }
            });
    }

    const handleChoosePackage = id => {
        if (activePackage) {
            const activePackageId = parseInt(activePackage.id);
            if (id === activePackageId) {
                swalInfo(`You are already on the ${activePackage.name} plan.`);
            } else if (id < activePackageId) {
                swalPkgChange(
                    `Downgrading!`,
                    `Your current package status will be overwritten and new limits will be applied!`,
                    `info`,
                    async () => {
                        if (id === 1) {
                            await updatePackage(id);
                            return;
                        }

                        setChoosenPackage(getPackage(id))
                    });
            } else if (id > activePackageId) {
                swalPkgChange(
                    `Upgrade`,
                    `Upgrade your plan`,
                    `info`,
                    () => setChoosenPackage(getPackage(id)));
            }
        }
    }

    const handleToken = async token => {
        await userService.checkout(token, choosenPackage)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    updatePackage(choosenPackage.id);
                }
            });
    }

    const handleCancelSubscription = async () => {
        swalPkgChange(`Are you sure?`, `You can always subscribe to an other package.`, `info`, async () => {
            await userService.cancelSubscription()
                .then(result => {
                    if (result.error) {
                        setErrorMessage(result.error);
                        return;
                    }

                    if (result.data) {
                        updatePackage(1);
                        setErrorMessage('');
                        setSuccessMessage(`Your billing plan is updated successfully.`);
                        setTimeout(async () => {
                            const userId = session.get('user')._id;
                            const result = await userService.get(userId);
                            session.set('user', result.data);
                            window.location.reload();
                        }, 500);
                    }
                });
        });
    }

    return activePackage && (
        <div className="container text-center billing">
            {redirectTo && <Redirect push to={redirectTo} />}
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <h2 className="m-4">
                        <i className="fa fa-chevron-left btn-back" onClick={() => setRedirectTo(`/`)}
                            title="Back to dashboard"></i>
                        Billing
                    </h2>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <h4>Your current billing plan is <span className="pkg-active">{activePackage.name}</span>
                        {activePackage.id !== 1 && <span>, and its valid till <span
                            className="pkg-active">{moment(activePackage.expires).format('DD MMM YYYY')}</span></span>}
                    </h4>
                    {
                        session.get('user').package !== "1" &&
                        <button className="btn btn-link" onClick={handleCancelSubscription}>Cancel your subscription</button>
                    }
                </div>
            </div>
            {
                errorMessage &&
                <div className="row pkgs-row">
                    <div className="col-12 col-sm-12 col-md-12">
                        <div className="alert alert-danger">{errorMessage}</div>
                    </div>
                </div>
            }
            {
                successMessage &&
                <div className="row pkgs-row">
                    <div className="col-12 col-sm-12 col-md-12">
                        <div className="alert alert-success">{successMessage}</div>
                    </div>
                </div>
            }
            <div className="row pkgs-row">
                <div className="col-12 col-sm-12 col-md-12">
                    <label htmlFor="material-switch">
                        <span className="pkg-duration">Monthly</span>
                        <Switch
                            checked={checked}
                            onChange={checked => setChecked(checked)}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rGBa(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rGBa(0, 0, 0, 0.2)"
                            height={20}
                            width={48}
                            className="react-switch"
                            id="material-switch"
                        />
                        <span className="pkg-duration">Annually</span>
                    </label>
                </div>
            </div>

            {
                checked === false &&
                <div className="row pkgs-row">
                    <div className="col-4 col-sm-4 col-md-4">
                        <div className="pkg">
                            <span className="pkg-name">Starter</span>
                            <p className="pkg-price">$0</p>
                            <span className="billing-info">Free forever.</span>
                            <ul style="list-style-type:none">
                                <li> <i class="fa fa-check" aria-hidden="true" style="color:#3444D8;padding:5px;"></i> 7 Projects</li>
                                <hr className="hr" />
                                <li> <i class="fa fa-check" aria-hidden="true" style="color:#3444D8;padding:5px;"></i> 5 Videos per project</li>
                                <hr className="hr" />
                                <li> <i class="fa fa-check" aria-hidden="true" style="color:#3444D8;padding:5px;"></i> 50MB Space for vendor uploads</li>
                                <hr className="hr" />
                            </ul>
                            <button className="btn btn-outline-custom btn-pkg-choose"
                                onClick={e => handleChoosePackage(1)}>Free Plan
                            </button>
                        </div>
                    </div>
                    <div className="col-4 col-sm-4 col-md-4">
                        <div className="pkg">
                            <span className="pkg-name">Plus</span>
                            <p className="pkg-price">$9</p>
                            <span className="billing-info">Per month, billed monthly.</span>
                            <ul>
                                <li>15 Projects</li>
                                <hr className="hr" />
                                <li>20 Videos per project</li>
                                <hr className="hr" />
                                <li>200MB Space for vendor uploads</li>
                                <hr className="hr" />
                                <li>Money back guarantee</li>
                            </ul>
                            <button className="btn btn-outline-custom btn-pkg-choose"
                                onClick={e => handleChoosePackage(2)}>Choose <strong>Plus Monthly</strong>
                            </button>
                        </div>
                    </div>
                    <div className="col-4 col-sm-4 col-md-4">
                        <div className="pkg">
                            <span className="pkg-name">Premium</span>
                            <p className="pkg-price">$15</p>
                            <span className="billing-info">Per month, billed monthly.</span>
                            <ul>
                                <li>Unlimited Projects</li>
                                <hr className="hr" />
                                <li>Unlimited Videos per project</li>
                                <hr className="hr" />
                                <li>2GB Space for vendor uploads</li>
                                <hr className="hr" />
                                <li>Money back guarantee</li>
                            </ul>
                            <button className="btn btn-outline-custom btn-pkg-choose"
                                onClick={e => handleChoosePackage(3)}>Choose <strong>Premium Monthly</strong>
                            </button>
                        </div>
                    </div>
                </div>
            }
            {
                checked === true &&
                <div className="row pkgs-row">
                    <div className="col-4 col-sm-4 col-md-4">
                        <div className="pkg">
                            <span className="pkg-name">Starter</span>
                            <p className="pkg-price">$0</p>
                            <span className="billing-info">Free forever.</span>
                            <ul>
                                <li>7 Projects</li>
                                <hr className="hr" />
                                <li>5 Videos per project</li>
                                <hr className="hr" />
                                <li>50MB Space for vendor uploads</li>
                            </ul>
                            <button className="btn btn-outline-custom btn-pkg-choose"
                                onClick={e => handleChoosePackage(1)}>Free Plan
                            </button>
                        </div>
                    </div>
                    <div className="col-4 col-sm-4 col-md-4">
                        <div className="pkg">
                            <span className="pkg-name">Plus</span>
                            <p className="pkg-price">$99</p>
                            <span className="billing-info">Per year, billed annually.</span>
                            <ul>
                                <li>15 Projects</li>
                                <hr className="hr" />
                                <li>20 Videos per project</li>
                                <hr className="hr" />
                                <li>200MB Space for vendor uploads</li>
                                <hr className="hr" />
                                <li>Money back guarantee</li>
                            </ul>
                            <button className="btn btn-outline-custom btn-pkg-choose"
                                onClick={e => handleChoosePackage(4)}>Choose <strong>Plus Annually</strong>
                            </button>
                        </div>
                    </div>
                    <div className="col-4 col-sm-4 col-md-4">
                        <div className="pkg">
                            <span className="pkg-name">Premium</span>
                            <p className="pkg-price">$119</p>
                            <span className="billing-info">Per year, billed annually.</span>
                            <ul>
                                <li><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                </svg>Unlimited Projects</li>
                                <hr className="hr" />
                                <li>20 Videos per project</li>
                                <hr className="hr" />
                                <li>2GB Space for vendor uploads</li>
                                <hr className="hr" />
                                <li>Money back guarantee</li>
                            </ul>
                            <button className="btn btn-outline-custom btn-pkg-choose"
                                onClick={e => handleChoosePackage(5)}>Choose <strong>Premium Annually</strong>
                            </button>
                        </div>
                    </div>
                </div>
            }

            <div className="row pkgs-row">
                <div className="col-12 col-sm-12 col-md-12">
                    {
                        choosenPackage &&
                        <StripeCheckout
                            token={handleToken}
                            stripeKey={config.stripePublishableKey}
                            allowRemeMBerMe={false}
                            shippingAddress={false}
                            billingAddress={false}
                            name={config.appTitle}
                            email={session.get('user').email}
                            amount={choosenPackage.price * 100}
                            currency="USD"
                            opened={() => Swal.close()}
                            closed={() => setChoosenPackage(null)}>
                            <button className="btn btn-lg btn-pink" onClick={() => swalLoading()}>
                                <i className="fab fa-cc-stripe" style={{ marginRight: '5px' }}></i>Pay ${choosenPackage.price} with Stripe
                            </button>
                        </StripeCheckout>
                    }
                </div>
            </div>
        </div>
    );
}
import axios from 'axios';
import config from '../config.json';
import session from "./session";
import moment from "moment";
import {getPackage} from "../utils/utils";

export default class {

    static getAll = async keyword => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            keyword: keyword
        };

        await axios.post(`${config.api}/users`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static get = async id => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${config.api}/users/${id}`)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static getPackage = async () => {
        let result = {
            data: null,
            error: null
        };

        const id = session.get('user')._id;
        await axios.get(`${config.api}/users/package/${id}`)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static getPackageByProjectId = async projectId => {
        let result = {
            data: null,
            error: null
        };
        await axios.get(`${config.api}/users/package/project/${projectId}`)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static updatePackage = async id => {
        let result = {
            data: null,
            error: null
        };

        const expiryDate = id < 4 ? moment().add(1, 'months') : moment().add(1, 'years');
        const data = {
            package: id,
            id: session.get('user')._id,
            renewed: Date.now(),
            expires: new Date(expiryDate),
            pkg: getPackage(id)
        };

        await axios.post(`${config.api}/users/package`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static checkout = async (token, pkg) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            id: session.get('user')._id,
            token: token,
            pkg: pkg
        };

        await axios.post(`${config.api}/users/checkout`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static cancelSubscription = async () => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            id: session.get('user')._id
        };

        await axios.post(`${config.api}/users/cancel-subscription`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static login = async ({ email, password }) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            email: email,
            password: password
        };

        await axios.post(`${config.api}/users/login`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static forgotPassword = async email => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            email: email
        };

        await axios.post(`${config.api}/users/forgotpassword`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static resetPassword = async (token, password) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            token: token,
            password: password
        };

        await axios.post(`${config.api}/users/resetpassword`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static activateAccount = async id => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            id: id
        };

        await axios.post(`${config.api}/users/activate`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static signup = async (fullname, email, password, position) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            fullname: fullname,
            email: email,
            password: password,
            position: position
        };

        await axios.post(`${config.api}/users/signup`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static updatePassword = async password => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            password: password
        };

        await axios.post(`${config.api}/users/up/${session.get('user')._id}`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static updateName = async fullname => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            fullname: fullname
        };

        await axios.post(`${config.api}/users/un/${session.get('user')._id}`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static updatePicture = async str => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            picture: str
        };

        await axios.post(`${config.api}/users/upic/${session.get('user')._id}`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    static updatePosition = async position => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            position: position
        };

        await axios.post(`${config.api}/users/upos/${session.get('user')._id}`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }
}
import axios from 'axios';
import config from '../config.json';
import session from "./session";

export default class {

    static getAll = async keyword => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            keyword: keyword,
            userId: session.get('user')._id
        };

        await axios.post(`${config.api}/projects/all`, data)
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

    static getByUserId = async userId => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${config.api}/projects/all`, {userId: userId})
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch((err) => {
                result.error = err.response.data;
            });

        return result;
    }

    static add = async obj => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${config.api}/projects`, obj)
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

        await axios.get(`${config.api}/projects/${id}`)
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

    static delete = async id => {
        let result = {
            data: null,
            error: null
        };

        await axios.delete(`${config.api}/projects/${id}`)
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

    static update = async (id, obj) => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${config.api}/projects/${id}`, obj)
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
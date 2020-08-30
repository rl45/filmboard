import axios from 'axios';
import config from '../config.json';

export default class {

    static add = async obj => {
        let result = {
            data: null,
            error: null
        };

        const fd = new FormData();
        for (const [key, value] of Object.entries(obj)) {
            fd.append(key, value);
        }

        await axios.post(`${config.api}/storyboards`, fd)
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

        const fd = new FormData();
        for (const [key, value] of Object.entries(obj)) {
            fd.append(key, value);
        }

        await axios.post(`${config.api}/storyboards/${id}`, fd)
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

        await axios.delete(`${config.api}/storyboards/${id}`)
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

    static getStats = async projectId => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${config.api}/storyboards/stats/${projectId}`)
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
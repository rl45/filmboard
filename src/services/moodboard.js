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

        await axios.post(`${config.api}/moodboards`, fd)
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

        await axios.post(`${config.api}/moodboards/${id}`, fd)
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

        await axios.delete(`${config.api}/moodboards/${id}`)
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

    static getStats = async id => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${config.api}/moodboards/stats/${id}`)
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
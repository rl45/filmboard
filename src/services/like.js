import axios from 'axios';
import config from '../config.json';
import session from "./session";
import moment from "moment";

export default class {

    static add = async (type, moodboardId, projectId) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            date: moment().format(),
            userId: session.get('user')._id,
            type: type,
            moodboardId: moodboardId,
            projectId: projectId
        };

        await axios.post(`${config.api}/likes`, data)
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

    static check = async (type, moodboardId, projectId) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            userId: session.get('user')._id,
            type: type,
            moodboardId: moodboardId,
            projectId: projectId
        };

        await axios.post(`${config.api}/likes/check`, data)
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

    static delete = async (type, moodboardId, projectId) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            userId: session.get('user')._id,
            type: type,
            moodboardId: moodboardId,
            projectId: projectId
        };

        await axios.post(`${config.api}/likes/remove`, data)
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
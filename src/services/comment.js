import axios from 'axios';
import config from '../config.json';
import session from "./session";
import moment from "moment";

export default class {

    static getByMoodboard = async moodboardId => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${config.api}/comments/moodboard/${moodboardId}`)
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

    static getByStoryboard = async projectId => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${config.api}/comments/storyboard/project/${projectId}`)
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

    static add = async (comment, st, et, type, moodboardId, projectId) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            text: comment,
            startTime: st,
            endTime: et,
            date: moment().format(),
            type: type,
            userId: session.get('user')._id,
            moodboardId: moodboardId || null,
            projectId: projectId
        };

        await axios.post(`${config.api}/comments`, data)
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

        await axios.get(`${config.api}/comments/${id}`)
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

        await axios.delete(`${config.api}/comments/${id}`)
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

    static update = async (id, comment, st, et) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            text: comment,
            startTime: st,
            endTime: et,
            userId: session.get('user')._id
        }

        await axios.post(`${config.api}/comments/${id}`, data)
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
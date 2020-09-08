import React, { useState, useEffect } from 'react';
import session from '../services/session';
import { Redirect } from 'react-router-dom';
import moment from "moment";
import {
    swalDeleteForm,
    swalError,
    swalSuccess,
    swalInfo,
    swalUploading
} from "../utils/swal";
import projectService from "../services/project";
import moodboardService from "../services/moodboard";
import storyboardService from "../services/storyboard";
import Swal from 'sweetalert2';
import Moodboard from "./Moodboard";
import Storyboard from './Storyboard';
import UploadView from './UploadView';
import '../css/project.css';
import '../css/tabs.css';
import UploadAndViewVendorFiles from "./UploadAndViewVendorFiles";

export default function Project(props) {

    const [redirectTo, setRedirectTo] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [project, setProject] = useState(null);
    const [moodboards, setMoodboards] = useState(null);
    const [storyboards, setStoryboards] = useState(null);

    useEffect(() => {
        reloadProject();
    }, []);

    const reloadProject = async () => {
        let id = window.location.href.split('/').pop();
        if (id && id.length === 24) {
            await projectService.get(id)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data.length === 1) {
                        loadProject(result.data[0]);
                    }
                });
        }
    }

    const loadProject = project => {
        setTitle(project.title);
        setDescription(project.description);
        setProject(project);
        setMoodboards(project.moodboards);
        setStoryboards(project.storyboards);
    }

    const validUrl = str => {
        const pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        return pattern.test(str);
    }

    const handleSave = async e => {
        e.preventDefault();

        if (!title || title.length === 0) {
            swalInfo(`Please provide project title.`);
            return;
        }

        let moodboard = [];
        document.querySelectorAll(`.moodboard .item`).forEach(x => {
            const type = x.querySelector(`.item-type`).value;
            if (type === 'video') {
                let title = x.querySelector(`.item-title`).value || '';
                let url = x.querySelector(`.item-url`).value || '';
                if (title && title.length > 0 && url && url.length > 0) {
                    moodboard.push({
                        id: x.querySelector(`.item-id`).value || '',
                        type: type,
                        url: url,
                        title: title,
                        description: x.querySelector(`.item-description`).value || ''
                    });
                }
            }

            if (type === 'audio' || type === 'image') {
                let title = x.querySelector(`.item-title`).value || '';
                let file = x.querySelector(`.item-file`).files[0] || null;
                if (title && title.length > 0 && file) {
                    moodboard.push({
                        id: x.querySelector(`.item-id`).value || '',
                        type: type,
                        file: file,
                        title: title,
                        description: x.querySelector(`.item-description`).value || ''
                    });
                }
            }
        });

        let storyboard = [];
        document.querySelectorAll(`.storyboard .item`).forEach(x => {
            let title = x.querySelector(`.item-title`).value || '';
            let file = x.querySelector(`.item-file`).files[0] || null;
            if (title && title.length > 0 && file) {
                storyboard.push({
                    id: x.querySelector(`.item-id`).value || '',
                    file: file,
                    title: title,
                    description: x.querySelector(`.item-description`).value || '',
                    shot: x.querySelector(`.item-shot`).value || '',
                    angle: x.querySelector(`.item-angle`).value || '',
                    movement: x.querySelector(`.item-movement`).value || '',
                    audio: x.querySelector(`.item-audio`).value || ''
                });
            }
        });

        // if (!moodboard || moodboard.length === 0) {
        //     swalInfo(`Please provide atleast one item.`);
        //     return;
        // }
        //
        // let isValid = true;
        // moodboard.forEach(x => {
        //     if(x.type === 'video') {
        //         if (x.url.length === 0 || !validUrl(x.url) || x.title.length === 0)
        //             isValid = false;
        //     }
        //     else if(x.type === 'audio' || x.type === 'image') {
        //         if(x.title.length === 0)
        //             isValid = false;
        //
        //         if(x.id === '')
        //             if (x.file === null || x.file.size === 0)
        //                 isValid = false;
        //     }
        // });
        //
        // if (!isValid) {
        //     swalInfo(`Please provide valid data.`);
        //     return;
        // }

        const obj = {
            title: title,
            description: description,
            date: moment().format(),
            userId: session.get('user').id
        };

        if (project && project._id) {
            await projectService.update(project._id, obj)
                .then(async result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data) {
                        swalUploading();
                        await updateAndUploadMoodboards(moodboard, result.data);
                        await updateAndUploadStoryboards(storyboard, result.data);
                        Swal.close();
                        swalSuccess(`Project updated successfully!`);
                        setRedirectTo(`/projects/${project._id}`);
                    }
                });
        } else {
            await projectService.add(obj)
                .then(async result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data) {
                        swalUploading();
                        await saveAndUploadMoodboards(moodboard, result.data);
                        await saveAndUploadStoryboards(storyboard, result.data);
                        Swal.close();
                        swalSuccess(`Project created successfully!`);
                        setRedirectTo(`/projects/${result.data._id}`);
                    }
                });
        }
    }

    const saveAndUploadMoodboards = async (arr, project) => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                const k = arr[i];
                if (k.type === 'video') {
                    await moodboardService.add({
                        title: k.title,
                        description: k.description,
                        type: k.type,
                        projectId: project._id,
                        fileUrl: k.url,
                        fileName: null,
                        fileSize: 0,
                        fileKey: null,
                        userId: session.get('user').id,
                        date: moment().format()
                    });
                } else {
                    await moodboardService.add({
                        title: k.title,
                        description: k.description,
                        type: k.type,
                        projectId: project._id,
                        file: k.file,
                        userId: session.get('user').id,
                        date: moment().format()
                    });
                }
            }
            resolve(true);
        });
    }

    const updateAndUploadMoodboards = async (arr, project) => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                const k = arr[i];
                if (k.type === 'video') {
                    if (k.id) {
                        await moodboardService.update(k.id, {
                            title: k.title,
                            description: k.description,
                            fileUrl: k.url,
                        });
                    } else {
                        await moodboardService.add({
                            title: k.title,
                            description: k.description,
                            type: k.type,
                            projectId: project._id,
                            fileUrl: k.url,
                            fileName: null,
                            fileSize: 0,
                            fileKey: null,
                            userId: session.get('user').id,
                            date: moment().format()
                        });
                    }
                }

                if (k.type === 'audio' || k.type === 'image') {
                    if (k.id) {
                        await moodboardService.update(k.id, {
                            title: k.title,
                            description: k.description,
                            file: k.file,
                        });
                    } else {
                        await moodboardService.add({
                            title: k.title,
                            description: k.description,
                            type: k.type,
                            projectId: project._id,
                            file: k.file,
                            userId: session.get('user').id,
                            date: moment().format()
                        });
                    }
                }
            }
            resolve(true);
        });
    }

    const saveAndUploadStoryboards = async (arr, project) => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                const k = arr[i];
                await storyboardService.add({
                    title: k.title,
                    description: k.description,
                    shot: k.shot,
                    angle: k.angle,
                    movement: k.movement,
                    audio: k.audio,
                    projectId: project._id,
                    file: k.file,
                    userId: session.get('user').id,
                    date: moment().format()
                });
            }
            resolve(true);
        });
    }

    const updateAndUploadStoryboards = async (arr, project) => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                const k = arr[i];
                if (k.id) {
                    await storyboardService.update(k.id, {
                        title: k.title,
                        description: k.description,
                        shot: k.shot,
                        angle: k.angle,
                        movement: k.movement,
                        audio: k.audio,
                        file: k.file,
                    });
                } else {
                    await storyboardService.add({
                        title: k.title,
                        description: k.description,
                        shot: k.shot,
                        angle: k.angle,
                        movement: k.movement,
                        audio: k.audio,
                        projectId: project._id,
                        file: k.file,
                        userId: session.get('user').id,
                        date: moment().format()
                    });
                }
            }
            resolve(true);
        });
    }

    const handleDeleteProject = e => {
        e.preventDefault();

        if (!project || !project._id)
            return;

        swalDeleteForm(async () => {
            await projectService.delete(project._id)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    swalSuccess(`Project deleted successfully!`);
                    setRedirectTo(`/projects`);
                });
        });
    }

    return (
        <div className="container">
            {redirectTo && <Redirect push to={redirectTo} />}
            <div className="row" style={{ marginTop: '10px', marginBottom: '10px' }}>
                <div className="col-12 col-sm-12 text-right">
                    <button className="btn btn-pink m-1"
                        onClick={handleSave}>Save Changes
                    </button>
                    {
                        project && project._id &&
                        <button className="btn btn-danger m-1"
                            onClick={handleDeleteProject}>Delete
                        </button>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-12 text-center">
                    <div className="form-group">
                        <input type="text" className="form-control"
                            placeholder="Project title"
                            value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <textarea type="text" className="form-control"
                            placeholder="Project description (optional)" rows={10}
                            value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="row mt-10">
                <div className="col-12 col-sm-12 text-center">
                    <div className="tabbable-panel">
                        <div className="tabbable-line">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home"
                                        role="tab"
                                        aria-controls="home" aria-selected="true">Moodboard</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile"
                                        role="tab"
                                        aria-controls="profile" aria-selected="false">Storyboard</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contact"
                                        role="tab"
                                        aria-controls="contact" aria-selected="false">Vendors</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-12 text-center">
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <Moodboard reloadProject={reloadProject} moodboards={moodboards || null} />
                        </div>
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <Storyboard storyboards={storyboards || null} />
                        </div>
                        <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                            {
                                project &&
                                <UploadAndViewVendorFiles
                                    showDeleteButton={session.get('user') && session.get('user')._id === project.userId._id} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
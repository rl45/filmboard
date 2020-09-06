import React, {useState, useEffect} from 'react';
import projectService from '../services/project';
import session from '../services/session';
import {Redirect} from 'react-router-dom';
import config from "../config.json";
import {
    swalDeleteForm,
    swalError,
    swalSuccess,
    swalShare,
    swalInfo
} from "../utils/swal";
import LoginOrSignup from "./LoginOrSignup";
import MoodboardView from './MoodboardView';
import StoryboardView from './StoryboardView';
import Upload from "./Upload";
import UploadView from './UploadView';
import '../css/project-page.css';
import UploadAndViewVendorFiles from "./UploadAndViewVendorFiles";

export default function ProjectPage(props) {

    const [redirectTo, setRedirectTo] = useState(null);
    const [loginOrSignup, setLoginOrSignup] = useState(false);
    const [projectId, setProjectId] = useState(null);
    const [project, setProject] = useState(null);
    const [moodboards, setMoodboards] = useState(null);
    const [storyboards, setStoryboards] = useState(null);

    useEffect(() => {
        (async () => {
            reloadProject();
        })();
    }, []);

    const reloadProject = async () => {
        let id = window.location.href.split('/').pop();
        if (id && id.length === 24) {
            setProjectId(id);
            await projectService.get(id)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data.length === 1) {
                        loadProject(result.data[0]);
                        if (document.querySelector(`.video-thumbnail`) !== null) {
                            document.querySelector(`.video-thumbnail`).click();
                        }
                    } else {
                        swalInfo(`Project not found with project ID.`);
                        return;
                    }
                });
        } else {
            swalError(`Invalid project ID detected in the URL.`);
            return;
        }
    }

    const loadProject = project => {
        setProject(project);
        setMoodboards(project.moodboards);
        setStoryboards(project.storyboards);
    }

    const handleEdit = e => setRedirectTo(`/project/${project._id}`);

    const handleDelete = e => {
        e.preventDefault();
        swalDeleteForm(async () => {
            await projectService.delete(project._id).then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                swalSuccess('Project deleted successfully!');
                setRedirectTo('/');
            });
        });
    }

    const handleShare = e => swalShare(`${config.appUrl}/projects/${project._id}`);

    return !project ? null :
        (
        <div className="container-fluid text-center mt-10">
            {redirectTo && <Redirect push to={redirectTo}/>}
            {loginOrSignup && <LoginOrSignup onClose={() => setLoginOrSignup(false)} />}
            <div className="row mt-10">
                <div className="col-1 col-sm-1 col-md-1 text-right">
                    <i className="fa fa-chevron-left btn-back" onClick={() => setRedirectTo(`/`)} title="Back to dashboard"></i>
                </div>
                <div className="col-8 col-sm-8 text-left">
                    <p className="title">{project.title}</p>
                </div>
                <div className="col-3 col-sm-3 col-md-3 text-right">
                    {
                        session.get('user') &&
                        <span>
                            <button className="btn btn-pink btn-sm m-1" onClick={handleShare}>Send Client URL</button>
                        </span>
                    }
                    {
                        session.get('user') && (
                            session.get('user')._id &&
                            session.get('user')._id === project.userId._id &&
                            <span>
                                <button className="btn btn-light btn-sm m-1" title="Edit this board"
                                        onClick={handleEdit}><i className="fa fa-pencil-alt"></i></button>
                                <button className="btn btn-light btn-sm m-1" title="Delete this board"
                                        onClick={handleDelete}><i className="fa fa-trash-alt"></i></button>
                            </span>
                        )
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-1 col-sm-1 col-md-1"></div>
                <div className="col-11 col-sm-11 text-left">
                    <p className="description">{project.description}</p>
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
            <div className="row mt-10">
                <div className="col-12 col-sm-12 text-center">
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <MoodboardView moodboards={moodboards || null} />
                        </div>
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <StoryboardView storyboards={storyboards || null} />
                        </div>
                        <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                            {/*{*/}
                            {/*    session.get('user') && session.get('user')._id === project.userId._id ?*/}
                            {/*        <UploadView /> : <Upload />*/}
                            {/*}*/}
                            <UploadAndViewVendorFiles showDeleteButton={session.get('user') && session.get('user')._id === project.userId._id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
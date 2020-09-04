import React, {useState, useEffect} from 'react';
import session from '../services/session';
import {Redirect} from 'react-router-dom';
import moment from "moment";
import {
    swalDeleteForm,
    swalError,
    swalSuccess
} from "../utils/swal";
import projectService from "../services/project";
import '../css/project-box.css';

export default function ProjectBox(props) {

    const [redirectTo, setRedirectTo] = useState(null);

    const handleEdit = () => setRedirectTo(`/project/${props.project._id}`);
    const handleOpen = () => setRedirectTo(`/projects/${props.project._id}`);

    const handleDelete = e => {
        e.preventDefault();
        swalDeleteForm(async () => {
            await projectService.delete(props.project._id)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    swalSuccess('Project deleted successfully!');
                    props.reload();
                });
        });
    }

    return (
        <div>
            {redirectTo && <Redirect push to={redirectTo}/>}
            <div className="text-center project-box">
                <div className="row" onClick={handleOpen} title="Click to open project">
                    <div className="col-12 col-sm-12 text-left">
                        <p className="title">{props.project.title}</p>
                    </div>
                </div>
                <div className="row" onClick={handleOpen} title="Click to open project">
                    <div className="col-12 col-sm-12 text-left">
                        <p className="counts">
                            <span><strong>{props.project.moodboards.length || 0}</strong> Moodboard Concepts</span> <br/>
                            <span><strong>{props.project.storyboards.length || 0}</strong> Storyboard Cells</span> <br/>
                            <span><strong>{props.project.vendoruploads.length || 0}</strong> Vendor Uploads</span>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8 col-sm-8 text-left date">
                        {moment(props.project.date).format('ddd DD MMM YYYY HH:mm A')}
                    </div>
                    <div className="col-4 col-sm-4 text-right">
                        {
                            session.get('user') && (
                                session.get('user')._id &&
                                session.get('user')._id === props.project.userId &&
                                <span>
                                    <button className="btn btn-light btn-sm m-1" title="Edit this project"
                                            onClick={handleEdit}><i className="fa fa-pencil-alt"></i></button>
                                    <button className="btn btn-light btn-sm m-1" title="Delete this project"
                                            onClick={handleDelete}><i className="fa fa-trash-alt"></i></button>
                                </span>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
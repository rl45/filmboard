import React, {useState, useEffect} from 'react';
import projectService from "../services/project";
import ProjectBox from './ProjectBox';
import {swalError, swalPackageLimitReached} from "../utils/swal";
import session from '../services/session';
import {Redirect} from "react-router-dom";
import userService from "../services/user";
import {getPackage} from '../utils/utils';

export default function Projects(props) {

    const [redirectTo, setRedirectTo] = useState(null);
    const [data, setData] = useState([]);
    const [userPackage, setUserPackage] = useState({});

    useEffect(() => {
        (async () => reload())();
    }, []);

    useEffect(() => {
        (async () => {
            if(session.get('user')) {
                const t = await userService.getPackage();
                const pkg = getPackage(t.data.id);
                if(pkg) {
                    setUserPackage(pkg);
                }
            }
        })();
    }, []);

    const reload = async () => {
        if(session.get('user')){
            const keyword = document.getElementById('txtSearchProjects') && document.getElementById('txtSearchProjects').value || ``;
            await projectService.getAll(keyword)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if(result.data) {
                        setData(result.data);
                    }
                });
        }
    }

    const renderProjects = () =>
        data.map(project => <ProjectBox reload={reload} key={project._id} project={project} />);

    const handleCreate = e => {
        e.preventDefault();
        if(userPackage.projectsLimit) {
            if(data.length >= userPackage.projects) {
                swalPackageLimitReached(`Package limit reached`, `You have reached your projects limit.`);
                return;
            }
        }
        setRedirectTo('/project');
    }

    return (
        session.get('user') &&
        <div className="container">
            {redirectTo && <Redirect push to={redirectTo} />}
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12 text-right">
                    {
                        session.get('user') &&
                        <button className="btn btn-pink btn-styled"
                                onClick={handleCreate}>Create Project</button>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12 text-center">
                    <input type="text" className="form-control" onChange={e => reload()}
                    placeholder="Search Projects..." id="txtSearchProjects" />
                </div>
            </div>
            <div className="row mt-20">
                <div className="col-12 col-sm-12 col-md-12">
                    {data.length > 0 && renderProjects() || <div className="not-found">No projects found.</div>}
                </div>
            </div>
        </div>
        || <div className="not-found">Please login/signup to use the system.</div>
    );
}
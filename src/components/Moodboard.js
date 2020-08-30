import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import session from '../services/session';
import {Redirect} from 'react-router-dom';
import moment from "moment";
import {
    swalError,
    swalInfo,
    swalSuccess,
    swalVendorFilesToMoodboard,
    swalPackageLimitReached
} from "../utils/swal";
import MoodboardVideo from "./MoodboardVideo";
import MoodboardAudio from "./MoodboardAudio";
import MoodboardImage from "./MoodboardImage";
import vendorUploadsService from "../services/vendor-uploads";
import moodboardService from "../services/moodboard";
import {getPackage} from "../utils/utils";

export default function Moodboard(props) {

    const init = [{fileUrl: '', title: '', description: '', type: 'video'}];
    const [redirectTo, setRedirectTo] = useState(null);
    const [items, setItems] = useState(init);
    const [userPackage, setUserPackage] = useState({});

    useEffect(() => {
        if(props.moodboards && props.moodboards.length > 0) {
            setItems(props.moodboards);
        }
    }, [props.moodboards]);

    useEffect(() => {
        try {
            const els = document.querySelectorAll(`.moodboard .item`);
            if (els.length > 0) {
                const el = els[els.length - 1];
                el.querySelector(`.item-title`).focus();
                el.querySelector(`.item-title`).scrollIntoView();
            }
        }
        catch (e) {}
    }, [items]);

    useEffect(() => {
        (async () => {
            const t = await userService.getPackage();
            const pkg = getPackage(t.data.id);
            setUserPackage(pkg);
        })();
    }, []);

    const handleAddMore = type => {

        const t = Array.from(items);
        if(t.length >= userPackage.moodboardItems) {
            swalPackageLimitReached(`Package limit reached`, `You have reached your Moodboard items limit.`);
            return;
        }

        t.push({fileUrl: '', title: '', description: '', type: type});
        setItems(t);
    }

    const handleAddVendorFile = async () => {

        if(items.length >= userPackage.moodboardItems) {
            swalPackageLimitReached(`Package limit reached`, `You have reached your Moodboard items limit.`);
            return;
        }

        const projectId = window.location.href.split('/').pop();
        if(!projectId || projectId.length !== 24) {
            swalInfo(`No Vendor files uploaded yet.`);
            return;
        }

        if (projectId && projectId.length === 24) {
            await vendorUploadsService.getByProjectId(projectId)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if(result.data.length === 0) {
                        swalInfo(`No Vendor files uploaded yet.`);
                        return;
                    }

                    const allFiles = result.data;
                    let html = `<select id="ddl-file" class="swal2-select"><option value="-1">Choose a file</option>`;
                    allFiles.forEach(file => html += `<option key="${file._id}" value="${file._id}">${file.fileName}</option>`);
                    html += `</select>`;

                    swalVendorFilesToMoodboard(html, async obj => {
                        const file = allFiles.find(x => x._id === obj.fileId);
                        await moodboardService.add({
                            title: obj.title,
                            description: obj.description,
                            type: obj.typeId,
                            projectId: projectId,
                            fileUrl: file.fileUrl,
                            fileName: file.fileName,
                            fileSize: file.fileSize,
                            fileKey: file.fileKey,
                            userId: session.get('user').id,
                            date: moment().format()
                        });
                        swalSuccess(`Moodboard added successfully!`);
                        props.reloadProject();
                    });
                });
        }
    }

    const renderItems = () => {
        return items.map((item, idx) => {
            if (item.type === 'video')
                return <MoodboardVideo key={idx} item={item}/>
            else if (item.type === 'audio')
                return <MoodboardAudio key={idx} item={item}/>
            else if (item.type === 'image')
                return <MoodboardImage key={idx} item={item}/>
        });
    }

    const validUrl = str => {
        const pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        return pattern.test(str);
    }

    return (
        <div className="container moodboard">
            {redirectTo && <Redirect push to={redirectTo}/>}
            <div className="row mt-10 mb-10">
                <div className="col-12 col-sm-12 text-right">
                    <button className="btn btn-sm btn-outline-light m-1"
                            onClick={() => handleAddMore('video')}>Add Video
                    </button>
                    <button className="btn btn-sm btn-outline-light m-1"
                            onClick={() => handleAddMore('audio')}>Add Audio
                    </button>
                    <button className="btn btn-sm btn-outline-light m-1"
                            onClick={() => handleAddMore('image')}>Add Image
                    </button>
                    <button className="btn btn-sm btn-outline-light m-1"
                            onClick={() => handleAddVendorFile()}>Add Vendor's File
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-12">
                    {renderItems()}
                </div>
            </div>
        </div>
    );
}
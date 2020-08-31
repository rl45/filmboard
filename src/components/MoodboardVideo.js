import React, {useState, useEffect} from 'react';
import {
    swalDeleteForm,
    swalError
} from "../utils/swal";
import $ from 'jquery';
import moodboardService from "../services/moodboard";

export default function MoodboardVideo(props) {

    const [url, setUrl] = useState(props.item.fileUrl);
    const [title, setTitle] = useState(props.item.title);
    const [description, setDescription] = useState(props.item.description);

    useEffect(() => {
        if (props.item) {
            setUrl(props.item.fileUrl);
            setTitle(props.item.title);
            setDescription(props.item.description);
        }
    }, [props.item]);

    const removeItem = e => {
        e.preventDefault();
        $(e.target).closest('.item').remove();
        if (props.item._id) {
            swalDeleteForm(async () => {
                await moodboardService.delete(props.item._id)
                    .then(result => {
                        if (result.error) {
                            swalError(result.error);
                            return;
                        }

                    });
            });
        }
    }

    const validateUrl = e => {
        e.preventDefault();
        const ytPattern = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
        const vimeoPattern = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
        const els = document.querySelectorAll('.item-url');
        els.forEach(el => {
            const url = el.value;
            if (url.length > 0 && (ytPattern.test(url) || vimeoPattern.test(url))) {
                el.classList.remove('is-invalid');
                el.classList.add('is-valid');
            } else {
                el.classList.remove('is-valid');
                el.classList.add('is-invalid');
            }
        });
    }

    return (
        <div>
            <div className="container item video">
                <div className="row">
                    <div className="col-12 col-sm-12 text-right">
                        <button className="btn btn-outline-secondary btn-sm" onClick={removeItem}>Remove</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-12 text-center">
                        <div className="form-group">
                            <input type="hidden" className="item-id"
                                   value={props.item._id || ``}/>
                            <input type="hidden" className="item-type"
                                   value={props.item.type}/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control item-title"
                                   placeholder="Enter video title (required)"
                                   value={title} onChange={e => setTitle(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <textarea type="text" className="form-control item-description"
                                      placeholder="Enter video description (optional)" rows={1}
                                      value={description} onChange={e => setDescription(e.target.value)}>
                            </textarea>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control item-url" id="item-url"
                                   placeholder="Enter a YouTube/Vimeo video URL (required)" onBlur={validateUrl}
                                   value={url} onChange={e => setUrl(e.target.value)}/>
                            <div className="valid-feedback text-left">
                                Looks good!
                            </div>
                            <div className="invalid-feedback text-left">
                                Please provide a valid YouTube/Vimeo URL.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import React, {useState} from 'react';
import {
    swalDeleteForm,
    swalError
} from "../utils/swal";
import $ from 'jquery';
import moodboardService from "../services/moodboard";

export default function MoodboardImage(props) {

    const [title, setTitle] = useState(props.item.title);
    const [description, setDescription] = useState(props.item.description);

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

    return (
        <div>
            <div className="container item image">
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
                                   placeholder="Enter image title"
                                   value={title} onChange={e => setTitle(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <textarea type="text" className="form-control item-description"
                                      placeholder="Enter image description (optional)" rows={1}
                                      value={description} onChange={e => setDescription(e.target.value)}>
                            </textarea>
                        </div>
                        <div className="form-group text-left">
                            <input type="file" className="form-control item-file" id="item-file"
                                   accept="image/jpeg, image/png, image/jpg"/>
                            {props.item._id && <small>New uploaded file will replace the existing file.</small>}
                            {
                                props.item._id &&
                                <div>
                                    Existing file: <a target="_blank"
                                                      href={props.item.fileUrl}>{props.item.fileName}</a>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
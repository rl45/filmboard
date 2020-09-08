import React, { useState, useEffect } from 'react';
import {
    swalDeleteForm,
    swalError
} from "../utils/swal";
import $ from 'jquery';
import storyboardService from "../services/storyboard";

export default function StoryboardCell(props) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [shot, setShot] = useState('');
    const [angle, setAngle] = useState('');
    const [movement, setMovement] = useState('');
    const [audio, setAudio] = useState('');


    useEffect(() => {
        if (props.item) {
            setTitle(props.item.title);
            setDescription(props.item.description);
            setShot(props.item.shot)
            setAngle(props.item.angle)
            setMovement(props.item.movement)
            setAudio(props.item.audio)
        }
    }, []);

    const removeCell = e => {
        e.preventDefault();
        $(e.target).closest('.item').remove();
        if (props.item._id) {
            swalDeleteForm(async () => {
                await storyboardService.delete(props.item._id)
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
            <div className="container item cell">
                <div className="row">
                    <div className="col-12 col-sm-12 text-right">
                        <button className="btn btn-outline-secondary btn-sm" onClick={removeCell}>Remove</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-12 text-center">
                        <div className="form-group">
                            <input type="hidden" className="item-id"
                                value={props.item._id || ``} />
                        </div>
                        <div className="form-group text-left">
                            <input type="file" className="form-control item-file" id="item-file"
                                accept="image/jpeg, image/png, image/jpg" />
                            {props.item._id && <small>New files will replace the existing file.</small>}
                            {
                                props.item._id &&
                                <div>
                                    Current file: <a target="_blank"
                                        href={props.item.fileUrl}>{props.item.fileName}</a>
                                </div>
                            }
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control item-title"
                                placeholder="Enter image title (required)"
                                value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <textarea type="text" className="form-control item-description"
                                placeholder="Enter image description (optional)" rows={1}
                                value={description} onChange={e => setDescription(e.target.value)}>
                            </textarea>
                        </div>
                        <div className="form-group">
                            <select class="custom-select mr-sm-2" value={shot} onChange={e => setShot(e.target.value)}>
                                <option selected>Shot Type</option>
                                <option value="1">WS - Wide Shot</option>
                                <option value="2">VWS - Very Wide Shot</option>
                                <option value="3">MS - Mid Shot</option>
                                <option value="4">MCU - Medium Close Up</option>
                                <option value="5">CU - Close-Up</option>
                                <option value="6">ECU - Extreme Close Up</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <select class="custom-select mr-sm-2" value={angle} onChange={e => setAngle(e.target.value)}>
                                <option selected>Angle</option>
                                <option value="1">Eye Level</option>
                                <option value="2">High Angle</option>
                                <option value="3">Low Angle</option>
                                <option value="4">Dutch Angle/Tilt</option>
                                <option value="5">Over the Shoulder (OTS)</option>
                                <option value="6">Birds-Eye View</option>
                                <option value="7">Point of View (POV)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <select class="custom-select mr-sm-2" value={movement} onChange={e => setMovement(e.target.value)}>
                                <option selected>Movement</option>
                                <option value="1">Static</option>
                                <option value="2">Pan</option>
                                <option value="3">Tilt</option>
                                <option value="4">Dolly</option>
                                <option value="5">Crane/Boom</option>
                                <option value="6">Handheld</option>
                                <option value="7">Zoom</option>
                                <option value="8">Rack Focus</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <select class="custom-select mr-sm-2" value={audio} onChange={e => setAudio(e.target.value)}>
                                <option selected>Audio</option>
                                <option value="1">Boom</option>
                                <option value="2">Lav</option>
                                <option value="3">Lav and Boom</option>
                                <option value="4">VO (Voice Over)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
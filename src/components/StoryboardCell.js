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
    const [shot, setShot] = useState('Shot Type');
    const [angle, setAngle] = useState('Angle');
    const [movement, setMovement] = useState('Movement');
    const [audio, setAudio] = useState('Audio');


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
                            <select className="custom-select mr-sm-2" value="Shot Type" value={shot} onChange={e => {
                                setShot(e.target.value)
                            }}>
                                <option value="WS">WS - Wide Shot</option>
                                <option value="VWS">VWS - Very Wide Shot</option>
                                <option value="MS">MS - Mid Shot</option>
                                <option value="MCU">MCU - Medium Close Up</option>
                                <option value="CU">CU - Close-Up</option>
                                <option value="ECU">ECU - Extreme Close Up</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <select className="custom-select mr-sm-2" value="Angle" value={angle} onChange={e => setAngle(e.target.value)}>
                                <option value="Eye">Eye Level</option>
                                <option value="High">High Angle</option>
                                <option value="Low">Low Angle</option>
                                <option value="Dutch">Dutch Angle/Tilt</option>
                                <option value="OTS">Over the Shoulder (OTS)</option>
                                <option value="BEV">Birds-Eye View (BEV)</option>
                                <option value="POV">Point of View (POV)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <select className="custom-select mr-sm-2" value="Movement" value={movement} onChange={e => setMovement(e.target.value)}>
                                <option value="Static">Static</option>
                                <option value="Pan">Pan</option>
                                <option value="Tilt">Tilt</option>
                                <option value="Dolly">Dolly</option>
                                <option value="Crane/Boom">Crane/Boom</option>
                                <option value="Handheld">Handheld</option>
                                <option value="Zoom">Zoom</option>
                                <option value="Rack Focus">Rack Focus</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <select className="custom-select mr-sm-2" value="Audio" value={audio} onChange={e => setAudio(e.target.value)}>
                                <option value="Boom">Boom</option>
                                <option value="Lav">Lav</option>
                                <option value="Lav/Boom">Lav and Boom</option>
                                <option value="VO">VO (Voice Over)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
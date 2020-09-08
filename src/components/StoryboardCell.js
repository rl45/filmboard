import React, { useState, useEffect } from 'react';
import {
    swalDeleteForm,
    swalError
} from "../utils/swal";
import $ from 'jquery';
import storyboardService from "../services/storyboard";
import Select from 'react-select';

export default function StoryboardCell(props) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [shot, setShot] = useState('');
    const [angle, setAngle] = useState('');
    const [movement, setMovement] = useState('');
    const [audio, setAudio] = useState('');

    const shots = [
        {
          value: 'WS',
          label: "WS - Wide Shot"
        },
        {
          value: 'VWS',
          label: "VWS - Very Wide Shot"
        },
        {
          value: 'MS',
          label: "MS - Mid Shot"
        },
        {
          value: "MCU",
          label: "MCU - Medium Close Up"
        },
        {
          value: "CU",
          label: "CU - Close-Up"
        },
        {
          value: "ECU",
          label: "ECU - Extreme Close Up"
        }
      ];


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
                                placeholder="Subject (required)"
                                value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <textarea type="text" className="form-control item-description"
                                placeholder="Shot Description (Optional)" rows={1}
                                value={description} onChange={e => setDescription(e.target.value)}>
                            </textarea>
                        </div>
                        <div className="form-group">
                            <Select placeholder="Shot Type" className="custom-select mr-sm-2 form-control item-shot" value={shot} options={shots} onChange={e => {
                                setShot(e.target.value)
                            }}/>
                        </div>
                        <div className="form-group">
                            <select type="text" className="custom-select mr-sm-2 form-control item-angle" value={angle} onChange={e => setAngle(e.target.value)}>
                                <option value=''>Angle</option>
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
                            <select type="text" className="custom-select mr-sm-2 form-control item-movement" value={movement} onChange={e => setMovement(e.target.value)}>
                                <option value=''>Movement</option>
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
                            <select type="text" className="custom-select mr-sm-2 form-control item-audio"  value={audio} onChange={e => setAudio(e.target.value)}>
                                <option value=''>Audio</option>
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
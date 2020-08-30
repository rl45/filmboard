import React, {useState, useEffect} from 'react';
import session from '../services/session';
import {swalError} from "../utils/swal";
import commentService from "../services/comment";

export default function Comment(props) {

    const [comment, setComment] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        setComment(props.comment.text);
        setStartTime(props.comment.startTime);
        setEndTime(props.comment.endTime);
        setId(props.comment.id);
    }, [props.comment]);

    const handleComment = async e => {
        e.preventDefault();

        if (!session.get('user') || !session.get('user')._id) {
            props.setLoginOrSignup();
            return;
        }

        if (!comment || comment.length === 0) {
            document.getElementById('txt-comment').classList.add('is-invalid');
            return;
        } else {
            document.getElementById('txt-comment').classList.remove('is-invalid');
        }

        if(props.type === 'moodboard' && startTime && endTime) {
            if (startTime.length > 0 || endTime.length > 0) {
                if (startTime.indexOf(':') === -1 || isNaN(startTime.split(':')[0]) || startTime.split(':')[0].length > 2 || isNaN(startTime.split(':')[1]) || startTime.split(':')[1].length > 2) {
                    document.getElementById('txt-time-start').classList.add('is-invalid');
                    return;
                }

                if (endTime.indexOf(':') === -1 || isNaN(endTime.split(':')[0]) || endTime.split(':')[0].length > 2 || isNaN(endTime.split(':')[1]) || endTime.split(':')[1].length > 2) {
                    document.getElementById('txt-time-end').classList.add('is-invalid');
                    return;
                }
            }
        }

        if(!id || id.length === 0) {
            const projectId = window.location.href.split('/').pop();
            const type = document.querySelector(`.nav-link.active`).text.toLowerCase();
            const moodboardId = type === 'moodboard' ? props.playingItemId : null;
            await commentService.add(comment, startTime, endTime, type, moodboardId, projectId).then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }
                reset();
                props.reloadComments();
            });
        } else {
            await commentService.update(id, comment, startTime, endTime).then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }
                reset();
                props.reloadComments();
            });
        }
    }

    const reset = () => {
        document.getElementById('txt-comment-id').value = ``;
        document.getElementById('txt-comment').classList.remove('is-invalid');
        document.getElementById('txt-time-start').classList.remove('is-invalid');
        document.getElementById('txt-time-end').classList.remove('is-invalid');
        setComment(``);
        setStartTime(``);
        setEndTime(``);
        setId(``);
    }

    return (
        <div className="comment-box new-comment">
            <div className="row" style={{marginBottom: '5px'}}>
                <div className="col-sm-12 col-md-12">
                    <input type="hidden" id="txt-comment-id" value={id} />
                    <textarea id="txt-comment" className="form-control" placeholder="Comment this video..."
                        value={comment} onChange={e => setComment(e.target.value)}></textarea>
                    <div className="invalid-feedback text-left">
                        Please provide a comment text.
                    </div>
                </div>
            </div>
            <div className="row">
                {
                    props.type === 'moodboard' &&
                    <div className="col-sm-4">
                        <input id="txt-time-start" placeholder="3:40" type="text"
                               className="form-control" value={startTime} onChange={e => setStartTime(e.target.value)}/>
                        <div className="invalid-feedback text-left">
                            Please provide start time in specified format, e.g., 3:40.
                        </div>
                    </div> || <div className="col-sm-4"></div>
                }
                {
                    props.type === 'moodboard' &&
                    <div className="col-sm-4">
                        <input id="txt-time-end" placeholder="3:46" type="text"
                               className="form-control" value={endTime} onChange={e => setEndTime(e.target.value)}/>
                        <div className="invalid-feedback text-left">
                            Please provide end time in specified format, e.g., 3:40.
                        </div>
                    </div> || <div className="col-sm-4"></div>
                }
                <div className="col-sm-2 text-center">
                    <button className="btn btn-outline-light btn-sm mt-1" onClick={handleComment}>Save</button>
                </div>
                <div className="col-sm-2 text-center">
                    <button className="btn btn-outline-light btn-sm mt-1" onClick={() => reset()}>Clear</button>
                </div>
            </div>
        </div>
    );
}
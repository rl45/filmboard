import React, {useState, useEffect} from 'react';
import session from '../services/session';
import moment from "moment";
import {swalDeleteForm, swalError, swalSuccess, swalComment} from "../utils/swal";
import commentService from "../services/comment";

export default function CommentBox(props) {

    const handleEdit = e => {
        e.preventDefault();
        const obj = {
            id: props.comment._id,
            text: props.comment.text,
            startTime: props.comment.startTime || ``,
            endTime: props.comment.endTime || ``
        };

        props.setCommentToUpdate(obj);
    }

    const handleDelete = e => {
        e.preventDefault();
        swalDeleteForm(async () => {
            await commentService.delete(props.comment._id).then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                swalSuccess('Comment deleted successfully!');
                props.reloadComments();
            });
        });
    }

    const getName = () => {
        let str = '';
        if(props.comment.userId.fullname)
            str += props.comment.userId.fullname;
        if(props.comment.userId.position)
            str += ` | ${props.comment.userId.position}`;

        return str;
    }

    const getTime = () => {
        if(props.comment.startTime && props.comment.endTime)
            return `${props.comment.startTime}-${props.comment.endTime}`;

        return '';
    }

    return (
        <div className="comment-box">
            <div className="row">
                <div className="col-2 col-sm-2 col-md-2 text-center">
                    <img className="img-circle" src={props.comment.userId.picture} />
                </div>
                <div className="col-10 col-sm-10 col-md-10 text-left">
                    <p>
                        <span className="text-left">
                            <span className="comment-username">{getName()}</span>
                        </span>
                        <br/>
                        <span className="text-left comment-video-time">
                            {getTime()}
                        </span>

                        {getTime().length > 0 ? <span className="comment-bar">|</span> : null}

                        <span className="text-right comment-date">
                            {moment(props.comment.date).format('DD MMM YYYY')}
                        </span>
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12 text-left">
                    {props.comment.text}
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12 text-right">
                    {
                        session.get('user')._id === props.comment.userId._id &&
                        <span>
                        <button className="btn btn-light btn-sm m-1" title="Edit this comment" onClick={handleEdit}><i
                            className="fa fa-pencil-alt"></i></button>
                        <button className="btn btn-light btn-sm m-1" title="Delete this comment" onClick={handleDelete}><i
                            className="fa fa-trash-alt"></i></button>
                    </span>
                    }
                </div>
            </div>
        </div>
    );
}
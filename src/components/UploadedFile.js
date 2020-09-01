import React from 'react';
import {bytesToSize} from "../utils/utils";
import {swalDeleteForm} from "../utils/swal";

export default function UploadedFile(props) {
    const handleDeleteFile = id => {
        swalDeleteForm(() => props.deleteFile(id));
    }

    return (
        <div className="uploaded-file">
            <a target="_blank" href={props.file.fileUrl}>{props.file.fileName}</a>
            <span className="comment-bar">|</span>
            <span>{bytesToSize(props.file.fileSize)}</span>
            {
                props.showDeleteButton === true &&
                <span className="comment-bar">|</span>
            }
            {
                props.showDeleteButton === true &&
                <a className="btn-delete-file" onClick={() => handleDeleteFile(props.file._id)}>Delete</a>
            }
        </div>
    );
}
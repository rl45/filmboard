import React from 'react';
import {bytesToSize} from "../utils/utils";

export default function UploadedFile(props) {
    return (
        <div className="uploaded-file">
            <a target="_blank" href={props.file.fileUrl}>{props.file.fileName}</a>
            <span className="comment-bar">|</span>
            <span>{bytesToSize(props.file.fileSize)}</span>
        </div>
    );
}
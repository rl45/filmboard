import React, {useState, useEffect} from 'react';
import vendorUploadsService from '../services/vendor-uploads';
import {bytesToSize} from "../utils/utils";
import {swalError} from "../utils/swal";
import UploadedFile from './UploadedFile';

export default function Upload(props) {

    const [files, setFiles] = useState([]);
    const [totalSize, setTotalSize] = useState(0);

    useEffect(() => {
        reload();
    }, []);

    const reload = () => {
        const projectId = window.location.href.split('/').pop();
        if(projectId && projectId.length === 24) {
            vendorUploadsService.getByProjectId(projectId)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    setFiles(result.data);
                    const size = result.data.reduce((a, b) => a + parseFloat(b.fileSize), 0);
                    setTotalSize(size);
                });
        }
    }

    const deleteFile = async id => {
        await vendorUploadsService.delete(id)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                reload();
            });
    }

    const renderFiles = () =>
        files.length > 0 ?
            files.map(file => <UploadedFile key={file._id} file={file} deleteFile={deleteFile} />)
            : <div className="not-found">No files uploaded.</div>

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12 text-left">
                    <span className="h6 m-2">Files uploaded by the Vendors</span>
                    <span className="comment-bar">|</span>
                    <span>Total size: {bytesToSize(totalSize)}</span>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    {renderFiles()}
                </div>
            </div>
        </div>
    );
}
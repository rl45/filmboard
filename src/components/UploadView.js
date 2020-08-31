import React, {useState, useEffect} from 'react';
import vendorUploadsService from '../services/vendor-uploads';
import {bytesToSize} from "../utils/utils";
import {swalError} from "../utils/swal";
import UploadedFile from './UploadedFile';

export default function Upload(props) {

    const [files, setFiles] = useState([]);
    const [totalSize, setTotalSize] = useState(0);

    useEffect(() => {
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
    }, []);

    const renderFiles = () =>
        files.length > 0 ?
            files.map(file => <UploadedFile key={file._id} file={file} />)
            : <div className="not-found">No files uploaded.</div>

    return (
        <div className="container text-center">
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <h5 className="m-4">Files uploaded by the Vendors</h5>
                    <h6 className="m-2 text-left">Total size: {bytesToSize(totalSize)}</h6>
                    {renderFiles()}
                </div>
            </div>
        </div>
    );
}
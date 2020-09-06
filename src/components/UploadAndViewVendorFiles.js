import React, {useEffect, useState} from 'react';
import {bytesToSize, getPackage} from "../utils/utils";
import Upload from "./Upload";
import UploadView from "./UploadView";
import Dropzone from "react-dropzone";
import userService from "../services/user";
import vendorUploadsService from "../services/vendor-uploads";
import {swalError, swalPackageLimitReached, swalSuccess, swalUploading, swalPackageLimitReachedInformOwner} from "../utils/swal";
import Swal from "sweetalert2";
import moment from "moment";
import UploadedFile from "./UploadedFile";

export default function UploadAndViewVendorFiles(props) {
    const [userPackage, setUserPackage] = useState({});
    const [totalSize, setTotalSize] = useState(0);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        (async () => {
            const projectId = window.location.href.split('/').pop();
            if (projectId && projectId.length === 24) {
                const t = await userService.getPackageByProjectId(projectId);
                const pkg = getPackage(t.data.id);
                setUserPackage(pkg);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const projectId = window.location.href.split('/').pop();
            if (projectId && projectId.length === 24) {
                const result = await vendorUploadsService.getByProjectId(projectId);
                const size = result.data.reduce((a, b) => a + parseFloat(b.fileSize), 0);
                setTotalSize(size);
            }
        })();
    }, []);

    useEffect(() => {
        reload();
    }, []);

    const onDrop = async acceptedFiles => {
        if (acceptedFiles.length === 0)
            return;

        if(userPackage && userPackage.space) {
            const size = acceptedFiles.reduce((a, b) => a + parseFloat(b.size), 0);
            if (totalSize + size >= (parseFloat(userPackage.space) * 1024 * 1024)) {
                if(props.showDeleteButton === true) {
                    swalPackageLimitReached(`Package limit reached`, `You have reached your file uploading limit.`);
                    return;
                }
                else {
                    swalPackageLimitReachedInformOwner(`Project owner's package limit reached`, `This project's owner's package limit is reached. You cannot upload more files. You should inform the project owner.`);
                    return;
                }
            }
        }

        swalUploading();
        await saveAndUpload(acceptedFiles);
        Swal.close();
        swalSuccess(`Files uploaded successfully!`);
        reload();
    }

    const saveAndUpload = async arr => {
        const projectId = window.location.href.split('/').pop();
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                const k = arr[i];
                await vendorUploadsService.add({
                    projectId: projectId,
                    file: k,
                    date: moment().format()
                });
            }
            resolve(true);
        });
    }

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

                swalSuccess(`Files deleted successfully!`);
                reload();
            });
    }

    const renderFiles = () =>
        files.length > 0 ?
            files.map(file => <UploadedFile key={file._id} file={file} deleteFile={deleteFile} showDeleteButton={props.showDeleteButton} />)
            : <div className="not-found">No files uploaded.</div>;

    return (
        <div className="container text-center">
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <h4 className="m-4">Upload files</h4>
                    <Dropzone onDrop={onDrop}>
                        {({getRootProps, getInputProps}) => (
                            <section className="dropzone-section">
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p className="dropzone-p">Drop or select files to send to the project owner</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
            </div>
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
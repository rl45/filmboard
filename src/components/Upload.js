import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import {getPackage} from "../utils/utils";
import Dropzone from 'react-dropzone';
import {swalUploading, swalPackageLimitReached, swalSuccess} from "../utils/swal";
import vendorUploadsService from "../services/vendor-uploads";
import moment from "moment";
import Swal from 'sweetalert2';

export default function Upload(props) {

    const [userPackage, setUserPackage] = useState({});
    const [totalSize, setTotalSize] = useState(0);

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

    const onDrop = async acceptedFiles => {
        if (acceptedFiles.length === 0)
            return;

        const size = acceptedFiles.reduce((a, b) => a + parseFloat(b.size), 0);
        if (totalSize + size >= (parseFloat(userPackage.space) * 1024 * 1024)) {
            swalPackageLimitReached(`Package limit reached`, `You have reached your file uploading limit.`);
            return;
        }

        swalUploading();
        await saveAndUpload(acceptedFiles);
        Swal.close();
        swalSuccess(`Files uploaded successfully!`);
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

    return (
        <div className="container text-center">
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <h4 className="m-4">Upload files</h4>
                    <p>Upload files here to send to the project owner</p>
                    <Dropzone onDrop={onDrop}>
                        {({getRootProps, getInputProps}) => (
                            <section className="dropzone-section">
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p className="dropzone-p">Drag 'n' drop files here, or click to select files</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
            </div>
        </div>
    );
}
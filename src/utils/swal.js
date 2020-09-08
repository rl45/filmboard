
import Swal from 'sweetalert2';

export const swalDeleteForm = callback => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete'
    }).then(result => {
        if (result.value) {
            callback();
        }
    });
}

export const swalPkgChange = (title, text, icon, callback) => {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!'
    }).then(result => {
        if (result.value) {
            callback();
        }
    });
}

export const swalRemoveLike = (title, callback) => {
    Swal.fire({
        title: title,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(result => {
        if (result.value) {
            callback();
        }
    });
}

export const swalError = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: true
    });
}

export const swalSuccess = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 800
    });
}

export const swalInfo = message => {
    Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: message,
        showConfirmButton: true
    });
}

export const swalShare = url => {
    Swal.fire({
        title: "Copy public URL",
        html: `<input id="txt-share-url" type="text" class="swal2-input" readonly value="${url}" />`,
        position: 'top-end',
        showConfirmButton: true,
        confirmButtonText: 'Copy URL',
        showCancelButton: true,
        cancelButtonText: 'Close'
    }).then(result => {
        if (result.value) {
            document.getElementById('txt-share-url').select();
            document.execCommand("copy");
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Copied!',
                showConfirmButton: false,
                timer: 800
            });
        }
    });
}

export const swalName = (name, callback) => {
    Swal.fire({
        title: "Update your name",
        html: `<input id="txt-name" type="text" class="swal2-input" value="${name}" placeholder="Full name" />`,
        showConfirmButton: true,
        confirmButtonText: 'Update',
        showCancelButton: true,
        cancelButtonText: 'Close',
        preConfirm: () => {
            const name = document.getElementById('txt-name').value;
            if (!name || name.length === 0)
                return Swal.showValidationMessage(`Please provide your name.`);
        }
    }).then(result => {
        if (result.value) {
            const name = document.getElementById('txt-name').value;
            callback(name);
        }
    });
}

export const swalPosition = (position, callback) => {
    Swal.fire({
        title: "Update your position",
        html: `<input id="txt-position" type="text" class="swal2-input" value="${position}" placeholder="Company position" />`,
        showConfirmButton: true,
        confirmButtonText: 'Update',
        showCancelButton: true,
        cancelButtonText: 'Close',
        preConfirm: () => {
            const position = document.getElementById('txt-position').value;
            if (!position || position.length === 0)
                return Swal.showValidationMessage(`Please provide your position.`);
        }
    }).then(result => {
        if (result.value) {
            const position = document.getElementById('txt-position').value;
            callback(position);
        }
    });
}

export const swalPassword = callback => {
    Swal.fire({
        title: "Update your password",
        html: `<input id="txt-pass1" type="password" class="swal2-input" placeholder="Password" />
                <input id="txt-pass2" type="password" class="swal2-input" placeholder="Repeat password" />`,
        showConfirmButton: true,
        confirmButtonText: 'Update',
        showCancelButton: true,
        cancelButtonText: 'Close',
        preConfirm: () => {
            const pass1 = document.getElementById('txt-pass1').value;
            if (!pass1 || pass1.length === 0)
                return Swal.showValidationMessage(`Please provide your password.`);

            const pass2 = document.getElementById('txt-pass2').value;
            if (pass1 !== pass2)
                return Swal.showValidationMessage(`Password did not match.`);
        }
    }).then(result => {
        if (result.value) {
            const password = document.getElementById('txt-pass1').value;
            callback(password);
        }
    });
}

export const swalPicture = callback => {
    Swal.fire({
        title: "Update your picture",
        html: `<input id="txt-file" type="file" accept="image/*" class="swal2-file" />`,
        showConfirmButton: true,
        confirmButtonText: 'Update',
        showCancelButton: true,
        cancelButtonText: 'Close',
        preConfirm: () => {
            const file = document.getElementById('txt-file').files[0];
            if (!file)
                return Swal.showValidationMessage(`Please select file to upload.`);
        }
    }).then(result => {
        if (result.value) {
            const file = document.getElementById('txt-file').files[0];
            callback(file);
        }
    });
}

export const swalComment = (comment, st, et, callback) => {
    Swal.fire({
        title: comment.length > 0 ? 'Update comment' : 'Create comment',
        html: `
                <textarea id="txt-comment" class="swal2-input" placeholder="Comment...">${comment}</textarea>
                <div class="row">
                    <div class="col-sm-6">
                        <input id="txt-time-start" placeholder="Start time e.g., 3:40" type="text" class="swal2-input" value="${st}" />
                    </div>
                    <div class="col-sm-6">
                        <input id="txt-time-end" placeholder="End time e.g., 3:46" type="text" class="swal2-input" value="${et}" />
                    </div>
                </div>`,
        showCancelButton: true,
        confirmButtonText: comment.length > 0 ? 'Update' : 'Create',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const comment = document.getElementById('txt-comment').value;
            if (!comment)
                return Swal.showValidationMessage(`Please provide comment text.`);

            const startTime = document.getElementById('txt-time-start').value;
            if(startTime.indexOf(':') === -1 || isNaN(startTime.split(':')[0]) || startTime.split(':')[0].length > 2 || isNaN(startTime.split(':')[1]) || startTime.split(':')[1].length > 2)
                return Swal.showValidationMessage(`Please provide start time in specified format, e.g., 3:40`);

            const endTime = document.getElementById('txt-time-end').value;
            if(endTime.indexOf(':') === -1 || isNaN(endTime.split(':')[0]) || endTime.split(':')[0].length > 2 || isNaN(endTime.split(':')[1]) || endTime.split(':')[1].length > 2)
                return Swal.showValidationMessage(`Please provide end time in specified format, e.g., 3:46`);
        },
    }).then(result => {
        if(result.value) {
            const comment = document.getElementById('txt-comment').value;
            const st = document.getElementById('txt-time-start').value;
            const et = document.getElementById('txt-time-end').value;
            callback({comment, st, et});
        }
    });
}

export const swalLoading = () => {
    Swal.fire({
        title: 'Loading...',
        text: "Please wait.",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
}

export const swalUploading = () => {
    Swal.fire({
        title: 'Uploading files...',
        text: "Please wait. This may take a while depending on upload size.",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
}

export const swalPackageLimitReachedInformOwner = (title, text) => {
    Swal.fire({
        icon: 'info',
        title: title,
        text: `${text}`,
        showConfirmButton: true,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
    });
}

export const swalPackageLimitReached = (title, text) => {
    Swal.fire({
        icon: 'info',
        title: title,
        text: `${text}`,
        footer: `Don't worry!&nbsp;<a href="/billing">Click here</a>&nbsp;to upgrade your license.`,
        showConfirmButton: true,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
    });
}

export const swalVendorFilesDropdown = (html, callback) => {
    Swal.fire({
        title: `Choose a file from Vendor's`,
        html: html,
        showCancelButton: true,
        confirmButtonText: `Select`,
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const fileId = document.getElementById('ddl-file').value;
            if (!fileId || fileId === "-1")
                return Swal.showValidationMessage(`Please select a file.`);
        },
    }).then(result => {
        if(result.value) {
            const fileId = document.getElementById('ddl-file').value;
            callback(fileId);
        }
    });
}

export const swalVendorFilesToMoodboard = (dropdownsHtml, callback) => {
    Swal.fire({
        title: `Choose a file from Vendor's`,
        html: `<input type="text" id="txt-title" class="swal2-input" placeholder="Title" />
                <textarea type="text" id="txt-description" class="swal2-input" placeholder="Description..."></textarea>
                ${dropdownsHtml}
                <select id="ddl-type" class="swal2-select">
                <option value="-1">Choose type</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="image">Image</option></select>`,
        showCancelButton: true,
        confirmButtonText: `Save`,
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const title = document.getElementById('txt-title').value;
            if(!title || title.length === 0)
                return Swal.showValidationMessage(`Please provide a title.`);

            const fileId = document.getElementById('ddl-file').value;
            if (!fileId || fileId === "-1")
                return Swal.showValidationMessage(`Please select a file.`);

            const typeId = document.getElementById('ddl-type').value;
            if (!typeId || typeId === "-1")
                return Swal.showValidationMessage(`Please select a type.`);
        },
    }).then(result => {
        if(result.value) {
            const title = document.getElementById('txt-title').value;
            const description = document.getElementById('txt-description').value;
            const fileId = document.getElementById('ddl-file').value;
            const typeId = document.getElementById('ddl-type').value;
            callback({
                title,
                description,
                fileId,
                typeId
            });
        }
    });
}
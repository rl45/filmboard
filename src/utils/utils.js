import config from '../config.json';

const getUrlVars = url => {
    var vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

export const getUrlParam = (url, parameter, defaultvalue) => {
    let urlparameter = defaultvalue;
    if (url.indexOf(parameter) > -1) {
        urlparameter = getUrlVars(url)[parameter];
    }
    return urlparameter;
}

export const getAllPackages = () => config.packages;
export const getPackage = id => config.packages.find(pkg => parseInt(pkg.id) === parseInt(id));

export const bytesToSize = bytes => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}